---
name: user-friendly-release-notes
description: Traduce commits técnicos de git a notas de lanzamiento redactadas en lenguaje simple y amigable enfocado en beneficios al usuario.
---

# Skill: Redacción Amigable de Notas de Lanzamiento

Esta skill asiste al agente en la conversión de descripciones técnicas de commits de Git a notas de lanzamiento enfocadas en los beneficios de cara al usuario final, eliminando jerga de código y base de datos.

## Guía de Estilo de Redacción

Cuando se te pida traducir o redactar las notas de lanzamiento para el usuario final, sigue estas pautas:

1. **Evita la Jerga Técnica**: NUNCA menciones nombres de bases de datos, APIs de Vertex AI, triggers de Firestore, archivos TypeScript/Angular o estructuras de CI/CD.
2. **Prioriza los Beneficios**: Enfoca cada cambio en cómo ayuda al usuario final (ej. "ahorro de tiempo", "interfaz más cómoda", "números más precisos").
3. **Organización Visual**: Agrupa los cambios por módulos significativos de la aplicación con títulos claros y emojis explicativos.

## Ejecución Automatizada

El repositorio cuenta con un script TypeScript dedicado que realiza esta traducción utilizando la API de Gemini (totalmente libre de costos de Copilot):

```bash
# Requiere la variable de entorno GEMINI_API_KEY
GEMINI_API_KEY="tu_api_key" npx ts-node scripts/release/generate-friendly-notes.ts [rama-base]
```

El script analizará los commits y creará el archivo `release_notes_friendly.md` con las notas listas para pegar en el Issue de GitHub.
