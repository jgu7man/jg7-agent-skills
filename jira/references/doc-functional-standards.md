---
name: doc-functional
description: Guía, estándares y playbook para redactar y publicar documentación funcional en Confluence Cloud vía MCP jira-mcp-server (confluence_create_page, confluence_update_page). Explica de forma práctica cómo funciona la maquinaria del sistema (qué, cómo, dónde), contratos de datos, diagramas de interacción entre servicios y matrices operativas, sin narrativas temporales de antes/después ni planes futuros.
---

# 📚 Skill: Documentación Funcional en Confluence (`/doc-functional`)

Utiliza este skill siempre que necesites **crear, documentar o actualizar la documentación funcional de un módulo, feature, engine o subsistema en Confluence Cloud** para el Monorepo Nx y sus suites (CoreProduct, AcademyModule, Miss Pedidos).

---

## 🎯 1. Filosofía y Propósito

La documentación funcional no es un diario de desarrollo ni una bitácora de intenciones:

- **Misión**: Explicar con precisión meridiana y practicidad **CÓMO FUNCIONA la maquinaria del sistema** para que cualquier ingeniero, líder técnico o miembro de operaciones entienda de inmediato el comportamiento del software en producción.
- **Responde 3 preguntas esenciales**:
  1. **¿Qué hace?** (Regla de negocio o proceso operativo).
  2. **¿Cómo lo hace?** (Maquinaria interna, servicios orquestadores, lógica contable y efectos secundarios).
  3. **¿Dónde ocurre?** (Rutas exactas de colecciones/documentos en Firestore, endpoints, componentes visuales).
- **Cero narrativas temporales**: **PROHIBIDO** hablar de "antes y después", ni redactar bitácoras de "planes a realizar", "intenciones futuras" o "se planea migrar". La documentación funcional describe el **sistema en tiempo presente y cómo opera hoy**.

---

## 📐 2. Estructura Canónica de un Documento Funcional

Todo documento funcional generado bajo este skill debe respetar las siguientes secciones bajo el estándar **OKF2 (Open Knowledge Format 2.0)**:

```markdown
> **Producto / Proyecto**: `Nombre del Proyecto SaaS (ej. el Monorepo Nx — Suite CoreProduct)`  
> **Repositorio**: `jg7/mx-nx-monorepo`  
> **Módulo / Dominio**: `Nombre del Módulo (ej. Órdenes de Compra & Flujo de Caja)`  
> **Audiencia**: `Ingeniería de Software, Arquitectura, Administración & Operaciones`  
> **Versión / Estado**: `v1.0.0` | `Producción`  
> **Estándar**: `Google Open Knowledge Format (OKF v0.2)`

---

# Título Limpio de la Feature o Módulo

Resumen ejecutivo conciso (1-2 párrafos) del propósito de negocio y alcance del módulo.

---

## 1. Fundamento de Negocio y Reglas Operativas

- Principios contables o de flujo de datos.
- Por qué el sistema se comporta de cierta manera (ej. devoluciones registradas como egresos en vez de anular cobros).
- Bloqueos operativos y condiciones de frontera.

---

## 2. Diagrama de Secuencia de la Maquinaria

Diagrama que mapee visualmente la orquestación entre la UI, los Servicios de Dominio, la Capa Contable (Ledger) y la Base de Datos.

---

## 3. Contratos de Datos y Persistencia

Tabla rigurosa con las rutas exactas de Firestore y campos críticos modificados.

---

## 4. Matriz de Comportamiento por Estado o Escenario

Tabla o matriz de casos de uso que detalle qué ocurre bajo cada situación posible.

---

## 5. Trazabilidad, Auditoría y Efectos Secundarios

- Sello de tiempo (`serverTimestamp()`), logs inmutables, folios emitidos.
- Impacto cruzado en otros módulos (ej. resúmenes mensuales, arqueos de caja, ledger).
```

---

## 📊 3. Regla de Oro para Diagramas (Just Add+ & Mermaid)

En Confluence Cloud (`JG7.atlassian.net`), la organización utiliza la macro **Just Add+** (`/diagram`).

> [!WARNING]
> **LIMITACIÓN TÉCNICA DE LA API CONFLUENCE**:
> La API REST de Confluence Cloud no instancia dinámicamente macros de terceros de Connect/Forge al recibir bloques ` ```mermaid `. Si se envía como bloque mermaid nativo, el conversor de Atlassian lo borra o genera un error de extensión rota.

### ✅ Estándar Obligatorio para el Agente:

Cuando el contenido incluya un diagrama de secuencia (`sequenceDiagram`), flujo (`flowchart`) o arquitectura:

1. **Generar el código Mermaid dentro de un bloque de código estándar (` ```text ` o bloque de código)**.
2. Añadir una nota aclaratoria inmediata para el usuario/editor:  
   _(Nota: Copiar el bloque de arriba en la macro Just Add+ `/diagram` con sintaxis Mermaid para su visualización interactiva)._

### Plantilla de Secuencia Recomendada:

```text
sequenceDiagram
    autonumber
    actor Admin as Administrador / Operador
    participant UI as Vista / Tabla
    participant Modal as Modal de Acción
    participant DomainSvc as Servicio de Dominio (*ResourceService)
    participant CoreLedger as Ledger Contable (UniversalChargesResourceService)
    participant Firestore as Firestore DB

    Admin->>UI: Dispara acción operativa
    UI->>Modal: Despliega datos y solicita confirmación
    Admin->>Modal: Confirma con motivo y parámetros
    Modal->>DomainSvc: Ejecuta comando orquestador
    DomainSvc->>CoreLedger: Registra movimiento contable
    DomainSvc->>Firestore: Actualiza documentos y contadores
    DomainSvc-->>UI: Retorna confirmación y folio
```

---

## 📋 4. Tabla de Contratos de Persistencia Obligatoria

Toda documentación funcional debe incluir la tabla de contratos:

| Entidad / Modelo      | Ruta en Firestore                     | Campos Críticos Afectados                                                                                                      |
| --------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **`[NombreEntidad]`** | `tenants/{tenantId}/[coleccion]/{id}` | • `status`: Estados que adquiere<br/>• `audit`: Datos de operador y fecha<br/>• `referencias`: IDs cruzados de ledger o folios |

---

## 🔄 5. Protocolo de Publicación vía MCP (`jira-mcp-server`)

Para publicar o actualizar una página funcional en Confluence:

1. **Revisión y Estructura en Markdown**:
   - Generar el archivo Markdown respetando OKF2, el bloque de código del diagrama y las tablas.
2. **Parámetros en `confluence_create_page` o `confluence_update_page`**:
   - `space_key`: Espacio destino (ej. `"DOCS"` para AcademyModule CRM o `"MI"` para Miss Pedidos).
   - `parent_id`: ID de la página padre para mantener la jerarquía de árbol.
   - `title`: Título limpio en texto plano (**SIN** emoji al inicio del texto).
   - `emoji`: Emoji nativo seguro de un solo punto de código (`📦`, `🔄`, `💳`, `📊`, `👥`, `🏢`, `⚡`).
   - `content_format`: `"markdown"`.
   - `content_file`: Ruta absoluta al archivo generado.
3. **Confirmación**:
   - Validar que la respuesta retorne `"message": "Page created/updated successfully"` y proveer al usuario el link directo a la página de Confluence.
