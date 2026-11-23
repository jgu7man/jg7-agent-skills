---
name: jira-rice-estimation
description: Estándar y playbook para evaluar y calcular la priorización RICE (Reach, Impact, Confidence, Effort) en Jira Discovery (MXPD) adaptado a la capacidad operativa real del equipo de Marxa Digital. El esfuerzo se mide en escala 1 a 5 considerando el squad actual (Tú + Antigravity + QA por ti + auxiliar parcial) y se autocalibra mensualmente consultando al usuario si el equipo ha crecido.
---

# ⚖️ Skill: Estimación RICE en Jira Discovery (`jira-rice-estimation`)

Utiliza este skill siempre que necesites **evaluar, estimar, justificar o actualizar las métricas RICE (Reach, Impact, Confidence, Effort)** para iniciativas o ideas en Jira Discovery (**MXPD**) y proyectos de Marxa Digital.

---

## 👥 1. Contexto Operativo y Principio de Calibración Pragmática

La estimación de **Effort (Esfuerzo)** debe balancearse en un **punto medio sensato**: ni caer en la lentitud de burocracias corporativas tradicionales, ni asumir una infalibilidad irreal del squad.

- **Composición del Squad**:
  - **Jorge Guzmán (Lead & Architect)**: Arquitectura, toma de decisiones, reglas de negocio y QA manual/forense en emuladores.
  - **Antigravity (AI Pair Programmer)**: Scaffolding en caliente, implementación algorítmica, contratos de TypeScript y documentación.
  - **Auxiliar de Desarrollo**: Apoyo parcial intermitente en tiempo libre (no considerar como capacidad garantizada).
- **Factor Humano e Imprevistos (Colchón Obligatorio)**:
  - El código generado por IA agiliza la escritura, pero **el diseño fino, la detección de edge cases y la validación en emuladores consumen atención humana real**.
  - Toda estimación debe contemplar un **colchón de contingencia del 20% al 30%** para absorber juntas de negocio, soporte operativo a usuarios, fatiga cognitiva y eventuales errores de librerías o dependencias externas.

> [!IMPORTANT]
> **REGLA DE CALIBRACIÓN MENSUAL OBLIGATORIA**:
> Cada mes o al retomar sesiones de priorización, el agente **DEBE PREGUNTAR AL USUARIO**:
> _"¿Seguimos trabajando con la misma capacidad de equipo (tú como Lead/QA + Antigravity en pair programming + apoyo parcial del auxiliar), o ha cambiado la estructura o disponibilidad para recalibrar el esfuerzo?"_

---

## 📐 2. Escalas de Calificación Oficiales en MXPD (Jira Discovery)

En Jira Polaris / Discovery, todos los factores se cuantifican con calificaciones normalizadas:

### A. Reach (Alcance): Escala 1.0 a 5.0

Mide la proporción de la comunidad que se beneficia o interactúa con la iniciativa:

- **`1.0`**: Caso aislado o herramienta administrativa interna muy acotada.
- **`2.0`**: Segmento reducido (ej. solo personal de mantenimiento o proveedores).
- **`3.0`**: Segmento operativo específico (ej. solo profesores en cancha, o solo tutores de nuevo ingreso).
- **`4.0`**: Mayoría operativa (ej. 80% de alumnos en torneos, o 100% de transacciones de caja).
- **`5.0`**: Toda la comunidad sin excepción (100% de alumnos, tutores, staff, administración y directivos).

### B. Impact (Impacto): Escala 1.0 a 5.0

Mide cuánto mueve la aguja en el negocio, satisfacción o blindaje contable:

- **`1.0`**: Mínimo / Cosmético.
- **`2.0`**: Bajo / Mejora menor de conveniencia.
- **`3.0`**: Moderado / Ahorro de tiempo tangible.
- **`4.0`**: Alto / Resuelve un cuello de botella grave o desorganización recurrente.
- **`5.0`**: Transformacional o Crítico / Evita fuga de dinero, descuadres legales/contables o define la reputación pública del negocio.

### C. Confidence (Confianza): Porcentaje (50% a 100%)

Mide qué tan seguros estamos de los requisitos, la viabilidad técnica y los riesgos:

- **`50% - 70%`**: Idea en exploración, requerimientos ambiguos, falta de datos de directiva o tecnología desconocida.
- **`80%`**: Requerimientos claros pero con dependencias externas, reglas contables por validar o posibles edge cases.
- **`90%`**: Modelos y colecciones existentes en base de datos; solo faltan detalles finos de regla de negocio.
- **`95% - 100%`**: Arquitectura idéntica a flujos ya probados en producción con cero incertidumbre técnica.

### D. Effort (Esfuerzo): Escala 1.0 a 5.0 (Punto Medio Realista-Conservador)

Mide la complejidad de implementación, iteraciones de diseño y tiempo de QA humano:

