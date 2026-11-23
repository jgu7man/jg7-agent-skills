# 🏕️ Regla del Scout & Auditoría de Antipatrones (Boy Scout Rule)

> **Directiva Fundamental**: _"Deja el código más limpio de como lo encontraste"_.  
> Siempre que se intervenga un módulo, pantalla o helper para implementar una nueva feature o corregir un bug, es **obligatorio** auditar el código circundante, identificar código reutilizable, erradicar antipatrones activos y refactorizar componentes o helpers monolíticos.

---

## 🧭 Los 4 Pasos Obligatorios del Protocolo Scout

```
1. AUDITORÍA DE REUSABILIDAD
   └── Antes de codificar, buscar en `@jg7/core-utils`, `@jg7/shared-ui` y `@mx-<suite>/models`.
       ¿Existe ya un formateador de moneda, fecha, iniciales o validador?
       ► SI: Reutilizar directamente.
       ► NO: Si es transversal, crear primero en `@jg7/core-utils` con su `*.spec.ts`.

2. DETECCIÓN & ERRADICACIÓN DE ANTIPATRONES
   └── Auditar los archivos que se van a modificar en busca de:
       • Uso de `any` (ej. `catch (err: any)`, `(item as any)`). Reemplazar con tipos canónicos o `unknown`.
       • Magic strings o comparaciones sin enum (ej. `status === 'CANCELLED'`). Reemplazar con string enums.
       • Falta de accesibilidad: `(click)` sin `(keyup.enter)` o botones de ícono sin `aria-label`.
       • Llamadas repetidas a signals en HTML sin variables `@let`.
       • Boolean leakage (`condicion && valor` en uniones `T | undefined`).

3. REFACTORIZACIÓN & DESACOPLAMIENTO SCOUT
   └── Si el archivo a intervenir es monolítico (> 500 líneas en HTML o > 800 en TS):
       • NO seguir engordando el archivo.
       • Extraer la nueva funcionalidad en un componente hijo atómico (Molécula/Feature).
       • Extraer la lógica de cálculo o negocio a un helper puro hermano (`*.helpers.ts`).

4. COBERTURA Y FORMATEO
   └── Todo helper o lógica extraída debe tener su archivo de pruebas unitarias (`*.spec.ts`) en Jest.
   └── Aplicar `pnpm exec nx format:write` tras completar los cambios.
```

---

## 🚫 Antipatrones Típicos a Erradicar al Tocar Archivos

### 1. `any` en Bloques `try/catch` o Castings Arbitrarios

```typescript
// ❌ INCORRECTO — Antipatrón prohibido
} catch (err: any) {
  console.error(err.message);
}
const subId = (payment as any).subscriberId;

// ✅ CORRECTO — Tipado estricto
} catch (err: unknown) {
  const message = err instanceof Error ? err.message : 'Error desconocido';
}
// Tipar formalmente la propiedad en la interface correspondiente:
const subId = payment.subscriberId;
```

### 2. Reinventar la Rueda con Formatos de Texto, Fechas o Iniciales

```typescript
// ❌ INCORRECTO — Lógica duplicada inline
const initials = name
  .split(' ')
  .map((p) => p[0])
  .join('')
  .slice(0, 2);
const dateStr = date.toISOString().split('T')[0];

// ✅ CORRECTO — Utilidades canónicas de @jg7/core-utils
import { getInitials, toTenantLocalDateString, formatCurrency } from '@jg7/core-utils';
const initials = getInitials(name);
const dateStr = toTenantLocalDateString(date);
```

### 3. Click sin Evento de Teclado (Accesibilidad A11y)

```html
<!-- ❌ INCORRECTO — Inaccesible para navegación por teclado -->
<button (click)="openDetail()">Ver detalle</button>

<!-- ✅ CORRECTO — Par de accesibilidad obligatorio -->
<button (click)="openDetail()" (keyup.enter)="openDetail()">Ver detalle</button>
```

---

## 📋 Integración en Planes y Tickets de Jira

Toda Historia de Usuario o Tarea Técnica debe incluir en su sección técnica el apartado:
`### 🧹 Auditoría Scout y Refactorización de Antipatrones` listando explícitamente:

- Qué antipatrones existentes en los archivos intervenidos serán eliminados.
- Qué componentes monolíticos serán modularizados para evitar sobrecargarlos.
- Qué utilidades de `@jg7/core-utils` serán aprovechadas.
