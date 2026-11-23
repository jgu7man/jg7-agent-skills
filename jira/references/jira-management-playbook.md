---
name: jira-management
description: Experto en gestión del proyecto Jira MPS (Miss Pedidos) en marxa-digital.atlassian.net. Crea, actualiza y organiza Épicas, Historias de Usuario (HU), tareas y otros tipos de issues con descripciones en formato correcto, campos requeridos, asignación a épica padre, y transición al estado inicial apropiado.
---

# Jira Management Skill

Use this skill when tasked with creating, updating, or transition Jira issues for the Miss Pedidos (MPS) project.

---

## 1. Instancia y Credenciales de Jira (Estrategia por Defecto `~/.jira.env`)

- **URL base**: `https://marxa-digital.atlassian.net`
- **Proyectos**: `PFGO` (ProFees Goolima / Business Valley) y `MPS` (Miss Pedidos).
- **🔒 Estrategia Segura de Credenciales (ESTÁNDAR MANDATORIO)**:
  La forma recomendada, privada y más segura por defecto para autenticar el MCP `@mxd/jira-mcp` o scripts del monorepo es almacenar las credenciales en el archivo local `~/.jira.env` (en el directorio del usuario, fuera de git):

  ```env
  JIRA_USER=tu-email@marxa.digital
  JIRA_TOKEN=tu_atlassian_api_token
  JIRA_URL=https://marxa-digital.atlassian.net
  ```

- **Uso con `@mxd/jira-mcp`**:
  El servidor MCP custom en `tools/mxd-jira-mcp` lee automáticamente las credenciales desde `~/.jira.env` o variables de entorno del proceso. No es necesario exponer tokens en el chat ni en repositorios.

---

## 2. Tipos de Issue y IDs

| ID    | Nombre              | Workflow Asignado   |
| :---- | :------------------ | :------------------ |
| 10000 | Épica               | Scrum Epic          |
| 10006 | Historia de usuario | 🎯 Entrega ágil     |
| 10028 | Tarea               | 👍 Simple ToDo Task |
| 10030 | Reparación urgente  | ⛑️ Reparaciones     |
| 10031 | Entregable técnico  | Technical Task      |
| 10042 | Investigación       | 💡 Research task    |
| 10044 | Petición de cambio  | 🎯 Entrega ágil     |
| 10046 | Documentación       | 👍 Simple ToDo Task |
| 10146 | Bugfix              | ⛑️ Reparaciones     |

---

## 3. Estados & Transiciones ("🎯 Entrega ágil")

Antes de transicionar una issue, verifica sus transiciones disponibles usando la REST API de Atlassian.

Estados conocidos:

- **`10027` — En refinamiento** (Estado inicial correcto para HUs nuevas).
- **`1` — Listo para desarrollo**
- **`3` — En desarrollo**
- **`10031` — Closed**
- **`10099` — Canceled**

---

## 4. Campos Custom Obligatorios de Pantalla

Estos campos son obligatorios y deben enviarse al crear o modificar issues:

### A. Módulo (`customfield_10121`)

- `10120`: 🗂️ Panel Dashboard
- `10121`: 📰 Blog
- `10129`: 🏬 Catalog
- `10133`: 🤖 Chatbot
- `10122`: 👥 Clients
- `10123`: 👔 Crew
- `10124`: ☎️ Loyalty Manager
- `10125`: 📦 Inventory
- `10126`: 📑 Invoices
- `10127`: 📊 Inventory Counts
- `10175`: 🗓️ Inventory Smart Management
- `10128`: 📍 Locations
- `10208`: 📣 Proactive messenger
- `10130`: 📈 Sales Analyst
- `10131`: 💰 Selling Point
- `10132`: 🌐 Website

### B. Aplicación (`customfield_10122`)

- `10134`: Panel
- `10135`: Website
- `10137`: Botpress
- `10209`: Backend
- `10340`: Meta Business

---

## 5. Convenciones de Estructura de Historia de Usuario (HU)

Usa formato Jira Wiki Markup (API v2) para las descripciones:

```text
h2. Historia de usuario

*Como* [rol],
*quiero* [acción],
*para* [beneficio].

----

h2. Contexto técnico
[detalles de implementación: app, servicio, componente Angular, hooks]

----

h2. Criterios de aceptación
* [criterio 1]
* [criterio 2]

----

h2. Notas de implementación (opcional)
* [detalles adicionales]
```

---

## 6. Regla de Oro: Cero Resúmenes Destructivos y Subtareas Técnicas

Al crear o actualizar issues en Jira:

1. **Fidelidad Total al Gherkin**: Nunca resumas ni sintetices los escenarios `Dado / Cuando / Entonces` ni los errores No-Happy Path (offline, 400, 403, 404, 409, 500) que provienen del `implementation_plan.md`. Pégalos íntegramente.
2. **Subtareas Hijas Obligatorias**: Por cada Historia de Usuario que toque backend y frontend, crea sus subtareas técnicas:
   - `[Backend] Cloud Function <nombre-funcion>`
   - `[Frontend] Integración en Service, Engine y UI de <nombre-pantalla>`
   - `[QA/Tests] Pruebas Unitarias Jest y Validación en Emulador`
3. **Vínculo al Plan**: Incluye siempre la referencia `[implementation_plan.md|file:///path/to/plan]` en la descripción de la Épica.

---

## 7. Fallback Script: Creación de Issues vía REST API de Jira

Si no se dispone de una herramienta MCP de Atlassian para crear issues o si esta falla debido a validaciones de campos custom, ejecuta el siguiente script de Python temporalmente en `/tmp/` para conectarte mediante Basic Auth:

```python
import json
import urllib.request
import base64
import os

# Obtener credenciales de variables de entorno locales (JIRA_USER, JIRA_TOKEN)
jira_user = os.environ.get("JIRA_USER")
jira_token = os.environ.get("JIRA_TOKEN")

if not jira_user or not jira_token:
    print("Error: Se requieren las variables de entorno JIRA_USER y JIRA_TOKEN")
    exit(1)

url = "https://marxa-digital.atlassian.net/rest/api/2/issue"
auth_str = f"{jira_user}:{jira_token}"
encoded_auth = base64.b64encode(auth_str.encode("utf-8")).decode("utf-8")

headers = {
    "Content-Type": "application/json",
    "Authorization": f"Basic {encoded_auth}"
}

payload = {
    "fields": {
        "project": {"key": "MPS"},
        "issuetype": {"id": "10006"}, # HU por defecto
        "summary": "Resumen de la issue",
        "description": "h2. Historia de usuario...",
        "customfield_10121": {"id": "10120"}, # Dashboard por defecto
        "customfield_10122": {"id": "10134"}, # Panel por defecto
        # "parent": {"key": "MPS-X"} # Asociar a épica
    }
}

req = urllib.request.Request(url, data=json.dumps(payload).encode("utf-8"), headers=headers, method="POST")
try:
    with urllib.request.urlopen(req) as res:
        response_data = json.loads(res.read().decode("utf-8"))
        print(f"Issue creada con éxito: {response_data['key']}")
except urllib.error.HTTPError as e:
    print(f"Error HTTP {e.code}: {e.read().decode('utf-8')}")
```