- **`1.0` (Muy Bajo - 2 a 3 días)**: Tweak o ajuste puntual, bugfix acotado o componente muy simple sin dependencias contables complejas.
- **`2.0` (Bajo - 3 a 5 días / ~1 semana ligera)**: Feature bien delimitada con 1 modal o vista, flujo lineal y bajo riesgo de regresión. Incluye pruebas y validación.
- **`3.0` (Medio - 1 a 2 semanas)**: Feature completa de dominio que toca modelo, motor (_Headless Engine_), UI reactiva, autocalculos y pruebas unitarias/QA en emulador.
- **`4.0` (Alto - 2 a 3 semanas)**: Módulo complejo con reglas contables estrictas, múltiples pantallas interconectadas, sincronizaciones o integraciones externas críticas.
- **`5.0` (Muy Alto - > 3 a 4 semanas)**: Sistema transversal grande, reestructuración arquitectónica, migraciones de base de datos en producción o nuevas verticales completas.

---

## 🧮 3. Fórmula de Cálculo del RICE Score en Jira Product Discovery

En Jira Product Discovery (JPD), el campo de fórmula calculado (`fx RICE`) utiliza el valor entero de `Confidence` (50 a 100) directamente, sin dividir entre 100. Por lo tanto, los valores resultantes se manejan en una escala de **10 a 2,500 puntos**:

$$\text{RICE Score (Jira Discovery)} = \frac{\text{Reach (1.0 - 5.0)} \times \text{Impact (1.0 - 5.0)} \times \text{Confidence (50 - 100)}}{\text{Effort (1.0 - 5.0)}}$$

> **Puntaje Máximo Teórico**:
> $$\text{Score Máximo} = \frac{5.0 \times 5.0 \times 100}{1.0} = \mathbf{2,500 \text{ pts}}$$
>
> **Ejemplos Reales Calibrados**:
>
> - **Blindaje Transaccional de Caja**: $\frac{4.0 \times 5.0 \times 95}{2.0} = \mathbf{950 \text{ pts}}$
> - **Convocatorias a Partidos & Confirmación 1-Tap**: $\frac{4.0 \times 4.0 \times 95}{2.0} = \mathbf{760 \text{ pts}}$
> - **Cierre Contable & Analíticas de Fin de Mes**: $\frac{5.0 \times 5.0 \times 90}{3.0} = \mathbf{750 \text{ pts}}$
> - **Portal de Padres & Autoservicio**: $\frac{5.0 \times 5.0 \times 95}{4.0} = \mathbf{593.75 \approx 594 \text{ pts}}$

---

## ⚡ 4. Plantilla Express: Análisis de Méritos (2 Minutos)

Para evaluar cualquier idea nueva de forma ágil antes de subirla o actualizarla en Jira:

| Factor                  | Pregunta Guía de Calibración                                                                                                                                           | Calificación |
| :---------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------- |
| **Reach** (1-5)         | ¿A qué porcentaje de la comunidad o flujo operativo beneficia? (1: Caso raro $\rightarrow$ 5: 100% de alumnos/tutores/caja)                                            | `X.X`        |
| **Impact** (1-5)        | ¿Qué resuelve? (1: Cosmético $\rightarrow$ 3: Ahorro de tiempo $\rightarrow$ 5: Evita fuga de dinero o descuadre contable crítico)                                     | `X.X`        |
| **Confidence** (50-100) | ¿Tenemos certeza de requisitos y modelos existentes? (50%: Exploración $\rightarrow$ 90%: Modelo en DB $\rightarrow$ 100%: Cero dudas)                                 | `XX%`        |
| **Effort** (1-5)        | Esfuerzo squad (Jorge + Antigravity + QA + colchón): (1: 2-3 días $\rightarrow$ 2: 3-5 días $\rightarrow$ 3: 1-2 sem $\rightarrow$ 4: 2-3 sem $\rightarrow$ 5: >3 sem) | `X.X`        |

$$\mathbf{RICE = \frac{Reach \times Impact \times Confidence}{Effort}}$$

- **Roadmap Sugerido**: $\ge 750 \rightarrow \mathbf{Now}$ | $500 - 749 \rightarrow \mathbf{Next}$ | $< 500 \rightarrow \mathbf{Later}$

---

## 🛠️ 5. Protocolo de Actualización en Jira vía API (`jira-mcp-server` / REST)

Mapeo de IDs de campos en el proyecto **MXPD**:

- `customfield_10394`: Reach (number: `1.0` - `5.0`)
- `customfield_10391`: Impacto + (number: `1.0` - `5.0`)
- `customfield_10404`: Confidence (number: `50.0` - `100.0`)
- `customfield_10402`: Esfuerzo (number: `1.0` - `5.0`)
- `customfield_10406`: RICE score (number: valor calculado)
- `customfield_10393`: Roadmap (`Now`: `10387`, `Next`: `10388`, `Later`: `10389`)
