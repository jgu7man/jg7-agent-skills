---
type: architecture
title: '📦 09. Arquitectura de Features e Infraestructura Compartida'
description: 'Módulos transversales del scope @mx-valley/*: AuthState reactivo, Firestore Resource Service, Utilidades puras y Seeds.'
tags: [valle, shared, auth, firestore, util, arquitectura, libs]
generated: { by: 'human:jguzman', at: '2026-08-20T03:45:00.000Z' }
lastUpdate: '2026-08-20T03:45:00.000Z'
spaceKey: GOOL
folderId: '382074881'
---

# 📦 09. Arquitectura de Features e Infraestructura Compartida (`libs/shared/*`)

El directorio `libs/shared/` contiene los cimientos transversales de **MX Business Valley**, empaquetados bajo el scope `@mx-valley/*`.

---

## 1. Módulo de Autenticación (`@mx-valley/auth`)

Maneja el ciclo de vida de la sesión con **Firebase Authentication**, independiente del dominio o la marca:

### Componentes Clave:

- **`AuthState` (Signal Reactivo):** Expone `user()`, `userId()`, `isLoggedIn()`, e `initialized()`. Los componentes no se suscriben a observables manuales; leen signals de Angular.
- **`AuthResourceService`:** Implementa los métodos de acceso:
  - `loginWithEmail(email, password)`
  - `loginWithGoogle()`
  - `register(email, password)`
  - `sendPasswordResetEmail(email)`
  - `logout()`
- **Guards de Enrutamiento:**
  - `authGuard`: Protege rutas privadas. Si no hay sesión, redirige a `/login`.
  - `noAuthGuard`: Impide a usuarios autenticados acceder a `/login` (los redirige al `/workspace`).
  - `emailVerifiedGuard`: Bloquea el acceso a funciones críticas si el correo no ha sido verificado.

---

## 2. Módulo de Layout (`@mx-valley/layout`)

Provee las carcasas estructurales que envuelven la aplicación en el navegador:

### Componentes Clave:

- **`DashboardLayoutComponent`:**
  - Sidebar retráctil y adaptable a móviles.
  - Header institucional con selector de sedes/academias y menú de perfil.
  - Punto de anclaje `<router-outlet />` donde se monta el **Motor Remoto** cargado dinámicamente vía Native Federation.
- **`TrialExpirationBannerComponent`:** Banner flotante no invasivo que alerta cuando el periodo de prueba de 14/30 días está por expirar.
- **`VersionUpdateAlertComponent`:** Detecta en caliente si hay una nueva versión desplegada en el CDN y ofrece el botón de actualización inmediata.

---

## 3. Módulo de Sistema de Diseño (`@mx-valley/ui`)

Diseño atómico bajo la filosofía de **Glassmorphism y Alto Contraste**:

### Átomos (`atoms/`):

- `ButtonComponent`: Botones con variantes (`primary`, `secondary`, `outline`, `ghost`, `danger`) y estados de carga (`loading`).
- `ToastService` & `ToastComponent`: Sistema reactivo de alertas flotantes (éxito, error, advertencia) sin dependencias pesadas.
- `BadgeComponent` & `StatusDotComponent`: Semáforos visuales para asistencia (`presente`, `ausente`, `justificada`, `adeudo`).
- `InputFieldComponent`, `EmailInputComponent`, `PhoneInputComponent`: Inputs con validación visual inmediata.

### Moléculas (`molecules/`):

- `GlassCardComponent`: Contenedores con profundidad visual, borde sutil y `backdrop-filter: blur(12px)`.
- `UpgradeFeatureModalComponent`: Modal de paywall y pasarela de pago que conecta directamente con **Stripe Checkout**.
- `SubscriptionTabComponent`: Panel de administración del plan activo, fecha de renovación y método de pago.
- `KpiCardComponent`: Métricas ejecutivas (total de alumnos, porcentaje de asistencia, ingresos del mes).

---

## 4. Contratos de Backend (`@mx-valley/cf-contracts`)

Librería de **TypeScript Puro** (sin dependencias de `@angular/core` ni Angular Fire):

- Define las interfaces y payloads de entrada/salida de las Cloud Functions de 2nd Gen (`auth.contracts.ts`, `tenant.contracts.ts`, `copiloto.contracts.ts`).
- Permite que el frontend y el backend compartan exactamente los mismos contratos sin riesgo de incompatibilidad en pruebas unitarias de Jest.
