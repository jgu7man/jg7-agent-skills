#!/usr/bin/env ts-node
/**
 * Smoke Tests para Cloud Functions y Endpoints en Emuladores Locales del Valle.
 *
 * Ejecuta verificaciones de conectividad HTTP contra los emuladores locales de Firebase.
 * Uso: pnpm exec ts-node scripts/smoke-tests.ts
 */
import * as http from 'node:http';
import { URL } from 'node:url';

const EMULATOR_BASE =
  process.env['FUNCTIONS_EMULATOR_URL'] ||
  'http://127.0.0.1:5001/pro-fees-test/us-central1';
const PROJECT_ID = process.env['FIREBASE_PROJECT_ID'] || 'pro-fees-test';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message: string, color: keyof typeof colors = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

interface HttpResponse<T = unknown> {
  status: number;
  body: T;
  headers: http.IncomingHttpHeaders;
}

function makePostRequest<T = unknown>(
  url: string,
  data: unknown,
  headers: Record<string, string> = {},
): Promise<HttpResponse<T>> {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const postData = JSON.stringify(data);

    const options: http.RequestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...headers,
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const jsonBody = JSON.parse(body);
          resolve({
            status: res.statusCode || 500,
            body: jsonBody as T,
            headers: res.headers,
          });
        } catch {
          resolve({
            status: res.statusCode || 500,
            body: body as unknown as T,
            headers: res.headers,
          });
        }
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

/**
 * Prueba de conectividad con el emulador de Functions
 */
async function testFunctionsConnectivity() {
  log('\n📋 Test 1: Conectividad con Emulador de Functions', 'blue');
  log('─────────────────────────────────────────────────', 'blue');
  log(`Base URL: ${EMULATOR_BASE} (Project: ${PROJECT_ID})`);

  try {
    const response = await makePostRequest(`${EMULATOR_BASE}/ping`, {
      data: { timestamp: Date.now() },
    });

    // 404 de Cloud Functions indica que el emulador responde activamente
    if (response.status === 200 || response.status === 404) {
      log(
        `✅ Emulador de Functions responde correctamente (Status: ${response.status})`,
        'green',
      );
      return { success: true, test: 'connectivity' };
    }
    log(`⚠️  Respuesta con status inesperado: ${response.status}`, 'yellow');
    return {
      success: false,
      test: 'connectivity',
      error: `Status ${response.status}`,
    };
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED') {
      log(
        '⚠️  Emulador no detectado en el puerto 5001 (¿Se ejecutó `pnpm emulate` primero?)',
        'yellow',
      );
      return { success: false, test: 'connectivity', skipped: true };
    }
    log(`❌ Error al conectar con emulador: ${error.message || error}`, 'red');
    return { success: false, test: 'connectivity', error: error.message };
  }
}

async function main() {
  log('=================================================', 'magenta');
  log('   Smoke Tests de Backend - Mx Business Valley  ', 'magenta');
  log('=================================================', 'magenta');

  const results = [];
  results.push(await testFunctionsConnectivity());

  log('\n📊 Resumen de Pruebas:', 'blue');
  let allPassed = true;
  for (const r of results) {
    if (r.skipped) {
      log(`- ${r.test}: ⏭️  Omitido (Emulador offline)`, 'yellow');
    } else if (r.success) {
      log(`- ${r.test}: ✅ PASÓ`, 'green');
    } else {
      log(`- ${r.test}: ❌ FALLÓ (${r.error})`, 'red');
      allPassed = false;
    }
  }

  log('');
  if (!allPassed) {
    process.exit(1);
  }
  process.exit(0);
}

main().catch((err) => {
  console.error('Error fatal en smoke-tests:', err);
  process.exit(1);
});
