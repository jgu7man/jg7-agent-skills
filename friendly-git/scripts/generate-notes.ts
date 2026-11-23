import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Obtiene la lista de archivos modificados en git respecto a una rama base.
 */
function getModifiedFiles(baseBranch: string): string[] {
  try {
    execSync('git fetch origin', { stdio: 'ignore' });
  } catch {
    // Ignorar fallos de red
  }

  try {
    const output = execSync(`git diff --name-only ${baseBranch}...HEAD`, {
      encoding: 'utf8',
    });
    return output
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);
  } catch (error) {
    console.warn(
      `[!] Error comparando con la rama ${baseBranch}. Usando commit anterior (HEAD~1).`,
    );
    try {
      const output = execSync('git diff --name-only HEAD~1...HEAD', {
        encoding: 'utf8',
      });
      return output
        .split('\n')
        .map((f) => f.trim())
        .filter((f) => f.length > 0);
    } catch {
      return [];
    }
  }
}

// Diccionario de mapeo de archivos de Functions a nombres reales de Cloud Functions en producción
const FUNCTION_MAP: Record<string, string[]> = {
  'functions/src/callables/public/get-public-profile.ts': ['getPublicProfile'],
  'functions/src/callables/public/submit-affiliation.ts': ['submitAffiliation'],
  'functions/src/callables/public/register-user.ts': ['registerUser'],
  'functions/src/callables/copilot/copiloto-chat.ts': ['copilotoChat'],
  'functions/src/callables/tenant/recalculate-tenant-stats.ts': [
    'recalculateTenantStats',
  ],
  'functions/src/callables/tenant/recalculate-stats.helpers.ts': [
    'recalculateTenantStats',
  ],
  'functions/src/triggers/firestore/catalog-embeddings.ts': [
    'embedOnProductWrite',
  ],
  'functions/src/triggers/firestore/event-capture.ts': [
    'onAfiliadoWrite',
    'onPedidoWrite',
  ],
  'functions/src/triggers/firestore/stats-updater.ts': ['onPedidoWrite'],
  'functions/src/schedulers/scheduler-affiliates.ts': ['detectAffiliateIssues'],
  'functions/src/schedulers/scheduler-orders.ts': [
    'detectCriticalOrders',
    'dailyStatsRefresh',
    'monthlyStatsRollover',
  ],
};

interface DeploymentUnits {
  functions: Set<string>;
  schedulers: Set<string>;
  rules: string[];
  frontends: Set<string>;
  scripts: string[];
}

/**
 * Consulta a Nx qué aplicaciones frontend se ven afectadas por los cambios.
 */
function getAffectedFrontends(baseBranch: string): string[] {
  try {
    const cleanBase = baseBranch.replace('origin/', '');
    const output = execSync(
      `pnpm nx show projects --affected --type=app --base=origin/${cleanBase}`,
      {
        encoding: 'utf8',
        stdio: ['pipe', 'pipe', 'ignore'],
      },
    );
    return output
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0 && line !== 'functions');
  } catch (error) {
    console.warn(
      '[!] Error consultando proyectos afectados con Nx. Usando fallback manual.',
    );
    return [];
  }
}

/**
 * Clasifica los archivos modificados en las categorías de despliegue reales.
 */
function classifyFiles(files: string[], baseBranch: string): DeploymentUnits {
  const units: DeploymentUnits = {
    functions: new Set<string>(),
    schedulers: new Set<string>(),
    rules: [],
    frontends: new Set<string>(),
    scripts: [],
  };

  // 1. Obtener frontends afectados dinámicamente mediante el motor de Nx
  const affectedApps = getAffectedFrontends(baseBranch);
  affectedApps.forEach((app) => units.frontends.add(app));

  // 2. Procesar los demás tipos de despliegues (backend, reglas, scripts)
  for (const file of files) {
    if (
      file.endsWith('.spec.ts') ||
      file.endsWith('.test.ts') ||
      file.endsWith('.md') ||
      file.endsWith('.png') ||
      file.endsWith('.webp')
    ) {
      continue;
    }

    // Schedulers
    if (file.startsWith('functions/src/schedulers/')) {
      const mapped = FUNCTION_MAP[file];
      if (mapped) {
        mapped.forEach((f) => units.schedulers.add(f));
      } else {
        units.schedulers.add(path.basename(file, '.ts'));
      }
    }
    // Cloud Functions Callables y Triggers
    else if (
      file.startsWith('functions/src/callables/') ||
      file.startsWith('functions/src/triggers/')
    ) {
      const mapped = FUNCTION_MAP[file];
      if (mapped) {
        mapped.forEach((f) => units.functions.add(f));
      } else {
        units.functions.add(path.basename(file, '.ts'));
      }
    }
    // Reglas de Base de Datos, Storage e Índices de Firebase
    else if (
      file.endsWith('.rules') ||
      file.endsWith('firestore.indexes.json') ||
      file === 'firebase.json' ||
      file === '.firebaserc'
    ) {
      units.rules.push(file);
    }
    // Scripts de lanzamiento / Migraciones
    else if (
      file.startsWith('scripts/release/') ||
      file.startsWith('functions/scripts/release/')
    ) {
      units.scripts.push(file);
    }
    // Fallback de Frontends en caso de que Nx no haya retornado nada pero tengamos cambios en apps/libs
    else if (units.frontends.size === 0) {
      if (
        file.startsWith('apps/dashboard/') ||
        file.startsWith('libs/dashboard/') ||
        file.startsWith('libs/auth/')
      ) {
        units.frontends.add('dashboard');
      } else if (
        file.startsWith('apps/public/') ||
        file.startsWith('libs/public/')
      ) {
        units.frontends.add('public');
      } else if (file.startsWith('apps/tenant-landing/')) {
        units.frontends.add('tenant-landing');
      } else if (file.startsWith('libs/shared/')) {
        units.frontends.add('dashboard');
        units.frontends.add('public');
        units.frontends.add('tenant-landing');
      }
    }
  }

  return units;
}

