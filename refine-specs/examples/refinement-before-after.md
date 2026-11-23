# Ejemplos Reales de Refinamiento (Antes vs Después)

Basados en casos reales del monorepo, `sanitize-architecture` y `code-review` (Code Review & CAT).

---

## 1. Eliminar Wrappers `raw` y Tomar `id` del Documento Firestore

**Antes (redundante y defensivo):**
```ts
export function parseAccessRequestWithZod(id: string, raw: Record<string, unknown>): AccessRequest {
  return accessRequestSchema.parse({ ...raw, id });
}
// Llamado desde otro wrapper:
parseAccessRequestDoc(reqDoc.id, reqDoc.data());
```

**Después (directo y canónico):**
```ts
accessRequestSchema.parse({ ...reqDoc.data(), id: reqDoc.id });
```

---

## 2. Reutilizar Enums de Dominio en Lugar de Duplicarlos en UI

**Antes:**
```ts
// En request-access-form.component.ts
export enum RequestAccessTab { GOOGLE = 'GOOGLE', EMAIL = 'EMAIL' }
```

**Después:**
```ts
import { AccessRequestSource } from '@jg7/auth-engine';
protected readonly RequestTab = AccessRequestSource;
```

---

## 3. Conectar Config Dinámica de DB en Runtime (Cero Tokens Desconectados)

**Antes:**
```ts
// El servicio hidrata Firestore, pero guards/UI leen el token estático:
const config = inject(AUTH_ENGINE_CONFIG);
```

**Después:**
```ts
// Tokens solo como appId + fallback; consumidores leen el signal reactivo:
export interface AuthEngineConfig extends AppAuthSettings {
  readonly appId: string;
}
protected readonly config = inject(AuthRuntimeConfigService).config;
```

---

## 4. Erradicar Falsas Interfaces (`*Like`) y Duck-Typing (de `sanitize-architecture`)

**Antes:**
```ts
export interface AdminUserLike {
  uid: string;
  email?: string;
}
```

**Después (contrato canónico o proyección formal):**
```ts
// Inferido desde schema homologado o derivado con Pick/Omit/extends:
export type MxdUser = z.infer<typeof mxdUserSchema>;
```

---

## 5. Separar Responsabilidades en Modelos (Dominio vs Copys vs UI)

**Antes:**
```ts
// Todo mezclado en crew.model.ts: entidad Firestore + textos + clases Tailwind
export interface CrewMember { id: string; status: UserStatus; badgeClass: string; }
```

**Después:**
- `*.model.ts`: Entidades canónicas, string enums y tipos de entrada/salida.
- `*-copys.model.ts`: Diccionarios `Record<EnumType, string>`.
- `*-ui.model.ts`: Badges, tabs, filtros y configuraciones visuales.

---

## 6. Modificadores Estrictos, `extends` y Cero Boolean Leakage (de `code-review`)

**Antes:**
```ts
export interface AuthEngineConfig {
  brandName: string; // duplicado de AppAuthSettings
  // ...9 campos más repetidos
}
const payload = {
  ...(trimmedReason && { reason: trimmedReason }), // boolean leakage si es ""
};
```

**Después:**
```ts
export interface AuthEngineConfig extends AppAuthSettings {
  readonly appId: string;
}
const payload = {
  ...(trimmedReason ? { reason: trimmedReason } : {}),
};
```

---

## 7. `Record<EnumType, V>` en Lugar de `switch` (Cero Ramas Imperativas)

**Antes:**
```ts
function getStatusLabel(status: AccessRequestStatus): string {
  switch (status) {
    case AccessRequestStatus.PENDING: return 'Pendiente';
    case AccessRequestStatus.APPROVED: return 'Aprobada';
    case AccessRequestStatus.REJECTED: return 'Rechazada';
  }
}
```

**Después:**
```ts
export const ACCESS_REQUEST_STATUS_LABELS: Record<AccessRequestStatus, string> = {
  [AccessRequestStatus.PENDING]: 'Pendiente',
  [AccessRequestStatus.APPROVED]: 'Aprobada',
  [AccessRequestStatus.REJECTED]: 'Rechazada',
};
```

---

## 8. `Test Smell -> Architecture Fix` y Reframing a `business-specs.md`

**Antes (spec técnico, frágil y sin contexto):**
```ts
it('should return false when invite is expired', () => {
  expect(isInviteActive(expired, nowMs)).toBeFalse();
});
```

**Después (garantía de negocio + independencia unitaria):**
```ts
it('should treat an invitation as unavailable once its expiration deadline has passed', () => {
  expect(isInviteActive(expired, nowMs)).toBeFalse();
});
```
*(Si probar un flujo obliga a simular `throw` irreales o contexto multi-dominio, extraer primero la lógica pura a un helper/engine mediante TDD Red → Green antes de seguir escribiendo mocks complejos).*
