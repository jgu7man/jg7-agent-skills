# Plantilla de prompt para generación de imágenes

Genera cada imagen por separado. Sustituye las variables según el contenido del artículo y nunca combines varias ilustraciones en una sola imagen.

```text
Generate one standalone 16:9 horizontal editorial article illustration.

Visual DNA:
Pure white background. Minimalist black hand-drawn line art. Slightly wobbly pen lines. Lots of empty white space. Sparse red/orange/blue handwritten {idioma, ej. Spanish} annotations. Clean absurd product-sketch feeling. No gradients, no shadows, no paper texture, no complex background, no commercial vector style, no PPT infographic look, no cute mascot poster, no children's illustration, no realistic UI.

Recurring IP character required:
Xiaohei, a small solid-black absurd creature with white dot eyes, tiny thin legs, blank serious expression, slightly uneven hand-drawn body shape. Xiaohei must perform the core conceptual action, not decorate the scene. Make Xiaohei serious, deadpan, and slightly bizarre, not cute.

Theme:
{Tema de la ilustración}

Structure type:
{Tipo de estructura: Flujo / Módulo de sistema / Antes-Después / Estado del personaje / Metáfora conceptual / Capas / Ruta o mapa / Mini historieta}

Core idea:
{Idea central que debe transmitir esta imagen}

Composition:
{Escena concreta: dónde está Xiaohei, qué está haciendo, cuál es el objeto principal y cómo fluye la información}

Suggested elements:
{Elemento 1} / {Elemento 2} / {Elemento 3} / {Elemento 4}

Handwritten labels ({idioma, ej. Spanish}):
{Etiqueta 1} / {Etiqueta 2} / {Etiqueta 3} / {Etiqueta 4} / {Etiqueta opcional 5}

Color use:
Black for main line art and Xiaohei. Orange for main flow/path/arrows. Red only for key warnings/problems/results. Blue only for secondary notes or feedback/system state.

Constraints:
One image explains only one core structure. Keep the main subject around 40%-60% of the canvas. Preserve at least 35% blank white space. Use at most 5-8 short handwritten labels. Do not write a title in the top-left corner. Do not write the structure type on the image. Do not make it a formal diagram, course slide, or dense explainer. Do not copy prior examples or reuse known case compositions unless explicitly requested; invent a fresh visual metaphor for this specific article. It should be clear but not instructional, interesting but not childish, strange but clean.
```

## Prompts de edición

Para eliminar un título en la esquina superior izquierda:

```text
Edit the provided image. Remove only the handwritten title "{texto a eliminar}" and its underline from the top-left corner. Fill that area with the same clean white background, matching the surrounding blank paper. Preserve everything else exactly: characters, labels, paths, line style, composition, aspect ratio, and image quality. Do not add any new text or objects.
```

Para reforzar el toque absurdo y el rol de Xiaohei:

```text
Regenerate this illustration with the same core meaning and simple layout, but make Xiaohei more central to the conceptual action. Xiaohei should be doing the strange work that explains the idea, not standing beside the diagram. Keep it clean, sparse, hand-drawn, and not cute.
```
