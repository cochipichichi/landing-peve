
# Plataforma Exámenes Libres — San Nicolás 360°

Portal listo para **venta individual a apoderados** y uso en casa por estudiantes que rinden **exámenes libres** en el liceo.
Incluye: **planes**, **panel de estudiante**, **panel de apoderados**, **panel admin**, **3 módulos demo integrados** y **modo offline**.

## Estructura
- `index.html` — Landing con KPIs y accesibilidad.
- `plans/` — Planes y promociones familiares.
- `students/` — Panel estudiante (progreso, simulacros, repos 3D/AR).
- `parents/` — Panel apoderados (seguimiento).
- `admin/` — Administración (usuarios demo, export CSV, configuración).
- `modules/` — Tres módulos integrados: Cadenas Tróficas, Cráneos Conectados, SolarSat.
- `assets/js/service-worker.js` — Cache para **modo offline**.

## Cómo usar (local)
1. Levanta un servidor estático (ej. VS Code Live Server) o sube a GitHub Pages.
2. Abre `index.html` y usa los botones de ingreso **demo** (estudiante/apoderado/admin).
3. Los datos se guardan en `localStorage` del navegador (demo).

## Integraciones (configuración)
- **Google Sheets / Apps Script**: crea un endpoint POST y añade la URL en `config.json` (no incluido por seguridad).
- **Pagos**: define webhook de confirmación (Webpay/Mercado Pago).
- **Notificaciones**: integra WhatsApp Business API o correos (SMTP / servicios de terceros).

## Accesibilidad
- Alto contraste y fuente legible (toggles en la landing).
- Estructura compatible con lectores.
- Diseñado para estudiantes PIE (ritmo y apoyos visuales).

## Notas
- Los botones “Ver en 3D/AR” están listos para enlazar a tus modelos y visores preferidos.
- Este repositorio es **demo**; puedes reemplazar módulos por tus repos reales y añadir más.
- Personaliza textos de precios en `plans/` según tu oferta vigente.
