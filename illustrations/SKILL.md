---
name: illustrations
description: Diseña y genera ilustraciones editoriales minimalistas y dibujadas a mano para artículos, posts, blogs, documentos de Notion, flujos de trabajo, metodologías, estructuras, estados o metáforas. Usar cuando el usuario pida "ilustraciones", "bocetos", "estilo Xiaohei", "dibujo a mano", "shot list", "sugerencias de ilustración" o "editar/quitar título de imagen". Estilo por defecto: fondo blanco puro, trazo negro a mano, personaje Xiaohei, pocas anotaciones en rojo/naranja/azul, mucho espacio en blanco y un toque absurdo pero claro.
---

# Ilustraciones editoriales (estilo Xiaohei)

## Propósito principal

Diseñar y generar ilustraciones horizontales en formato 16:9 para acompañar artículos y documentos. El objetivo no es hacer ilustración comercial, infografías de PowerPoint ni dibujos infantiles, sino transformar las ideas clave, flujos, estructuras, estados o metáforas del texto en un boceto explicativo limpio, ligeramente absurdo, creativo y legible sin parecer un manual de instrucciones.

El personaje visual por defecto es **Xiaohei**: una pequeña criatura negra sólida, con ojos de puntos blancos, patas delgadas y expresión inexpresiva, realizando con total seriedad una tarea absurda pero conceptualmente válida. Xiaohei debe participar en la acción central de la escena, nunca quedarse parado a un lado como simple adorno.

## Referencias (leer bajo demanda)

Lee solo las referencias necesarias para la tarea; no satures el contexto de una sola vez:

- `references/style-dna.md`: ADN del estilo, paleta de colores, texto y prohibiciones.
- `references/xiaohei-ip.md`: apariencia, personalidad, repertorio de acciones y límites de Xiaohei.
- `references/composition-patterns.md`: tipos de estructura, método para inventar metáforas originales y reglas anti-repetición.
- `references/prompt-template.md`: plantilla de prompt para generar o editar cada imagen.
- `references/qa-checklist.md`: lista de verificación posterior y criterios de iteración.
- `assets/examples/`: usar solo de forma puntual para calibrar densidad visual y estilo; no entra en el flujo por defecto ni se deben copiar sus composiciones, objetos o etiquetas.

## Flujo de trabajo

### 1. Digerir el texto

Lee primero el artículo, enlace, página de Notion, archivo Markdown o captura que proporcione el usuario. Extrae:

- Cuál es la tesis o idea central.
- Qué párrafos marcan un giro cognitivo.
- Qué conceptos se explican mejor con una imagen.
- Qué partes funcionan mejor solo con texto y no necesitan ilustración.

No repartas imágenes de forma uniforme. Prioriza los "anclajes cognitivos", por ejemplo: juicio clave, dos puntos de quiebre, bucle entrada-salida, bifurcación, antes vs. después, reutilización múltiple, ruta de conversión, errores comunes o cambios de estado del protagonista.

### 2. Definir la estrategia (Shot List)

Si el usuario solo pide "analizar cómo ilustrar / pensar dónde hacen falta imágenes", entrega primero un *shot list*. Para cada imagen indica:

- Después de qué párrafo va.
- Tema de la ilustración.
- Idea central.
- Tipo de estructura.
- Qué hace Xiaohei en la escena.
- Elementos sugeridos.
- Etiquetas breves recomendadas (en el idioma del artículo).

Por defecto, entre 4 y 8 imágenes. En textos muy cortos, 1 a 3; en artículos largos, procura no pasar de 9. Lo justo y necesario para no convertir el texto en un álbum ilustrado.

### 3. Generación individual

Si el usuario pide explícitamente "generar / crear / hacer las imágenes", no te detengas a pedir confirmación; genera cada imagen por separado con la herramienta de generación de imágenes (`image_gen` / `image-generator`). Nunca juntes varias ilustraciones en un mismo lienzo.

Cada imagen explica una sola estructura central. El prompt debe incluir:

- Ilustración editorial horizontal 16:9.
- Fondo blanco puro.
- Trazo negro dibujado a mano.
- Pocas anotaciones manuscritas en rojo, naranja o azul (en el idioma del artículo).
- Abundante espacio en blanco.
- Xiaohei ejecutando la acción conceptual principal.
- Prohibido: estilo PowerPoint, ilustración comercial, estética infantil/tierna, diagramas complejos o títulos de categoría en la esquina superior izquierda.

No repliques ejemplos anteriores. Los casos de ejemplo solo sirven como referencia de densidad visual y rol de Xiaohei; no reutilices composiciones previas ("dos puntos de ruptura en cinta transportadora", "Xiaohei tirando de cables", "pez de materia prima", "caja de herramientas con sello", "camino de errores comunes") a menos que el usuario lo pida expresamente. Inventa siempre una metáfora nueva, extraña y funcional a partir del texto actual.

### 4. Revisión e iteración

Tras generar, valida contra `references/qa-checklist.md`. Regenera o edita localmente si aparece cualquiera de estos fallos:

- Xiaohei es solo un adorno.
- La escena está demasiado llena.
- Parece un diagrama de flujo formal o diapositiva de PPT.
- Hay demasiado texto o errores tipográficos graves en las etiquetas.
- Aparece un título en la esquina superior izquierda ("Errores comunes", "Workflow", "Arquitectura", etc.).
- El estilo se ve demasiado tierno, infantil o rígido.
- El fondo no es blanco limpio.

### 5. Guardar y entregar

Si el usuario trabaja dentro de un workspace, guarda las imágenes finales en:

```text
assets/<article-slug>-illustrations/
```

Nómbralas en orden secuencial:

```text
01-topic-name.png
02-topic-name.png
```

Conserva los archivos originales generados y no sobrescribas recursos existentes salvo que el usuario pida reemplazarlos.

## Formato de salida

La propuesta previa (shot list) debe ser breve y precisa. La entrega final tras generar debe incluir:

- Cuántas imágenes se generaron.
- El propósito de cada imagen.
- La ruta donde se guardaron.
- Cuáles quedaron más sólidas y cuáles son opcionales.

No des largas explicaciones teóricas sobre el estilo; deja que las imágenes hablen por sí solas.