/**
 * Genera el Release Note en formato Markdown.
 */
function generateMarkdown(units: DeploymentUnits, branchName: string): string {
  const lines: string[] = [];

  lines.push('# 📦 Release Notes & Checklist de Despliegue');
  lines.push('');
  lines.push(`**Rama**: \`${branchName}\``);
  lines.push(
    `**Fecha de Análisis**: ${new Date().toLocaleDateString('es-MX')}`,
  );
  lines.push('');
  lines.push('## 📝 Descripción del Release');
  lines.push(
    '> *[Agrega aquí una descripción enfocada en la usabilidad y valor de producto]*',
  );
  lines.push('');
  lines.push('## 🚀 Checklist de Componentes a Desplegar');
  lines.push('');

  // 1. Cloud Functions
  if (units.functions.size > 0) {
    lines.push('- **Cloud Functions (Callables & Triggers)**:');
    Array.from(units.functions).forEach((f) => lines.push(`  - [ ] \`${f}\``));
  } else {
    lines.push('* **Cloud Functions**: No se requieren despliegues. ✅');
  }
  lines.push('');

  // 2. Schedulers
  if (units.schedulers.size > 0) {
    lines.push('- **Schedulers (Cron Jobs)**');
    Array.from(units.schedulers).forEach((f) => lines.push(`  - [ ] \`${f}\``));
  } else {
    lines.push('* **Schedulers**: No se requieren despliegues. ✅');
  }
  lines.push('');

  // 3. Reglas de Base de Datos
  if (units.rules.length > 0) {
    lines.push('- **Base de Datos / Reglas de Seguridad**');
    units.rules.forEach((f) => lines.push(`  - [ ] Redesplegar \`${f}\``));
  } else {
    lines.push('* **Base de Datos / Reglas**: No se requieren cambios. ✅');
  }
  lines.push('');

  // 4. Frontends
  if (units.frontends.size > 0) {
    lines.push('- **Aplicaciones Frontend**');
    Array.from(units.frontends).forEach((app) =>
      lines.push(`  - [ ] Desplegar aplicación \`${app}\``),
    );
  } else {
    lines.push('* **Aplicaciones Frontend**: No se requieren despliegues. ✅');
  }
  lines.push('');

  // 5. Scripts de Lanzamiento
  if (units.scripts.length > 0) {
    lines.push('- **Acciones Manuales / Scripts de Lanzamiento**');
    units.scripts.forEach((f) =>
      lines.push(`  - [ ] Ejecutar script \`${f}\``),
    );
  } else {
    lines.push(
      '* **Acciones Manuales / Scripts**: No se requieren acciones. ✅',
    );
  }
  lines.push('');

  return lines.join('\n');
}

/**
 * Convierte Markdown básico a XHTML de Confluence.
 */
function markdownToConfluenceHtml(md: string): string {
  return md
    .split('\n')
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('# ')) {
        return `<h1>${trimmed.slice(2)}</h1>`;
      }
      if (trimmed.startsWith('## ')) {
        return `<h2>${trimmed.slice(3)}</h2>`;
      }
      if (trimmed.startsWith('> ')) {
        return `<blockquote>${trimmed.slice(2)}</blockquote>`;
      }
      if (trimmed.startsWith('- [ ] ') || trimmed.startsWith('- [x] ')) {
        const checked = trimmed.startsWith('- [x]');
        const text = trimmed.slice(6);
        return `<ul><li>${checked ? '☑' : '☐'} ${text}</li></ul>`;
      }
      if (trimmed.startsWith('- ')) {
        return `<ul><li>${trimmed.slice(2)}</li></ul>`;
      }
      if (trimmed.startsWith('* ')) {
        return `<ul><li>${trimmed.slice(2)}</li></ul>`;
      }
      if (trimmed.length === 0) {
        return '<br/>';
      }
      return `<p>${line}</p>`;
    })
    .join('\n');
}

/**
 * Publica las notas de lanzamiento en Confluence usando Atlassian REST API.
 */
