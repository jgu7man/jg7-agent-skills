# Guía de Estrategia `business-specs.md`

## 1. Cómo Redactar un Spec de Negocio

| Enfoque Técnico (Evitar) | Enfoque de Negocio (Obligatorio) |
| :--- | :--- |
| `should return true for a pending non-expired invite` | `should consider an invitation available for redemption while it is pending and within its validity window` |
| `should return false when invite is expired` | `should treat an invitation as unavailable once its expiration deadline has passed` |
| `should show accessDenied when UNAUTHORIZED` | `should warn the user that their account has no admin permissions after signing in with an unauthorized Google account` |
| `should update another user role` | `should persist and reflect in the directory when an admin changes another crew member role` |

## 2. Independencia Unitaria vs Ruido

- **Independencia obligatoria:** Cada archivo `.spec.ts` es una unidad aislada. En pruebas unitarias no existe continuidad de flujo entre archivos: si una misma regla de negocio vive en el servicio y en el componente/guard, **ambos archivos `.spec.ts` deben probarla de forma autónoma**.
- **Qué SÍ evitar (Ruido):**
  - Specs que prueban el funcionamiento interno de una librería externa (ej. verificar campo por campo que `z.optional(z.string())` de Zod acepta `undefined`).
  - Specs de pasamano puro en componentes presentacionales sin lógica propia, cuyo único objetivo es comprobar que un `@Input()` / `@Output()` reenvía argumentos a un spy.

## 3. Plantilla de `business-specs.md` por Librería

Cada librería con pruebas unitarias debe mantener un archivo `business-specs.md` en su raíz (`libs/<dominio>/<lib>/business-specs.md`):

```markdown
# Inventario de Pruebas Unitarias — `<package-name>`

Cada spec valida de forma independiente una regla de negocio o experiencia de usuario.

## 1. [<archivo>.spec.ts](file:///...) (N specs)

| Spec | Regla / Riesgo de negocio que protege |
| :--- | :--- |
| `should ...` | Descripción breve del riesgo evitado o garantía de negocio. |
```

## 4. Auditoría en Revisiones

Durante cualquier code review, scout o refinamiento:
1. Contrastar los `*.spec.ts` modificados o nuevos contra `business-specs.md`.
2. Si faltan pruebas sobre reglas de negocio propias o hay títulos acoplados al retorno técnico, **proponer explícitamente** la refactorización de los specs y la actualización de `business-specs.md`.
