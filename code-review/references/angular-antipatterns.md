# Guía de Detección y Refactorización de Antipatrones de Angular

> **Documento de Referencia Técnica — JG7 & el Monorepo Nx**  
> **Skill Principal:** [code-review](file:///Users/jgu7man/.gemini/config/skills/code-review/SKILL.md)  
> **Objetivo:** Catálogo visual de antes/después con explicaciones de impacto en rendimiento, change detection y arquitectura.

---

## 1. Antipatrón: Invocación de Métodos en Plantillas HTML

### ❌ Código Antipatrón (Antes)

```typescript
// component.ts
export class MyComponent {
  formatMoney(amount: number): string {
    return `$${amount.toLocaleString('es-MX')}`;
  }
}
```

```html
<!-- component.html -->
<div class="card">
  <!-- ⚠️ Se ejecuta en CADA ciclo de Change Detection (scroll, hover, micro-ticks) -->
  <span>{{ formatMoney(balance().totalIncome) }}</span>
  <span>{{ formatMoney(balance().totalExpense) }}</span>
</div>
```

### ✅ Solución Canónica (Después)

Usar el `CurrencyPipe` nativo de `@angular/common` configurado con su formato de moneda:

```typescript
// component.ts
import { CurrencyPipe } from '@angular/common';

@Component({
  imports: [CurrencyPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent {}
```

```html
<!-- component.html -->
<div class="card">
  <!-- ✅ Pure Pipe: solo se ejecuta cuando el valor de entrada muta -->
  <span>{{ balance().totalIncome | currency: 'MXN' : 'symbol-narrow' : '1.0-0' }}</span>
  <span>{{ balance().totalExpense | currency: 'MXN' : 'symbol-narrow' : '1.0-0' }}</span>
</div>
```

---

## 2. Antipatrón: Auto-Importación de Barrels Públicos vía Path Aliases

### ❌ Código Antipatrón (Antes)

```typescript
// Archivo dentro de libs/core-product/shared-domain/src/lib/daily-closures/.../my-comp.ts
// ⚠️ ESTO ES UN ANTIPATRÓN: importar su propia librería mediante el alias de tsconfig.base.json
import { MonthlyStatsFinancials } from '@shared/domain/billing';
```

- **Consecuencias:**
  1. TypeScript y Nx confunden los grafos de dependencias creando dependencias circulares.
  2. Viola la regla `@nx/enforce-module-boundaries`.
  3. Causa errores en Jest o empaquetadores como Esbuild.

### ✅ Solución Canónica (Después)

Dentro de la misma librería, navegar usando **rutas relativas** directas al archivo del modelo:

```typescript
// ✅ Correcto dentro de libs/core-product/shared-domain/...:
import { MonthlyStatsFinancials } from '../../../../../models/monthly-stats.model';
```

> **Regla de Oro:** Los alias de `@shared/*` o `@modules/*` son únicamente para **consumidores externos** (como `apps/*` u otras librerías distintas).

---

## 3. Antipatrón: Invocaciones Repetidas de Signals en Plantilla

### ❌ Código Antipatrón (Antes)

```html
@if (order()) {
<h2>{{ order().number }}</h2>
<p>{{ order().client.name }}</p>
<span>{{ order().total }}</span>
}
```

### ✅ Solución Canónica con `@let` (Después)

```html
@let ord = order(); @if (ord) {
<h2>{{ ord.number }}</h2>
<p>{{ ord.client.name }}</p>
<span>{{ ord.total }}</span>
}
```

---

## 4. Antipatrón: Falta de Accesibilidad en Eventos de Click

### ❌ Código Antipatrón (Antes)

```html
<!-- ⚠️ Falla accesibilidad: usuarios de teclado no pueden accionar el botón -->
<button (click)="submitData()">Guardar</button>

<div class="clickable-item" (click)="selectItem(item)">{{ item.name }}</div>
```

### ✅ Solución Canónica (Después)

```html
<!-- ✅ Incluye evento de teclado equivalente (keyup.enter) -->
<button (click)="submitData()" (keyup.enter)="submitData()">Guardar</button>

<!-- ✅ Si se usa elemento no interactivo, dotarlo de rol, tabindex y teclado -->
<div role="button" tabindex="0" class="clickable-item" (click)="selectItem(item)" (keyup.enter)="selectItem(item)">{{ item.name }}</div>
```

---

## 5. Antipatrón: Uso de `$any()` en Plantillas

### ❌ Código Antipatrón (Antes)

```html
<!-- ⚠️ Evade la verificación de tipos del compilador de Angular -->
<input (change)="onMonthChange($any($event.target).value)" />
```

### ✅ Solución Canónica (Después)

Usar una variable de referencia de plantilla (`#periodInput`) fuertemente tipada a `HTMLInputElement`:

```html
<!-- ✅ Tipado estricto y seguro -->
<input #periodInput (change)="onMonthChange(periodInput.value)" />
```
