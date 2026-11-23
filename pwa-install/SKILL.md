---
name: pwa-install
description: Playbook global, arquitectura UX y guía multi-plataforma (iOS 18+, Android, Windows, macOS y navegadores in-app como WhatsApp) para implementar experiencias no invasivas de instalación, detección de entorno standalone y actualización de PWAs ("Cómo instalar") en cualquier aplicación web de JG7.
---

# 📲 Skill Global: Experiencia de Usuario para Instalación y Ciclo de Vida PWA (`pwa-install`)

Utiliza este skill siempre que diseñes, audites o implementes flujos de instalación de Progressive Web Apps (`"Cómo instalar"`), detección de entorno `standalone`, manejo de `beforeinstallprompt`, recarga de versiones o evaluación de publicación en tiendas (App Store / Google Play) en cualquier proyecto web o monorepo.

---

## 🧭 1. Principios Rectores de UX (Cero Invasividad)

1. **Prohibido Mostrar Banners Flotantes o Popups Automáticos al Iniciar**:
   - Nunca interrumpir la operación del usuario con banners automáticos pidiendo instalar la aplicación.
   - La guía de instalación debe activarse **únicamente bajo demanda** mediante un botón discreto y claro llamado **"Cómo instalar"** (ubicado en la pantalla de Login, barra de navegación secundaria y/o dentro del cajón lateral **"Más"**).
2. **Ocultación Automática cuando ya es PWA (`standalone`)**:
   - Si la aplicación ya se ejecuta instalada desde la pantalla de inicio o escritorio:
     ```ts
     const isStandalone =
       window.matchMedia('(display-mode: standalone)').matches ||
       (window.navigator as { standalone?: boolean }).standalone === true;
     ```
   - Cuando `isStandalone === true`, el botón **"Cómo instalar"** debe ocultarse automáticamente.
3. **Detección Inteligente de Plataforma con Selector Manual**:
   - Al abrir el modal **"Cómo instalar"**, debe preseleccionar automáticamente la pestaña del sistema operativo detectado (`iOS`, `Android`, `Windows` o `macOS`), pero permitir al usuario cambiar de pestaña libremente (por ejemplo, si un usuario desde su PC quiere consultar cómo instalarla en su teléfono o explicarle a un tercero).
4. **Detección de Navegadores In-App (WhatsApp / Instagram / Facebook)**:
   - En iOS y Android, si el usuario abrió el enlace dentro del navegador embebido de WhatsApp o redes sociales, el paso previo obligatorio es indicarle que toque **"Abrir en Safari / Chrome"** (ícono de brújula inferior derecha en iOS o menú `⋮` superior en Android), ya que los WebViews embebidos bloquean la instalación de PWAs.

---

## 📱 2. Instrucciones Reales Verificadas por Sistema Operativo

### 🍎 A. iOS / iPadOS (Safari en iOS 18+) — **5 Pasos**
> **Contexto técnico**: Apple WebKit no soporta `beforeinstallprompt` (jamás muestra invitación automática) y en versiones recientes de iOS la acción *"Agregar a inicio"* ya no aparece en el primer nivel del menú, sino oculta tras *"Ver más"*.

1. **Abrir el menú contextual**: Tocar el botón de menú (`•••` o ícono de opciones) en la **parte inferior, junto a la barra de direcciones a la izquierda**.
2. **Seleccionar "Compartir"**: Tocar la opción **Compartir** (`[↑]`) dentro del menú contextual.
3. **Seleccionar "Ver más"**: Tocar **"Ver más"** (o deslizar hacia abajo), ya que la acción no aparece en las primeras sugerencias rápidas.
4. **Seleccionar "Agregar a inicio"**: Tocar **"Agregar a inicio"** (`[+]`).
5. **Confirmar el título**: Definir el título deseado (o dejarlo como está) y tocar **"Agregar"** en la esquina superior derecha.

---

### 🤖 B. Android (Google Chrome) — **3 Pasos (+ 1-Clic Opcional)**
> **Contexto técnico**: Aunque Chrome soporta `beforeinstallprompt` (que permite ofrecer un botón primario *"Instalar ahora en 1 clic"* cuando el evento está disponible), siempre deben mostrarse los **3 pasos manuales** porque el evento nativo puede no dispararse si el usuario lo descartó previamente:

