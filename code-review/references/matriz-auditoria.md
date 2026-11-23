# Matriz de Reglas y Heurísticas de Auditoría (`codebase-audit`)

Esta matriz complementa a [SKILL.md](../SKILL.md) y sirve como referencia rápida de antes y después para el análisis del código.

---

## 1. Antipatrones de Angular vs Soluciones Canónicas

| Antipatrón Detectado | Impacto Técnico | Solución Canónica |
| :--- | :--- | :--- |
| `{{ formatPrice(item.amount) }}` | Se evalúa en cada ciclo de Change Detection (scroll, hover, micro-ticks) | Migrar a Pure Pipe (`CurrencyPipe`) o precomputar con `computed()`. |
| `@let isBusy = loading();` en la raíz | Oculta la reactividad del signal y ensucia el scope | Usar el signal directo en directivas (`@if (loading())`). Usar `@let` solo para desempaquetar objetos compuestos (`@let ord = order(); @if (ord) { ... }`). |
| `[class.bg-blue-600]="st === A" [class.bg-gray-100]="st !== A"` | Antipatrón espejo: duplicación de lógica visual en template | Encapsular en un Pure Pipe de presentación respaldado por `Record<StatusEnum, string>`. |
| `<div (click)="select()">` sin teclado | Falla accesibilidad (A11y) para navegación por teclado | `<button (click)="select()" (keyup.enter)="select()">` o agregar `role="button"` + `tabindex="0"`. |
| Componente sin `ChangeDetectionStrategy.OnPush` | Sobre-evalúa sub-árboles de componentes hijos | Agregar `changeDetection: ChangeDetectionStrategy.OnPush`. |
| Plantilla HTML monolítica > 250 líneas | Dificulta pruebas, lectura y modularidad | Extraer child-components atómicos en `components/` locales. |

---

## 2. Boundaries e Imports en Nx Monorepo

| Error / Antipatrón | Causa Raíz | Solución Canónica |
| :--- | :--- | :--- |
| `import { Model } from '@mx-profees/models'` dentro de `libs/profees/suite-main` | Auto-importación circular de la propia librería vía el alias global | Usar ruta relativa directa: `import { Model } from '../../../../../models/model';`. |
| Import de `@angular/core` en Cloud Function | Provoca fallo de compilación en Node puro | Extraer modelo agnóstico a paquete compartido de modelos sin dependencias de Angular. |
| Modelos de vertical en plataforma Core | Acopla lógica específica deportiva/educativa a la plataforma general | Respetar la jerarquía: Core (`@mx-valley`) ➔ Suite (`@mx-profees`) ➔ Vertical (`@profees/goolima`). |

---

## 3. Tipado Estricto & Reglas TypeScript

| Antipatrón Detectado | Riesgo / Deuda | Solución Canónica |
| :--- | :--- | :--- |
| `param: any` o `as any` o `$any()` | Anula la verificación de tipos del compilador | Usar interfaces canónicas, genéricos o `unknown` con type guard. |
| `type Status = 'NEW' \| 'PAID'` | No autocompleta en todos los IDEs ni garantiza exhaustividad | String enum obligatorio: `export enum Status { NEW = 'NEW', PAID = 'PAID' }`. |
| `param: { id: string; name: string }` | Tipo anónimo inline duplicado | Declarar e importar interfaz formal en `*.model.ts`. |
| `isSpecial && customerNote` en payload | Filtra `false` en propiedades opcionales (Boolean leakage) | Ternario explícito: `isSpecial ? customerNote : undefined`. |
| `status.includes('PAID')` | Programación por conjetura propensa a falsos positivos | Comparación contra enum canónico: `status === OrderStatus.PAID`. |
