---
type: wiki
title: '👥 Catálogo Maestro de Usuarios de Prueba (Dev & QA)'
description: 'Catálogo de cuentas y credenciales de prueba para QA y desarrollo (Suite AcademyModule, Suite CoreProduct y escenarios de Billing).'
tags: [jg7-core, academy, core-product, qa, dev, seeds, rbac, billing]
generated: { by: 'human:jguzman', at: '2026-08-20T03:15:47.000Z' }
lastUpdate: '2026-08-20T03:15:47.000Z'
spaceKey: DOCS
folderId: '382074881'
fileId: '382173186'
---

# 👥 Catálogo Maestro de Usuarios de Prueba (Dev & QA)

> **Entorno:** `core-product-test` (Dev Remoto) / Emuladores Locales  
> **Contraseña Global por Defecto:** `Pass1234!`  
> **Última Actualización:** Agosto 2026

---

## ⚽ 1. Suite AcademyModule (Tenant Institucional: `academy`)

Tenant multirrol con jerarquía completa para pruebas de roles y permisos (RBAC):

| Rol en Plataforma    | Rol en Negocio           | Nombre / Titular      | Correo Electrónico            | Contraseña  | UID                   | Propósito en QA                                                     |
| :------------------- | :----------------------- | :-------------------- | :---------------------------- | :---------- | :-------------------- | :------------------------------------------------------------------ |
| **Owner**            | Director Deportivo       | Cristiano Messi       | `cristiano.messi@academy.com` | `Pass1234!` | `dev-cristiano-messi` | Configuración general, reportes financieros y administración total. |
| **Owner (Fallback)** | Director Deportivo       | Cristiano Messi (Dev) | `user@example.com`            | `Pass1234!` | `dev-user-example`    | Usuario comodín para pruebas de integración continua.               |
| **Admin**            | Coordinador General      | Kylian Mbappé         | `mbappe@academy.com`          | `Pass1234!` | `dev-mbappe`          | Gestión de altas, cobros, alumnos y asignación de profesores.       |
| **Admin (CoreProduct)**  | Coordinador General      | Kylian Mbappé         | `mbappe@core-product.com`          | `Pass1234!` | `dev-mbappe-core-product`  | Validación de acceso cross-suite desde el lobby general.            |
| **Crew**             | Profesor Principal       | Erling Haaland        | `haaland@academy.com`         | `Pass1234!` | `dev-haaland`         | Registro de pase de lista y bitácora de asistencia táctil.          |
| **Crew**             | Profesor Auxiliar        | Lamine Yamal          | `yamal@academy.com`           | `Pass1234!` | `dev-yamal`           | Pase de lista auxiliar y visualización de grupos asignados.         |
| **Client**           | Tutor / Padre de Familia | Lionel Messi (Tutor)  | `tutor@academy.com`           | `Pass1234!` | `dev-tutor-messi`     | Consulta de asistencias, estados de cuenta y comprobantes de pago.  |

---

## 🏆 2. Suite CoreProduct (Tenants SaaS Independientes)

Cuentas representativas de clubes, academias y gimnasios autónomos dentro del Edificio CoreProduct:

| Negocio / Tenant ID                                     | Disciplina     | Nombre / Dueño  | Correo Electrónico    | Contraseña  | Tier SaaS                    |
| :------------------------------------------------------ | :------------- | :-------------- | :-------------------- | :---------- | :--------------------------- |
| **Academia de Tenis Alcaraz** (`tenant-alcaraz-tennis`) | Tenis          | Carlos Alcaraz  | `alcaraz@core-product.com` | `Pass1234!` | **Standard** (30 días trial) |
| **Club Femenil Alexia Putellas** (`tenant-alexia-fc`)   | Fútbol Femenil | Alexia Putellas | `alexia@core-product.com`  | `Pass1234!` | **Standard** (30 días trial) |

---

## 💳 3. Escenarios de Facturación & Suscripción (Billing Lifecycle)

Usuarios creados para validar el comportamiento visual de la app ante distintos estados de cobro y Stripe:

| Escenario                               | Tenant ID                      | Correo Electrónico                            | Contraseña  | Estado de Suscripción                | Comportamiento Esperado en UI                                              |
| :-------------------------------------- | :----------------------------- | :-------------------------------------------- | :---------- | :----------------------------------- | :------------------------------------------------------------------------- |
| **1. Suscripción Activa Regular**       | `tenant-billing-active`        | `owner-tenant-billing-active@test.com`        | `Pass1234!` | `active` (Visa 4242)                 | Acceso total sin banners de cobro.                                         |
| **2. Periodo de Prueba Activo**         | `tenant-billing-trial-active`  | `owner-tenant-billing-trial-active@test.com`  | `Pass1234!` | `active` (Trial: 10 días restantes)  | Banner superior informando días restantes de prueba con botón de Upgrade.  |
| **3. Trial Vencido**                    | `tenant-billing-trial-expired` | `owner-tenant-billing-trial-expired@test.com` | `Pass1234!` | `expired` (Degradado a Starter)      | Módulos avanzados bloqueados con candado visual y llamado a contratar.     |
| **4. Periodo de Gracia (Grace Period)** | `tenant-billing-grace-period`  | `owner-tenant-billing-grace-period@test.com`  | `Pass1234!` | `past_due` (Pago falló hace 32 días) | Banner de advertencia en color ámbar/rojo solicitando regularizar tarjeta. |
| **5. Suscripción Expirada**             | `tenant-billing-expired`       | `owner-tenant-billing-expired@test.com`       | `Pass1234!` | `expired` (>35 días de mora)         | Acceso restringido al plan básico y bloqueo de operaciones masivas.        |
| **6. Socio / Partner (Cortesía)**       | `tenant-billing-partner`       | `owner-tenant-billing-partner@test.com`       | `Pass1234!` | `active` (Tier: Partner)             | Acceso ilimitado sin cargos recurrentes de Stripe.                         |

---

## 🚀 Cómo sembrar estos datos en tu entorno

```bash
# Para entorno local (Firebase Emulators)
nx run seeds:all

# Para entorno remoto de desarrollo (Firebase core-product-test)
nx run seeds:run-dev-remote
```
