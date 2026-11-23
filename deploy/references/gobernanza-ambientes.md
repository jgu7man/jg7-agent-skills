---
type: spec
title: '⚙️ 03. Gobernanza de Ambientes y Resolución de config.json'
description: 'Arquitectura híbrida de configuración entre Realtime Database (RTDB) en caliente, Firestore y CI/CD build-time config.json.'
tags: [valle, goolima, rtdb, firestore, configuracion, gobernanza, cicd]
generated: { by: 'human:jguzman', at: '2026-08-20T03:45:00.000Z' }
lastUpdate: '2026-08-20T03:45:00.000Z'
spaceKey: GOOL
folderId: '382074881'
---

# ⚙️ 03. Gobernanza de Ambientes y Resolución de `config.json`

## 1. El Problema que Resuelve

En aplicaciones multi-marca y multi-vertical, compilar valores hardcodeados en el código TypeScript (`environment.ts`) destruye la flexibilidad y obliga a recompilar todo el proyecto ante cualquier cambio de color, logo o URL.

El Valle utiliza una **Gobernanza Híbrida de Configuración**:

- **Realtime Database (RTDB):** Identidad visual (`branding` con `titleSegments`), plantillas de tema (`theme`), terminología de dominio (`terminology`) y copies. Cero costo de lectura por documento, reactividad instantánea en caliente y soporte offline nativo.
- **Cloud Firestore:** Tiers SaaS (`tiers`), Planes de Stripe (`plans`), versiones de la app (`releases`) y configuración de infraestructura para el SDK de Firebase (`config/{env}.firebase`) y Sentry (`config/{env}.sentry`).
- **CI/CD Build-Time (`generate-runtime-config.ts`):** En tiempo de despliegue, consulta Firestore usando la Service Account y genera el artefacto `/dist/apps/{targetApp}/config.json` listo para ser servido estáticamente.

---

## 2. El Esquema Canónico de `config.json` en `dist/`

Generado exclusivamente en el bundle compilado (`dist/apps/.../config.json`):

```json
{
  "appId": "goolima",
  "version": "1.0.0",
  "branding": {
    "appName": "GOOLIMA",
    "subTitle": "Escuela Formativa de Fútbol",
    "titleSegments": [
      {
        "text": "GOOLIMA",
        "color": "text-emerald-500",
        "fontWeight": "black"
      },
      {
        "text": " CRM",
        "color": "text-slate-300",
        "fontWeight": "normal"
      }
    ],
    "logoUrl": "/favicon.svg",
    "primaryColor": "#0d9488",
    "secondaryColor": "#0f172a",
    "fontFamily": "Agency FB, sans-serif"
  },
  "authExperience": {
    "layoutVariant": "GOOLIMA",
    "allowSelfRegistration": false,
    "registrationDisabledNotice": "El acceso es exclusivo para profesores y directores de GOOLIMA.",
    "socialProviders": []
  },
  "navigation": {
    "showBottomNav": true,
    "defaultRoute": "/dashboard"
  },
  "remotes": {
    "sports": "https://crm-goolima-dev.web.app/remoteEntry.js"
  },
  "firebase": {
    "apiKey": "AIzaSy...",
    "authDomain": "pro-fees-test.firebaseapp.com",
    "projectId": "pro-fees-test",
    "storageBucket": "pro-fees-test.firebasestorage.app",
    "messagingSenderId": "1075101749723",
    "appId": "1:1075101749723:web:...",
    "databaseURL": "https://pro-fees-test-default-rtdb.firebaseio.com"
  },
  "sentry": {
    "enabled": true,
    "dsn": "https://o450...@ingest.sentry.io/...",
    "tracesSampleRate": 0.2
  },
  "externalUrl": {
    "public": "https://crm-goolima-dev.web.app",
    "helpDesk": "https://soporte.marxadigital.com",
    "supportWhatsApp": "523121044791"
  }
}
```

---

## 3. Matriz de Ambientes del Valle

| Ambiente                   | Propósito                              | Base de Datos                          | Hostings de Lobbies                | CDN de Motores              |
| :------------------------- | :------------------------------------- | :------------------------------------- | :--------------------------------- | :-------------------------- |
| **Dev (Local / Emulador)** | Desarrollo diario de ingenieros.       | Emuladores Firebase (8080, 9099, 9000) | `localhost:4200`, `localhost:4202` | `localhost:4201`            |
| **Beta (Dev Remoto / QA)** | Validación y pruebas con backend real. | `pro-fees-test` / `miss-pedidos-dev`   | `crm-goolima-dev.web.app`          | `profees-motor-dev.web.app` |
| **Prod (Producción)**      | Operación comercial real.              | `pro-fees-prod` / `miss-pedidos`       | `app.goolima.com`                  | `cdn.profees.io`            |

---

## 4. Pipeline de CI/CD: Matriz Dinámica con Nx Affected

```mermaid
graph TD
    A[Push a main / Dispatch Manual] --> B[Job 1: detect-affected]
    B -->|nx show projects --affected --with-target=deploy --json| C{¿Apps Afectadas?}
    C -->|No| D[🏁 Fin: Nada que desplegar]
    C -->|Sí| E[Dynamic Matrix: outputs.projects]
    E --> F[Job 2.1: Deploy goolima-lobby]
    E --> G[Job 2.2: Deploy main-lobby]
    F --> H[1. Build Angular Bundle]
    H --> I[2. generate-runtime-config.ts desde Firestore]
    I --> J[3. firebase deploy --only hosting:{project}]
```
