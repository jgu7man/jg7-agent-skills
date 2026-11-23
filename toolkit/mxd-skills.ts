#!/usr/bin/env npx tsx
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import { execSync } from 'node:child_process';

export enum CliCommandEnum {
  LIST = 'list',
  USE = 'use',
  INSTALL = 'install',
  INSTALL_GLOBAL = 'install-global',
  PACK_PLUGIN = 'pack-plugin',
  SYNC = 'sync',
}

export enum SkillPresetEnum {
  FULL = 'full',
  NX_CORE = 'nx-core',
  PRODUCT = 'product',
}

export interface SkillMetadata {
  readonly folderName: string;
  readonly name: string;
  readonly description: string;
}

export interface SkillsJsonEntry {
  readonly path: string;
  readonly include_only?: readonly string[];
  readonly exclude?: readonly string[];
}

export interface SkillsJsonManifest {
  readonly entries: readonly SkillsJsonEntry[];
}

const PRESET_SKILLS_RECORD: Record<SkillPresetEnum, readonly string[]> = {
  [SkillPresetEnum.FULL]: [],
  [SkillPresetEnum.NX_CORE]: [
    'tech-plan',
    'execute-ticket',
    'review-loop',
    'code-review',
    'sanitize-architecture',
    'bruno-qa',
    'refine-specs',
    'deploy',
    'friendly-git',
    'pwa-install',
  ],
  [SkillPresetEnum.PRODUCT]: [
    'jira',
    'confluence-authoring',
    'confluence-roadmap-planner',
    'refine-specs',
    'friendly-git',
    'illustrations',
  ],
};

const SKILLS_ROOT = path.resolve(__dirname, '..');
const GLOBAL_CONFIG_ROOT = path.join(os.homedir(), '.gemini', 'config');

