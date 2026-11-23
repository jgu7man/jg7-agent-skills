---
name: ghpr-extension-repair
description: Diagnostica y repara la extensión GitHub Pull Requests and Issues en Antigravity IDE cuando muestra 'There is no data provider registered' o falla por chatSessionsProvider.
---

# GitHub Pull Requests Extension Repair for Antigravity IDE

Usa esta skill cuando el usuario reporte que la vista de Pull Requests de GitHub no carga en Antigravity IDE o cuando aparezca el error:
`There is no data provider registered that can provide view data.`

## Causa Raíz Conocida
Antigravity IDE maneja una lista blanca en `product.json` que solo admite las APIs propuestas de GHPR hasta la versión `0.112.0`. Las versiones `>= 0.114.0` (como `0.126.0+`) intentan inicializar llamadas a Copilot SWE Agent (`chatSessionsProvider`), lo que causa un error fatal de activación.

## Procedimiento de Solución Rápida

1. Ejecuta el script de reparación global:
```bash
repair-antigravity-ghpr
```

2. Verifica que `extensions.json` en `~/.antigravity-ide/extensions/extensions.json` apunte a `0.112.0` con `"pinned": true`.

3. Pídele al usuario que recargue la ventana:
   - Presionar `Cmd + Shift + P`
   - Ejecutar: `Developer: Reload Window`

4. El panel de Pull Requests en la barra lateral volverá a mostrar los PRs abiertos, cerrados, status de CI y revisiones.
