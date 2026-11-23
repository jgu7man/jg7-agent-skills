---
name: friendly-commits
description: 'Guidelines for writing friendly, high-level, and non-technical git commit messages for executives'
---

# Friendly and Non-Technical Commit Messages

Use these guidelines whenever writing, editing, or amending Git commits in the workspace.

## Rules

- **The commit title MUST follow the Conventional Commits format** (e.g., `feat: ...`, `fix: ...`, `refactor: ...`, `style: ...`). It can be written in Spanish or English, but must adhere to this structure (e.g., `feat: mejoras en la vista de pedidos`).
- **Write body descriptions in a friendly, high-level, and non-technical language** that is easy to understand for everyone, including business executives.
- **Do NOT describe internal code elements** (classes, files, database models, or technical patterns) in the body description unless strictly necessary.
- **Describe the _what_ and the _impact_** from a user/product perspective (e.g., "Ajustamos la posición del aviso de pedidos vencidos en móviles para que no quede tapado por la barra de navegación inferior").
- **Hex colors can be included** to align styles (e.g., "Se cambió el color del botón azul de #123456 a #654321 para coincidir con la marca"). Do not use Tailwind utility class names in commit descriptions.
- **Measurement concepts can be described** using friendly terms (e.g., "se cambió el ancho de la celda título de px a rem para que sea responsivo").
