---
type: spec
title: '🛡️ 04. Seguridad y Matriz de Acceso Multi-tenant'
description: 'Regla de oro de desacoplamiento uid vs tenantId, matriz de roles RBAC (Nivel 0 al 4) y Security Rules en Firestore.'
tags: [valle, goolima, profees, seguridad, rbac, multi-tenant, auth, firestore-rules]
generated: { by: 'human:jguzman', at: '2026-08-20T03:45:00.000Z' }
lastUpdate: '2026-08-20T03:45:00.000Z'
spaceKey: GOOL
folderId: '382074881'
---

# 🛡️ 04. Seguridad y Matriz de Acceso Multi-tenant

## 1. La Regla de Oro del Valle: `uid ≠ tenantId`

- **`uid` (User ID):** Identifica a la **persona física** (su email, su contraseña, su sesión en Firebase Auth).
- **`tenantId` (Tenant ID):** Identifica al **negocio u organización** (_Club Deportivo Goolima_, _Academia Santos_, _Sheló Nabel_).

> **PROHIBIDO:** Construir rutas de datos como `tenants/${uid}/asistencia`.  
> **OBLIGATORIO:** Construir rutas de datos como `tenants/${tenantId}/asistencia` consumiendo `TenantService.tenantId()`.

---

## 2. Matriz de Roles y Niveles de Acceso (RBAC)

| Nivel de Rol                       | Identificador       | Alcance de Permisos                                                           | Ejemplo de Usuario             |
| :--------------------------------- | :------------------ | :---------------------------------------------------------------------------- | :----------------------------- |
| **Nivel 0: SuperAdmin Valle**      | `VALLEY_SUPERADMIN` | Control total sobre la plataforma, creación de tenants y cobros Stripe.       | Equipo Directivo Marxa Digital |
| **Nivel 1: Dueño de Tenant**       | `TENANT_OWNER`      | Administración total del negocio (tarifas, profesores, reportes financieros). | Director de Goolima            |
| **Nivel 2: Administrador de Club** | `BRANCH_ADMIN`      | Gestión operativa de una sede específica (inscripciones, horarios).           | Coordinador Deportivo          |
| **Nivel 3: Profesor / Staff**      | `STAFF_COACH`       | Operación en cancha: pase de lista táctil, evaluación deportiva.              | Profesor de Fútbol             |
| **Nivel 4: Cliente / Tutor**       | `CLIENT_TUTOR`      | Vista pública/restringida: pagos de colegiatura, asistencia de su hijo.       | Padre de Familia               |

---

## 3. Seguridad en Security Rules de Firestore

Todas las subcolecciones de negocio están protegidas por la función canónica `isTenantMember(tenantId)`:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Función que valida pertenencia de la persona al negocio
    function isTenantMember(tenantId) {
      return request.auth != null &&
        request.auth.token.tenantId == tenantId;
    }

    // Regla estricta por subcolección
    match /tenants/{tenantId}/attendance/{docId} {
      allow read, write: if isTenantMember(tenantId);
    }
  }
}
```
