---
spaceKey: DOCS
folderId: '382074881'
fileId: '383746050'
---

# ADR 003: Content Projection & Domain Slots (Arquitectura White-Label UI)

**Fecha:** 22 de Agosto de 2026  
**Estado:** Aprobado & Implementado  
**Autores:** Equipo de Arquitectura JG7  
**Edificios Afectados:** CoreProduct Core (`shared-domain`), AcademyModule Sports Academy (`module-academy`), Plataforma Corey Shared Architecture

---

## 📌 1. Contexto & Problema

En el ecosistema multi-tenant de JG7 (el Monorepo Nx), el edificio **CoreProduct** provee el motor SaaS para la gestión de academias, clubes y escuelas (inscripciones, cobros recurrentes, expedientes, asistencia y ledger financiero).

Durante el desarrollo de **AcademyModule Academy** (vertical de fútbol formativo), surgió una discrepancia arquitectónica:

1. **Contaminación del Core:** Componentes base como el Expediente Digital y el Wizard de Registro contenían badges, íconos de fútbol (`fa-shirt`, `fa-futbol`), diccionarios de terminología y reglas de temporadas deportivas (corte anual al 1 de Agosto) hardcodeados en `shared-domain`.
2. **Riesgo de Acoplamiento Condicional:** Si cada nueva vertical (música, natación, artes marciales, danza) requiriera modificar `shared-domain`, el core terminaría saturado de condicionales (`@if`), mapas de configuración y diccionarios intermediarios difíciles de mantener.
3. **Duplicación Innecesaria:** Duplicar modales o formularios completos para cada vertical violaría el principio de DRY y encarecería el mantenimiento de la lógica financiera y de persistencia.

---

## 🏛️ 2. Decisión Arquitectónica

Se adopta formalmente el patrón **Headless Engine + Content Projection & Domain Slots**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. Headless Engine (*Engine.ts en shared-domain)                               │
│    - Reactive State (Signals), FormGroup, Validaciones y Autocálculos       │
│    - Atributos Extensibles: engine.domainAttributes (Record<string, any>)   │
│    - Persistencia Firestore pura y 100% testeable con Jest                  │
└─────────────────────────────────────────────────────────────────────────────┘
                                   ▲
                                   │ Inyección via inject()
┌─────────────────────────────────────────────────────────────────────────────┐
│ 2. Componente Base Integral (*.component.ts/.html en shared-domain)            │
│    - 100% Agnóstico: Layout, Drawers, Avatares, Demografía y Botones        │
│    - Expone Slots Semánticos: <ng-content select="[profile-badges]" />      │
│                              <ng-content select="[extra-student-fields]" /> │
│                              <ng-content select="[extra-plan-fields]" />    │
└─────────────────────────────────────────────────────────────────────────────┘
                                   ▲
                                   │ Proyección limpia de Slots
┌─────────────────────────────────────────────────────────────────────────────┐
│ 3. Vista Especializada de Vertical (*.component.html en module-academy)       │
│    - Inyecta únicamente su bloque visual de disciplina (Jersey, Posición)   │
│    - Enlaza a engine.getDomainAttribute() / engine.setDomainAttribute()     │
│    - Inyecta reglas de negocio especializadas (ej. CategoryMatcherFn)       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📐 3. Matriz Taxonómica Obligatoria para Planes de UI

A partir de esta decisión, **todo plan de nueva UI o refactorización DEBE clasificar sus elementos bajo la Matriz Taxonómica**:

| Elemento / Capa                         | Clasificación       | Ubicación          | Responsabilidad & Reglas                                                                                    |
| --------------------------------------- | ------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------- |
| **Estructura Visual**                   | **Base / Integral** | `shared-domain`       | Layout responsive, Drawers, Modales, Avatares con iniciales, Tabs universales (Pagos, Asistencia, Tutores). |
| **Demografía Universal**                | **Base / Integral** | `shared-domain`       | Nombres, Apellidos, Fecha de Nacimiento, CURP, Ficha Médica básica.                                         |
| **Acciones Principales**                | **Base / Integral** | `shared-domain`       | Botones de Guardar, Cancelar, Siguiente Paso, Pagar.                                                        |
| **Badges de Disciplina**                | **Slot de Dominio** | `suite-<vertical>` | Inyectados en `<ng-content select="[profile-badges]" />` (ej. Jersey #, Posición de Campo, Cinta, Carril).  |
| **Campos de Formulario Especializados** | **Slot de Dominio** | `suite-<vertical>` | Inyectados en `<ng-content select="[extra-*-fields]" />` y enlazados a `engine.domainAttributes`.           |
| **Matchers / Reglas de Temporada**      | **Hook de Dominio** | `suite-<vertical>` | Inyectados mediante `CategoryMatcherFn` (ej. `academySportsCategoryMatcher` con corte al 1 de Agosto).      |

---

## 🔍 4. Casos de Aplicación Implementados

### A. Expediente Digital del Alumno (`StudentExpedienteModalComponent`)

- **`shared-domain`:** Renderiza el encabezado universal con iniciales, nombre, categoría y edad, y expone `<ng-content select="[profile-badges]" />`.
- **`module-academy`:** Proyecta los badges de `<i class="fa-solid fa-shirt"></i> Jersey` y `<i class="fa-solid fa-futbol"></i> Posición`.

### B. Wizard de Alta de Alumnos (`StepStudentDataComponent`)

- **`shared-domain`:** Centraliza el 85% del formulario y expone `<ng-content select="[extra-student-fields]" />`.
- **`module-academy`:** Proyecta la tarjeta de _Perfil de Cancha_ con los inputs de dorsal y posición deportiva.
- **`StudentWizardEngine`:** Persiste automáticamente `domainAttributes` en Firestore y en los borradores de `localStorage`.

### C. Planes de Servicio & Categorías (`CreateServicePlanModalComponent`)

- **`ServicePlanEngine`:** Encapsula la reactividad, validación de rango de edades (`minAge <= maxAge`), cálculo reactivo de años de nacimiento (`estimatedBirthYears`) y persistencia.
- **`shared-domain`:** Componente delgado agnóstico que expone `<ng-content select="[extra-plan-fields]" />` sin `appId` hardcodeado.

### D. Desacoplamiento de la Auto-Categorización Deportiva

- **`CategoryMatcherFn`:** Se extrajo el corte de temporada al 1 de Agosto (`SeasonCutoffMode.ANNUAL_AUGUST`) a `academySportsCategoryMatcher` en `module-academy`.
- **`shared-domain`:** No asume ningún corte deportivo; si no se inyecta un matcher, el usuario selecciona su plan manualmente.

---

## 🚀 5. Consecuencias & Beneficios

1. **Cero Duplicación de Código:** El 90% del markup y el 100% de la lógica financiera y de persistencia se mantienen en `shared-domain`.
2. **Aislamiento Total de Marca:** `shared-domain` no tiene dependencias de `@core-product/academy` ni condicionales deportivos.
3. **Escalabilidad Inmediata:** Añadir una nueva escuela (ej. natación, danza, artes marciales) solo requiere definir sus slots de dominio sin tocar el motor base.
4. **Alta Testeabilidad:** 100% de la lógica de negocio y formularios está cubierta por pruebas unitarias de Jest (`nx test core-product-motor`) ejecutadas en milisegundos.