async function publishToConfluence(markdown: string, title: string) {
  const {
    CONFLUENCE_EMAIL,
    CONFLUENCE_API_TOKEN,
    CONFLUENCE_BASE_URL,
    CONFLUENCE_SPACE_KEY,
    CONFLUENCE_RELEASE_NOTES_PARENT_ID,
  } = process.env;

  if (
    !CONFLUENCE_EMAIL ||
    !CONFLUENCE_API_TOKEN ||
    !CONFLUENCE_BASE_URL ||
    !CONFLUENCE_SPACE_KEY ||
    !CONFLUENCE_RELEASE_NOTES_PARENT_ID
  ) {
    console.log(
      '[info] Faltan variables de entorno de Confluence. Omitiendo publicación.',
    );
    return;
  }

  const cleanBaseUrl = CONFLUENCE_BASE_URL.replace(/\/$/, '');
  const url = `${cleanBaseUrl}/rest/api/content`;
  const auth = Buffer.from(
    `${CONFLUENCE_EMAIL}:${CONFLUENCE_API_TOKEN}`,
  ).toString('base64');
  const htmlBody = markdownToConfluenceHtml(markdown);

  console.log(
    `[info] Buscando si la página "${title}" ya existe en Confluence...`,
  );

  try {
    const searchUrl = `${url}?title=${encodeURIComponent(title)}&spaceKey=${CONFLUENCE_SPACE_KEY}&expand=version`;
    const searchResponse = await fetch(searchUrl, {
      headers: { Authorization: `Basic ${auth}` },
    });

    if (!searchResponse.ok) {
      throw new Error(`Error buscando página: ${searchResponse.statusText}`);
    }

    const searchResult = (await searchResponse.json()) as any;
    const exists = searchResult.results && searchResult.results.length > 0;

    if (exists) {
      const page = searchResult.results[0];
      const pageId = page.id;
      const currentVersion = page.version.number;

      console.log(
        `[info] Página existente encontrada (ID: ${pageId}). Actualizando a la versión ${currentVersion + 1}...`,
      );

      const updateResponse = await fetch(`${url}/${pageId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: pageId,
          type: 'page',
          title: title,
          space: { key: CONFLUENCE_SPACE_KEY },
          body: {
            storage: {
              value: htmlBody,
              representation: 'storage',
            },
          },
          version: {
            number: currentVersion + 1,
          },
        }),
      });

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(
          `Error actualizando página: ${updateResponse.status} - ${errorText}`,
        );
      }

      console.log(
        `[ok] Página de Confluence actualizada exitosamente: ${cleanBaseUrl}/pages/viewpage.action?pageId=${pageId}`,
      );
    } else {
      console.log('[info] Creando nueva página en Confluence...');

      const createResponse = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'page',
          title: title,
          space: { key: CONFLUENCE_SPACE_KEY },
          ancestors: [{ id: CONFLUENCE_RELEASE_NOTES_PARENT_ID }],
          body: {
            storage: {
              value: htmlBody,
              representation: 'storage',
            },
          },
        }),
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        throw new Error(
          `Error creando página: ${createResponse.status} - ${errorText}`,
        );
      }

      const createResult = (await createResponse.json()) as any;
      console.log(
        `[ok] Página de Confluence creada exitosamente: ${cleanBaseUrl}/pages/viewpage.action?pageId=${createResult.id}`,
      );
    }
  } catch (error: any) {
    console.error(
      '[x] Error interactuando con Confluence:',
      error.message || error,
    );
  }
}

async function main() {
  const args = process.argv.slice(2);
  const baseBranch = args[0] || 'origin/main';
  const shouldPublish = args.includes('--publish');

  let branchName = process.env.BRANCH_NAME || '';

  if (!branchName) {
    try {
      branchName = execSync('git rev-parse --abbrev-ref HEAD', {
        encoding: 'utf8',
      }).trim();
    } catch {
      try {
        branchName = execSync('git branch --show-current', {
          encoding: 'utf8',
        }).trim();
      } catch {
        branchName = 'desconocido';
      }
    }
  }

  if (branchName === 'HEAD') {
    branchName = process.env.GITHUB_HEAD_REF || 'desconocido';
  }

  console.log(`[info] Rama actual: ${branchName}`);
  console.log(`[info] Analizando diff contra la rama base: ${baseBranch}...`);
  const modifiedFiles = getModifiedFiles(baseBranch);

  if (modifiedFiles.length === 0) {
    console.log('[info] No se encontraron archivos modificados.');
    process.exit(0);
  }

  console.log(
    `[info] Se encontraron ${modifiedFiles.length} archivos modificados.`,
  );
  const units = classifyFiles(modifiedFiles, baseBranch);
  const markdown = generateMarkdown(units, branchName);

  const outputPath = path.join(process.cwd(), 'release_notes_draft.md');
  fs.writeFileSync(outputPath, markdown, 'utf8');
  console.log(`[ok] Borrador guardado localmente en: ${outputPath}`);

  console.log('\n--- BORRADOR DE RELEASE NOTES GENERADO ---\n');
  console.log(markdown);
  console.log('\n------------------------------------------\n');

  if (shouldPublish) {
    const environmentName = baseBranch.includes('develop')
      ? 'Desarrollo'
      : 'Producción';
    const pageTitle = `Release Notes - ${branchName} (${environmentName})`;
    await publishToConfluence(markdown, pageTitle);
  }
}

main();
