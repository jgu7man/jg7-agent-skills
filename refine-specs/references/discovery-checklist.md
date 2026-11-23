# Checklist de Discovery y Cero Asunciones

Ejecutar este escaneo antes de proponer refactors, modelos nuevos o pruebas en cualquier módulo.

## 1. Búsqueda Obligatoria en el Workspace

- [ ] **Modelos y Enums (`*.model.ts`):** Buscar en `libs/shared/models` y `libs/<dominio>/**/models/` si ya existen string enums o interfaces canónicas reutilizables antes de declarar tipos locales en componentes o servicios.
- [ ] **Schemas (`*.schemas.ts`):** Verificar si los tipos ya se infieren con `z.infer<typeof ...>` para no mantener interfaces manuales duplicadas.
- [ ] **Configuración y Tokens (`*.tokens.ts`):** Revisar si existe un servicio reactivo de runtime (ej. `AuthRuntimeConfigService` hidratado desde `apps/{appId}`) y comprobar que **todos** los guards, servicios y componentes lo consuman en lugar del token estático.
- [ ] **UI Compartida (`libs/shared/*`):** Buscar pipes (`ActiveClassPipe`, `FirestoreTimestampPipe`), tokens de diseño (`UI_PILL_TOKENS`) y directivas antes de escribir expresiones condicionales repetidas en HTML.
- [ ] **Documentación de Pruebas (`business-specs.md`):** Leer el `business-specs.md` de cada librería impactada para conocer qué reglas ya están cubiertas.

## 2. Regla de Oro: Preguntar Antes de Crear

Nunca asumir que hace falta crear una pieza nueva sin consultar primero si:
1. El desarrollador ya tiene una pieza equivalente en otra librería o rama.
2. Conviene mover o extender un contrato existente en lugar de crear uno nuevo.
3. Un enum o interface local de UI (ej. tabs o payload de formulario) debe unificarse con el modelo de dominio.
4. Una regla detectada es un requisito de negocio real o código defensivo sobrante que conviene eliminar.

## 3. Señales de Código Defensivo / Dummy a Reportar

- Parámetros `raw: Record<string, unknown>` o funciones `parse*WithZod` de una sola línea.
- Interfaces espejo o `*Like` que duplican propiedades ya existentes en `@secret-santa/shared-models` o `@jg7/auth-engine`.
- Try/catch o fallbacks que silencian datos corruptos en lugar de fallar rápido (`schema.parse`).
- Inputs/outputs o servicios inyectados que no tienen efecto real en runtime.
