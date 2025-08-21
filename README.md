# Pricepegasus Landing

Landing page estática con Tailwind CDN y formularios modales de **Log In** y **Sign Up** con validación en el front.

## Estructura
```
.
├── index.html
└── assets
    ├── css
    │   └── styles.css
    ├── js
    │   └── main.js
    └── img
        ├── favicon.svg
        └── favicon.ico
```

## Desarrollo local
Abre `index.html` en tu navegador. Para evitar problemas de rutas, puedes servir con un servidor estático:
- Python: `python -m http.server 8000`
- Node: `npx serve`

Luego visita `http://localhost:8000`.

## Deploy en GitHub Pages
1. Sube este repo a GitHub (rama `main`).
2. En **Settings → Pages**:
   - *Source*: **Deploy from a branch**
   - *Branch*: `main` y carpeta `/ (root)`
3. Guarda. Tu página quedará disponible en unos segundos.

## Endpoints backend
- `POST /login` y `POST /signup` deben devolver JSON `{ "ok": true, "message": "..." }`.
- Si devuelven texto/HTML, el front mostrará ese texto como mensaje igualmente.

## Icono
Incluye tu propio `assets/img/favicon.ico` (64×64 o 32×32) si lo deseas. El archivo actual es un placeholder.
