# Especificación Técnica: Formulario de Creación y Edición de Planes de Servicio (Categorías)

## 1. Resumen Ejecutivo y Propósito

El módulo de **Planes de Servicio / Categorías (`ServicePlan`)** es el núcleo de configuración académica, deportiva y financiera de la suite ProFees. Permite a los administradores de academias y clubes configurar:

1. **Reglas de Admisión:** Rangos de edad (ej. 6 a 7 años) y cupos máximos por grupo.
2. **Programación y Horarios:** Días de la semana y horas de entrenamiento.
3. **Esquema Financiero y Cobranza:** Cuotas de inscripción, precios recurrentes de colegiatura, descuentos por pronto pago y periodicidad de cobro.

Este documento formaliza la estructura, validaciones, componentes, contratos de datos y persistencia del formulario implementado en `CreateServicePlanModalComponent`.

---

## 2. Arquitectura de Componentes

```mermaid
graph TD
  SP[StudentsPageComponent / Sidebar] -->|open=true / planToEdit| CSPM[CreateServicePlanModalComponent]
  CSPM --> DWS[DaysOfWeekSelectorComponent (Shared UI)]
  CSPM --> SRS[SubscribersResourceService]
  SRS --> FS[(Firestore: tenants/{tenantId}/service_plans)]
  CSPM --> LS[(Local / Session Storage: Draft Backup)]
```

### Ubicación de Archivos:

- **Componente Modal:** [`libs/profees/suite-main/src/lib/plans/create-service-plan-modal.component.ts`](file:///Users/jgu7man/Code/marxa-digital/mx-business-valley/libs/profees/suite-main/src/lib/plans/create-service-plan-modal.component.ts)
- **Template HTML:** [`libs/profees/suite-main/src/lib/plans/create-service-plan-modal.component.html`](file:///Users/jgu7man/Code/marxa-digital/mx-business-valley/libs/profees/suite-main/src/lib/plans/create-service-plan-modal.component.html)
- **Modelos & Enums:** [`libs/profees/suite-main/src/lib/models/service-plan.model.ts`](file:///Users/jgu7man/Code/marxa-digital/mx-business-valley/libs/profees/suite-main/src/lib/models/service-plan.model.ts)
- **Selector de Días:** [`libs/shared/ui/src/lib/molecules/days-of-week-selector/days-of-week-selector.component.ts`](file:///Users/jgu7man/Code/marxa-digital/mx-business-valley/libs/shared/ui/src/lib/molecules/days-of-week-selector/days-of-week-selector.component.ts)

---

## 3. Secciones del Formulario

El formulario reactivo (`FormGroup`) está organizado en **4 bloques visuales y funcionales**:

### Bloque 1: Identidad & Modalidad del Plan

- **Tipo de Plan (`type`):**
  - `RECURRING_MEMBERSHIP` (Membresía / Colegiatura Recurrente - Default)
  - `FIXED_TERM` (Curso / Ciclo Cerrado)
  - `SESSION_PACK` (Paquete de Clases / Carnet de Sesiones)
  - `SINGLE_SESSION` (Clase Individual / Drop-in)
- **Nombre de la Categoría (`name`):**
  - _Validación:_ Obligatorio, mínimo 3 caracteres.
  - _Ejemplo:_ `"Categoría 2018 - 2019 (Pony)"`
- **Descripción (`description`):**
  - _Opcional:_ Texto descriptivo del programa o nivel formativo.

### Bloque 2: Reglas de Admisión & Capacidad

- **Edad Mínima (`minAge`) y Edad Máxima (`maxAge`):**
  - _Validación:_ Números enteros entre 1 y 99 años.
  - _Regla de Negocio:_ Si se establecen ambos, `minAge <= maxAge`.
- **Cupo Máximo (`maxCapacity`):**
  - _Validación:_ `0` o `null` representa cupo ilimitado. Mayor a 0 activa el control de aforo por grupo.

### Bloque 3: Horarios & Días de Entrenamiento

- **Días de la Semana (`selectedDays`):**
  - Manejado mediante el componente interactivo `DaysOfWeekSelectorComponent`.
  - Valores emitidos: Array de `DayOfWeekEnum` (`MONDAY`, `TUESDAY`, `WEDNESDAY`, `THURSDAY`, `FRIDAY`, `SATURDAY`, `SUNDAY`).
  - Botones rápidos: _"Lunes, Miércoles, Viernes"_, _"Martes y Jueves"_, _"Fin de Semana"_.
- **Horario (`startTime` / `endTime`):**
  - _Formato:_ `HH:mm` (24 horas).
  - _Validación:_ Hora de fin posterior a la hora de inicio.

### Bloque 4: Esquema Financiero & Cobranza

- **Colegiatura Recurrente (`recurringPrice`):**
  - _Validación:_ Obligatorio, `>= 0`.
  - _Frecuencia (`billingFrequency`):_ `MONTHLY` (Mensual), `BIWEEKLY` (Quincenal), `ANNUAL` (Anual).
- **Descuento por Pronto Pago (`earlyBirdPrice`):**
  - _Opcional:_ Monto con descuento si se liquida antes del día de corte.
- **Cuota de Inscripción (`requireRegistrationFee`):**
  - Switch booleano ON/OFF.
  - _Monto (`registrationFee`):_ Monto a liquidar en la matrícula.
  - _Periodicidad (`registrationFrequency`):_ `ANNUAL` (Anual), `ONCE` (Pago Único).

---

## 4. Contrato de Datos e Interfaces TypeScript

```typescript
export interface ServicePlan {
  id: string;
  name: string;
  description?: string;
  type: ServicePlanTypeEnum;
  pricing: PlanPricingConfig;
  rules?: PlanRules;
  schedules?: PlanScheduleSlot[];
  active: boolean;
  orderIndex?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlanPricingConfig {
  recurringPrice: number;
  earlyBirdPrice?: number;
  currency: string;
  frequency: BillingFrequencyEnum;
  registration?: PlanRegistrationConfig;
}

export interface PlanRegistrationConfig {
  fee: number;
  frequency: BillingFrequencyEnum;
}

export interface PlanRules {
  minAge?: number;
  maxAge?: number;
  maxCapacity?: number;
  [key: string]: unknown;
}

export interface PlanScheduleSlot {
  days: DayOfWeekEnum[];
  startTime: string;
  endTime: string;
  frequency?: BillingFrequencyEnum;
}
```

---

## 5. Modos de Operación: Creación vs Edición

| Característica       | Modo Creación (`planToEdit = null`)                                                            | Modo Edición (`planToEdit = ServicePlan`)                 |
| :------------------- | :--------------------------------------------------------------------------------------------- | :-------------------------------------------------------- |
| **Título del Modal** | _"Crear Nuevo Plan / Categoría"_                                                               | _"Editar Plan: [Nombre del Plan]"_                        |
| **Carga de Datos**   | Valores por defecto y restauración de borrador local (`ValleyStorageKey.CREATE_PLAN_DRAFT`)    | Pobla el formulario con la entidad existente en Firestore |
| **Persistencia**     | `SubscribersResourceService.createServicePlan(...)` con auto-generación de `id` y `orderIndex` | `SubscribersResourceService.updateServicePlan(id, ...)`   |
| **Eventos Emitidos** | `planCreated.emit({ planId, name })`                                                           | `planCreated.emit({ planId, name })`                      |
| **Feedback UI**      | Toast verde de éxito y selección automática del nuevo plan en el sidebar                       | Toast de confirmación de actualización en tiempo real     |

---

## 6. Resiliencia & Experiencia de Usuario (UX)

1. **Auto-guardado de Borrador (Draft Storage):**
   - Cada cambio en los campos del formulario se persiste automáticamente en `sessionStorage` para evitar pérdida de datos ante refrescos accidentales de la página.
   - Al completar la creación con éxito, el borrador se purga automáticamente.
2. **Sanitización de Payloads:**
   - Todos los objetos anidados pasan por `sanitizeFirestorePayload` para garantizar que ningún campo `undefined` llegue a Firestore.
3. **Accesibilidad y Atributos ARIA:**
   - Todo botón de acción cuenta con `(keyup.enter)` y etiquetas descriptivas `aria-label`.
   - Modales accesibles con `role="dialog"` y `aria-modal="true"`.