1. **Abrir el menú contextual**: Tocar el ícono de tres puntos (`⋮`) en la **parte superior derecha** de Chrome.
2. **Seleccionar "Install and Create Shortcut" / "Agregar a la pantalla principal"**: Tocar la opción de instalación e ícono directo en el menú.
3. **Seleccionar "Install" ("Instalar")**: Confirmar en el cuadro de diálogo para agregar la app al cajón de aplicaciones e inicio.

---

### 🪟 C. Windows (Google Chrome / Microsoft Edge) — **3 Pasos**
1. **Ubicar el acceso de instalación**: Hacer clic en el ícono de monitor con flecha (**"Instalar aplicación"**) situado a la derecha dentro de la barra de direcciones, o abrir el menú de tres puntos (`⋮` / `•••`) en la esquina superior derecha.
2. **Seleccionar la opción de aplicación**:
   - En Chrome: **"Guardar y compartir" → "Instalar página como aplicación..."**
   - En Edge: **"Aplicaciones" → "Instalar este sitio como una aplicación"**
3. **Confirmar en "Instalar"**: La aplicación se abrirá en su propia ventana independiente y podrá fijarse en la Barra de Tareas.

---

### 💻 D. macOS (Safari / Google Chrome) — **3 Pasos**
- **En Safari (macOS Sonoma+)**:
  1. Hacer clic en el botón **Compartir** (`[↑]`) en la esquina superior derecha de Safari (o menú **Archivo** en la barra superior).
  2. Seleccionar **"Agregar al Dock..."** (*Add to Dock*).
  3. Confirmar el nombre y hacer clic en **"Agregar"**.
- **En Google Chrome (macOS)**:
  1. Hacer clic en el ícono **Instalar** a la derecha de la barra de direcciones (o menú `⋮` → **Guardar y compartir** → **Instalar página como aplicación...**).
  2. Confirmar en **"Instalar"**.

---

## 🔄 3. Reglas de Ciclo de Vida y Refresh en PWA (`standalone`)

Dado que las PWAs instaladas en iOS (`standalone`) carecen de barra de direcciones y gesto *pull-to-refresh*:
1. **Controles UI 100% Propios**: Prohibido depender de `HTMLInputElement.prototype.showPicker()` en `input[type="month"]` o controles equivalentes que WebKit iOS bloquea.
2. **Verificación en `visibilitychange`**: El servicio de control de versión debe verificar `swUpdate.checkForUpdate()` cada vez que `document.visibilityState === 'visible'` y reportar cualquier excepción a **Sentry** (`Sentry.captureException`), jamás silenciar errores.
3. **Recarga No Invasiva**: Proveer un micro-botón de recarga (`↻`) junto al indicador de versión dentro del menú lateral (**"Más"** / Ajustes), nunca como botón flotante permanente en las vistas operativas.

---

## 🏛️ 4. Contexto Estratégico: PWA vs Tiendas Nativas (App Store / Google Play)

Al evaluar empaquetar una PWA con Capacitor para subirla a tiendas (incluso como *Unlisted App* con enlace privado) o distribuir binarios:
- **Android Sideloading (`.apk`)**: No recomendado para usuarios finales debido al bloqueo por defecto de **Samsung Auto Blocker**, **Modo de Protección Avanzada de Android** y los requisitos de **Android Developer Verification / Play Protect**.
- **Desktop (Windows / macOS)**: Viable distribuir instaladores `.exe` / `.dmg` (con Electron o Tauri) desde una página pública de descargas, siempre que estén firmados digitalmente (Apple Developer ID + Notarization en macOS y Authenticode en Windows).
- **Apple App Review (aplica igual a apps públicas y Unlisted Apps)**:
  1. **Guideline 3.1.1 (Pagos / Stripe)**: Apple rechaza apps que muestren botones o enlaces a Stripe Checkout / Portal de Suscripción para software SaaS dentro de iOS. Para pasar revisión bajo la regla *Multiplatform SaaS* (`3.1.3(b)`), cualquier vista de facturación SaaS debe ocultarse en compilaciones iOS.
  2. **Guideline 5.1.1(v) (Eliminación de Cuenta)**: Si existe creación de cuentas, es obligatorio incluir un flujo de **"Eliminar mi cuenta"** dentro de Ajustes de Cuenta.
  3. **Guideline 4.8 (Sign in with Apple)**: Si se ofrece *Iniciar sesión con Google*, es obligatorio incluir *Iniciar sesión con Apple*.
  4. **Guideline 4.2 (Funcionalidad Mínima)**: Requiere integrar capacidades nativas reales (Push Notifications nativas, FaceID, Share Sheet nativo) para no ser rechazada como mero WebView.
