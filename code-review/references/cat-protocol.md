---
type: playbook
title: '🛡️ Playbook: Auditoría y Saneamiento Integral del Monorepo'
description: 'Procedimiento estandarizado en 6 pasos para auditar, sanear y mantener la calidad del monorepo el Monorepo Nx (Estándar JG7).'
tags: [jg7-core, devops, arquitectura, auditoria, nx, calidad, tooling]
generated: { by: 'human:jguzman', at: '2026-08-20T03:45:00.000Z' }
lastUpdate: '2026-08-20T03:45:00.000Z'
spaceKey: DOCS
folderId: '382074881'
---

# 🛡️ Playbook: Auditoría y Saneamiento Integral del Monorepo

Este documento formaliza el procedimiento estandarizado para auditar, sanear y mantener la calidad del monorepo **el Monorepo Nx (Estándar JG7)** en futuras iteraciones y migraciones.

---

## 🧭 Flujo de Trabajo en 6 Pasos

```
1. Auditoría de Legacidad ──► 2. Modularización ──► 3. Utilidades & DRY
            │                                              │
            ▼                                              ▼
4. Scripts & Automatización ◄── 5. Tooling Nx ◄── 6. Pipeline CI/CD
```

---

## 🔍 Paso 1: Auditoría de Legacidad y Prefijos

### Objetivos:

- Detectar código remanente de proyectos previos (ej. prefijos `mp-*`, nombres quemados o configuraciones huérfanas).
- Asegurar branding neutro y dinámico.

### Checklist:

- [ ] **Selectores:** Verificar que los componentes compartidos utilicen prefijos aprobados (`ui-*`, `jg7-*`, `feat-*`).
- [ ] **Configuraciones de Linter:** Asegurar que `eslint.config.mjs` y `project.json` en cada biblioteca tengan configurado `"prefix": ["ui", "jg7"]`.
- [ ] **Magic Strings:** Auditar que no existan strings literales en `localStorage`/`sessionStorage`; usar `CoreStorageKey`.
- [ ] **Rutas:** Usar siempre los enums `CoreRoute`, `CorePath`, `ModuleRoute`, `ModulePath`.

---

## 🗂️ Paso 2: Auditoría de Arquitectura y Atomic Design (`@jg7/core-ui`)

### Objetivos:

- Organizar componentes en subcarpetas semánticas por responsabilidad.
- Evitar dependencias circulares entre barrels.

### Checklist:

- [ ] **Átomos:** Agrupados en `forms/`, `buttons/`, `indicators/`, `feedback/`.
- [ ] **Moléculas:** Agrupadas en `billing/`, `account/`, `navigation/`, `display/`, `forms/`.
- [ ] **Organismos:** Agrupados en `navigation/`, `data/`, `overlays/`, `presentation/`.
- [ ] **Barrels:** Importaciones internas entre carpetas de una misma lib deben usar rutas relativas directas (ej. `../../../molecules/display/item.component`) para evitar ciclos en Jest.

---

## 🧰 Paso 3: Auditoría de Utilidades y Principio "Utility-First" (`@jg7/core-utils`)

### Objetivos:

- Centralizar toda función pura, formateador o validador.
- Mantener 100% de cobertura en pruebas unitarias.

### Checklist:

- [ ] **Auditoría Previa:** Buscar si ya existe una función utilitaria antes de escribir lógica inline.
- [ ] **Aislamiento:** Extraer lógica matemática o de transformación fuera de componentes y Cloud Functions.
- [ ] **Tests Unitarios:** Cada archivo `*.util.ts` o `*.helpers.ts` debe tener su `*.spec.ts` en Jest con casos de éxito, borde y errores.

---

## ⚙️ Paso 4: Auditoría de Tooling y Configuración Nx

### Objetivos:

- Garantizar que todas las librerías se auditen y prueben en el pipeline general.

### Checklist:

- [ ] **Targets en `project.json`:** Toda librería debe tener configurados sus targets `test` (`@nx/jest:jest`) y `lint` (`@nx/eslint:lint`).
- [ ] **`tsconfig.spec.json`:** Debe heredar `"module": "preserve"` con `"moduleResolution": "bundler"`. **Nunca colocar `"module": "commonjs"`** si el root usa bundler.
- [ ] **Reset de Cache:** Ejecutar `pnpm exec nx reset` si Nx no detecta targets recién añadidos.

---

## 📜 Paso 5: Auditoría de Scripts de Plataforma (`scripts/`)

### Objetivos:

- Garantizar que todas las herramientas de soporte sean robustas y estén tipadas.

### Checklist:

- [ ] **TypeScript Obligatorio:** Todos los scripts deben ser `.ts` (`pnpm exec ts-node scripts/*.ts`). Queda prohibido `.js`.
- [ ] **Rutas Actualizadas:** Los scripts que interactúan con apps (`start-app.ts`, `gen-env.ts`) deben apuntar a las aplicaciones vigentes (`apps/core-product/*`).
- [ ] **Puertos y Emuladores:** Scripts como `emulate.ts` deben limpiar puertos residuales antes de iniciar.

---

## 🧪 Paso 6: Pipeline de Verificación Obligatorio

Antes de solicitar o realizar cualquier commit, es mandatorio ejecutar la tríada de validación:

```bash
# 1. Formatear todo el monorepo
pnpm exec nx format:write

# 2. Ejecutar todas las pruebas unitarias
pnpm run test:all

# 3. Ejecutar linters en todos los proyectos
pnpm exec nx run-many -t lint
```
