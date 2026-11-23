---
name: procesar-estado-cuenta
description: >-
  Procesamiento, extracción y sincronización automática de nuevos estados de cuenta bancarios (PDFs)
  para Santander (Débito, Gold, Like U) y Mercado Pago en MissFinanzas v2.0. Usar cuando el usuario
  entregue un nuevo PDF de estado de cuenta o solicite procesar estados de cuenta recién descargados.
---

# Skill: Procesar Nuevo Estado de Cuenta (MissFinanzas v2.0)

Este skill define la guía paso a paso para recibir, ubicar, procesar y sincronizar nuevos estados de cuenta bancarios en formato PDF dentro del sistema **MissFinanzas v2.0 Blueprint**.

---

## Workflow de Procesamiento

### Paso 1: Identificación de la Cuenta y Periodo
Analizar el PDF recibido o proporcionado por el usuario para determinar:
- **Cuenta**: `Débito`, `Gold`, `Like U` o `Mercado Pago`.
- **Periodo**: Formato `YYYYMM` (ejemplo: `202609` para septiembre de 2026).

### Paso 2: Ubicación del Archivo en la Estructura de Google Drive
Depositar o copiar el archivo PDF en el directorio correspondiente dentro de la ruta base de estados de cuenta:

- **Ruta Base**: `/Users/jgu7man/Library/CloudStorage/GoogleDrive-jgu7man@gmail.com/My Drive/Documentos/Finanzas/Estados de cuenta/`
- **Carpetas por Cuenta**:
  - `Débito`: `<Ruta Base>/Débito/<YYYYMM>/YYYYMM_debito.pdf`
  - `Gold`: `<Ruta Base>/Gold/<YYYYMM>/YYYYMM_gold.pdf`
  - `Like U`: `<Ruta Base>/Like U/<YYYYMM>/YYYYMM_likeu.pdf`
  - `Mercado Pago`: `<Ruta Base>/Mercadopago /<YYYYMM>/YYYYMM_mercadopago.pdf` *(Nota: la carpeta conserva el espacio final)*

### Paso 3: Ejecución del Pipeline Híbrido de Extracción
Ejecutar el script acelerado de extracción en Python para actualizar los CSVs individuales y el máster unificado:

```bash
/tmp/pdf_env/bin/python "/Users/jgu7man/Code/jguzman/missfinanzas-idea/scripts/pipeline_statements.py"
```

*El pipeline ejecutará automáticamente:*
- Extracción nativa directa sub-segundo para Mercado Pago.
- OCR acelerado a 150 DPI para Santander (Débito, Gold, Like U).
- Clasificación estricta en 4 categorías: `INGRESO_DEBITO` 🟢, `CONSUMO_TDC` 🔵, `EGRESO_EFECTIVO` 🟠, `PAGO_TARJETA` 🟣.
- Deduplicación automática de repeticiones históricas de Meses Sin Intereses (MSI).

### Paso 4: Sincronización de Activos con la Aplicación Web Angular
Copiar los archivos CSV generados a los assets públicos del proyecto Angular:

```bash
# Copiar el archivo máster consumido automáticamente por la app
cp "/Users/jgu7man/Library/CloudStorage/GoogleDrive-jgu7man@gmail.com/My Drive/Documentos/Finanzas/Estados de cuenta/movimientos_consolidados_todos.csv" "/Users/jgu7man/Code/jguzman/missfinanzas-idea/public/assets/movimientos_consolidados_todos.csv"

# Copiar el conjunto de CSVs por cuenta a la carpeta pública de respaldo
mkdir -p "/Users/jgu7man/Code/jguzman/missfinanzas-idea/public/assets/csv"
cp "/Users/jgu7man/Library/CloudStorage/GoogleDrive-jgu7man@gmail.com/My Drive/Documentos/Finanzas/Estados de cuenta/"*.csv "/Users/jgu7man/Code/jguzman/missfinanzas-idea/public/assets/csv/"
```

### Paso 5: Verificación y Validación de Compilación
Validar la compilación estricta de la aplicación Angular:

```bash
npx ng build --configuration production
```

### Paso 6: Confirmación al Usuario
Informar al usuario los siguientes detalles de la auditoría:
- Nombre del estado de cuenta procesado y periodo.
- Cantidad total de movimientos extraídos.
- Confirmación de deduplicación de MSI (si aplica).
- Estado del servidor dev (`http://localhost:4200/`).