function parseFrontmatter(content: string): { readonly name: string; readonly description: string } {
  const match = /^---\n([\s\S]*?)\n---/.exec(content);
  if (!match?.[1]) {
    return { name: 'unknown', description: '' };
  }
  const block = match[1];
  const nameMatch = /^name:\s*(.+)$/m.exec(block);
  const foldedMatch = /^description:\s*>-\n((?:[ \t]+.+\n?)+)/m.exec(block);
  const singleDescMatch = /^description:\s*(.+)$/m.exec(block);
  const rawDesc = foldedMatch?.[1]
    ? foldedMatch[1].replace(/\s+/g, ' ').trim()
    : (singleDescMatch?.[1]?.trim().replace(/^["']|["']$/g, '') ?? '');

  return {
    name: nameMatch?.[1]?.trim().replace(/^["']|["']$/g, '') ?? 'unknown',
    description: rawDesc,
  };
}

function discoverSkills(rootDir: string): readonly SkillMetadata[] {
  const entries = fs.readdirSync(rootDir, { withFileTypes: true });
  const results: SkillMetadata[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || entry.name === 'assets' || entry.name === 'toolkit' || entry.name.startsWith('.')) {
      continue;
    }
    const skillMdPath = path.join(rootDir, entry.name, 'SKILL.md');
    if (fs.existsSync(skillMdPath)) {
      const content = fs.readFileSync(skillMdPath, 'utf-8');
      const parsed = parseFrontmatter(content);
      results.push({
        folderName: entry.name,
        name: parsed.name,
        description: parsed.description,
      });
    }
  }

  return results.sort((a, b) => a.name.localeCompare(b.name));
}

function runList(): void {
  const skills = discoverSkills(SKILLS_ROOT);
  console.log(`\n📦 Marxa Digital Skills Toolkit (${skills.length} comandos de acción en /):\n`);
  for (const skill of skills) {
    const shortDesc = skill.description.length > 95 ? `${skill.description.slice(0, 92)}...` : skill.description;
    console.log(`  /${skill.name.padEnd(24)} -> ${shortDesc}`);
  }
  console.log('');
}

function runUseWorkspace(targetWorkspace: string, presetArg?: string): void {
  const preset: SkillPresetEnum =
    presetArg === SkillPresetEnum.NX_CORE
      ? SkillPresetEnum.NX_CORE
      : presetArg === SkillPresetEnum.PRODUCT
        ? SkillPresetEnum.PRODUCT
        : SkillPresetEnum.FULL;

  const resolvedWorkspace = path.resolve(targetWorkspace);
  const agentsDir = path.join(resolvedWorkspace, '.agents');
  fs.mkdirSync(agentsDir, { recursive: true });

  const includeOnly = PRESET_SKILLS_RECORD[preset];
  const entry: SkillsJsonEntry =
    includeOnly.length > 0
      ? { path: SKILLS_ROOT, include_only: includeOnly }
      : { path: SKILLS_ROOT, exclude: ['assets', 'toolkit'] };

  const manifest: SkillsJsonManifest = { entries: [entry] };
  const outPath = path.join(agentsDir, 'skills.json');
  fs.writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8');

  console.log(`✅ Generado ${outPath} (preset: ${preset})`);
}

function resolveSelectedSkillNames(selectorArg?: string): readonly string[] {
  const allSkills = discoverSkills(SKILLS_ROOT).map((s) => s.folderName);
  if (!selectorArg || selectorArg === SkillPresetEnum.FULL) {
    return allSkills;
  }
  if (selectorArg === SkillPresetEnum.NX_CORE) {
    return PRESET_SKILLS_RECORD[SkillPresetEnum.NX_CORE];
  }
  if (selectorArg === SkillPresetEnum.PRODUCT) {
    return PRESET_SKILLS_RECORD[SkillPresetEnum.PRODUCT];
  }
  return selectorArg
    .split(',')
    .map((s) => s.trim())
    .filter((s) => allSkills.includes(s));
}

function runInstallInProject(targetWorkspace: string, selectorArg?: string): void {
  const resolvedWorkspace = path.resolve(targetWorkspace);
  const targetSkillsDir = path.join(resolvedWorkspace, '.agents', 'skills');
  fs.mkdirSync(targetSkillsDir, { recursive: true });

  const selectedNames = resolveSelectedSkillNames(selectorArg);
  if (selectedNames.length === 0) {
    console.log('⚠️ No se encontraron skills que coincidan con el filtro indicado.');
    return;
  }

  for (const folderName of selectedNames) {
    const srcDir = path.join(SKILLS_ROOT, folderName);
    const dstDir = path.join(targetSkillsDir, folderName);
    if (fs.existsSync(srcDir)) {
      fs.cpSync(srcDir, dstDir, { recursive: true });
    }
  }

  console.log(
    `✅ Instalados ${selectedNames.length} skills en ${targetSkillsDir}:\n   ${selectedNames.map((n) => `/${n}`).join(', ')}`
  );
}

function runInstallGlobal(repoUrl?: string): void {
  const toolkitHome = path.join(os.homedir(), '.mxd-toolkit');
  if (repoUrl) {
    if (fs.existsSync(path.join(toolkitHome, '.git'))) {
      execSync('git pull --rebase', { cwd: toolkitHome, stdio: 'inherit' });
    } else {
      execSync(`git clone ${repoUrl} "${toolkitHome}"`, { stdio: 'inherit' });
    }
  }

  const sourcePath = repoUrl ? path.join(toolkitHome, 'skills') : SKILLS_ROOT;
  const globalSkillsJson = path.join(GLOBAL_CONFIG_ROOT, 'skills.json');
  const manifest: SkillsJsonManifest = {
    entries: [{ path: sourcePath, exclude: ['assets', 'toolkit'] }],
  };

  fs.mkdirSync(GLOBAL_CONFIG_ROOT, { recursive: true });
  fs.writeFileSync(globalSkillsJson, `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8');
  console.log(`✅ Registrado globalmente en ${globalSkillsJson} -> ${sourcePath}`);
}

function runPackPlugin(targetPluginDir?: string): void {
  const outDir = targetPluginDir
    ? path.resolve(targetPluginDir)
    : path.join(GLOBAL_CONFIG_ROOT, 'plugins', 'marxa-digital-toolkit');

  const skillsOutDir = path.join(outDir, 'skills');
  fs.mkdirSync(skillsOutDir, { recursive: true });

  const templatePath = path.join(__dirname, 'plugin.template.json');
  fs.copyFileSync(templatePath, path.join(outDir, 'plugin.json'));

  const skills = discoverSkills(SKILLS_ROOT);
  for (const skill of skills) {
    const srcSkillDir = path.join(SKILLS_ROOT, skill.folderName);
    const dstSkillDir = path.join(skillsOutDir, skill.folderName);
    fs.cpSync(srcSkillDir, dstSkillDir, { recursive: true });
  }

  console.log(`✅ Plugin de Antigravity empaquetado en: ${outDir} (${skills.length} skills incluidos)`);
}

function runSync(): void {
  if (!fs.existsSync(path.join(SKILLS_ROOT, '.git'))) {
    console.log(`⚠️ ${SKILLS_ROOT} aún no es un repositorio Git. Inicialízalo con: git init && git remote add origin <URL>`);
    return;
  }
  execSync('git pull --rebase', { cwd: SKILLS_ROOT, stdio: 'inherit' });
  console.log('✅ Sincronizado con el repositorio remoto.');
}

function main(): void {
  const [, , rawCommand, arg1, arg2] = process.argv;
  switch (rawCommand) {
    case CliCommandEnum.LIST:
    case undefined:
      runList();
      break;
    case CliCommandEnum.USE:
      runUseWorkspace(arg1 ?? process.cwd(), arg2);
      break;
    case CliCommandEnum.INSTALL:
      runInstallInProject(arg1 ?? process.cwd(), arg2);
      break;
    case CliCommandEnum.INSTALL_GLOBAL:
      runInstallGlobal(arg1);
      break;
    case CliCommandEnum.PACK_PLUGIN:
      runPackPlugin(arg1);
      break;
    case CliCommandEnum.SYNC:
      runSync();
      break;
    default:
      console.log(
        'Uso: npx tsx toolkit/mxd-skills.ts <list | install [path] [full|nx-core|product|s1,s2] | use [path] [full|nx-core|product] | install-global [repoUrl] | pack-plugin [outDir] | sync>'
      );
  }
}

main();
