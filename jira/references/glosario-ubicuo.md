---
type: reference
title: '📖 08. Glosario Maestro del Lenguaje Ubicuo de la plataforma'
description: 'Diccionario canónico de términos técnicos y de negocio del ecosistema MX el Monorepo Nx (Plataforma Core, Edificio, Lobby, Motor, Suite, Tenant).'
tags: [jg7-core, academy, core-product, glosario, ddd, terminologia, lenguaje-ubicuo]
generated: { by: 'human:jguzman', at: '2026-08-20T03:45:00.000Z' }
lastUpdate: '2026-08-20T03:45:00.000Z'
spaceKey: DOCS
folderId: '382140434'
---

# 📖 08. Glosario Maestro del Lenguaje Ubicuo de la plataforma

| Término                  | Definición Técnica                                                          | Definición de Negocio                                                           |
| :----------------------- | :-------------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| **Plataforma Core (Plataforma Corey)**       | Monorepo maestro (`mx-nx-monorepo`) con tooling Nx y PNPM.              | El parque industrial tecnológico completo de JG7.                     |
| **Edificio (Building)**  | Directorio de dominio en `apps/{vertical}/` y `libs/{vertical}/`.           | Una industria o línea de producto independiente (ej. Deportes, Comercio).       |
| **Lobby**                | Aplicación Host compilada y desplegada en Firebase Hosting.                 | La recepción y puerta de entrada del cliente con su marca propia.               |
| **Motor (Engine)**       | Aplicación Remota federada expuesta por CDN con `remoteEntry.js`.           | El sistema operativo que contiene todas las herramientas de trabajo.            |
| **Suite**                | Librería en `libs/{vertical}/suite-*` con componentes y flujos específicos. | El espacio personalizado y equipado a la medida para un cliente VIP.            |
| **Infraestructura**      | Paquetes en `libs/shared/*` (`@jg7/*`).                               | Los servicios públicos compartidos: agua, luz y cimientos de seguridad.         |
| **Inquilino (Tenant)**   | Organización identificada con un `tenantId` en Firestore.                   | La empresa o academia que contrata el servicio.                                 |
| **Pase de Lista Táctil** | Componente de alta velocidad en `AttendancePageComponent`.                  | La herramienta con la que el profesor toma asistencia en cancha en 15 segundos. |
| **Kardex Deportivo**     | Registro de asistencias, pagos y estado físico de un alumno.                | El expediente integral del estudiante.                                          |
