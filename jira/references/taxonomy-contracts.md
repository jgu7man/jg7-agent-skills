**Versión:** 1.0

**Estado:** Mandatorio

**Audiencia:** Equipo de Negocio (Stakeholders), Desarrolladores/DevOps, y Modelos de IA (Antigravity/LLMs).

## 1. Propósito del Contrato

El propósito de este contrato es erradicar la ambigüedad semántica en el desarrollo de software y en los flujos de CI/CD. Todo término de negocio debe mapearse $1:1$ a una estructura conceptual y de código bien delimitada.

La regla cardinal de este ecosistema se define mediante la siguiente relación jerárquica:

$\text{Plataforma Core} \succ \text{Edificio} \succ \text{Suite} \succ \text{Amenidad/Módulo}$

## 2. Jerarquía de Dominio y Mapeo Técnico

| Nivel Jerárquico   | Término Ubicuo                    | Definición de Negocio                                                                                    | Concepto Técnico (Arquitectura / Code)                                                        | Anti-patrones / Prohibición                                                           |
| ------------------ | --------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| **Nivel 0 (Raíz)** | **Plataforma Core** _(el Monorepo Nx)_     | El terreno/plataforma global donde residen todas las verticales de negocio.                              | **Monorepo / Ecosistema Core** (`apps/`, `packages/`, infra global).                          | No usar como producto final. La Plataforma Core no se vende directamente; contiene productos.   |
| **Nivel 1**        | **Edificio** _(Vertical)_         | Un producto de negocio independiente con sus propias reglas (ej. _CoreProduct_, _Real Estate_, _Logistics_). | **Bounded Context / Core Product**. Posee su propio modelo de datos y reglas de dominio base. | **NUNCA** usar "Suite" como sinónimo de Edificio. No slash `/` tipo `Edificio/Suite`. |
| **Nivel 2**        | **Suite** _(Tenant / Custom)_     | Un espacio reservado y adaptado para un cliente de ticket alto (VIP) **dentro** de un Edificio.          | **Tenant Config / Overrides / Plugin Layer**. No puede existir de manera aislada.             | **NUNCA** asumir "Suite" como paquete de software genérico (ej. MS Office).           |
| **Nivel 3**        | **Amenidad** _(Módulo / Feature)_ | Funcionalidad específica o servicio compartido que puede activarse en una Suite o Edificio.              | **Shared Library / Feature Module / Integration Service**.                                    | No crear lógica condicional ad-hoc fuera de carpetas de módulos.                      |

## 3. Matriz de Definiciones y Glosario Estricto

### 3.1. Plataforma Core (el Monorepo Nx)

- **Definición:** Plataforma matriz donde coexisten todos los desarrollos y la infraestructura base compartida (DevOps pipelines, UI kits globales, autenticación central).
- **Equivalente en código:** Raíz del monorepo (`/`).

### 3.2. Edificio (Vertical de Negocio)

- **Definición:** Modelo de negocio base. Define las entidades genéricas, los flujos estándar y las APIs core.
- **Equivalente en código:** Carpetas en `/verticals` o `/apps` (ej: `/verticals/core-product`).
- **Regla:** El código del Edificio **no conoce** las personalizaciones de las Suites.

### 3.3. Suite (Tenant High-Ticket)

- **Definición:** Instancia personalizada o paquete de _overrides_ configurados para un cliente VIP específico que opera sobre la estructura de un Edificio.
- **Equivalente en código:** Carpetas en `/suites` o archivos de configuración de tenant (`/suites/academy`).
- **Regla:** La Suite depende $100\%$ del Edificio. Si el Edificio no existe, la Suite no puede compilarse ni ejecutarse.

## 4. Estándar de Nomenclatura en la Práctica

### 4.1. En la Estructura de Repositorios (File System)

```
nx-monorepo/                    <-- plataforma-core (Monorepo Root)
├── packages/                       <-- Shared Infrastructure & UI
│   ├── core-auth/
│   └── ui-components/
├── verticals/                      <-- EDIFICIOS (Bounded Contexts)
│   ├── core-product/                   <-- Edificio CoreProduct
│   └── logistics/                  <-- Edificio Logistics
└── suites/                         <-- SUITES (Tenants / High-Ticket Overrides)
    ├── tenant-custom/            <-- Suite "academy" sobre el Edificio CoreProduct
    └── tenant-vip/           <-- Suite "daleplay" sobre el Edificio CoreProduct
```
