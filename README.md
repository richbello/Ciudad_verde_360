# Ciudad Verde 360 (Verde360)

La app hiperlocal de **Ciudad Verde, Soacha (Cundinamarca)**: arriendos, negocios, talentos de vecinos, alertas entre conjuntos, mascotas, transporte y agenda en un solo mapa.

**Versión 1.0 · prototipo.** Un proyecto de XIRIN Technologies S.A.S.

## Pilares

| Pilar | Módulos |
|---|---|
| 🏠 Vivir | Inmuebles (arriendo y venta), Arrienda seguro, Conjuntos y porterías, Portal del Conjunto |
| 🛍️ Comprar y contratar | Negocios, Servicios 24 h de confianza, Talento Verde, Vecino Emprendedor |
| 🛡️ Convivir y cuidarse | Red de Alerta entre porterías, SOS, Huellitas Verde (mascotas), Agenda |
| 🚌 Moverse | Busetas en vivo (simulación), Conductores certificados |

Además: **Vera**, asistente por texto y voz que funciona en el navegador.

## Tecnología

- Un solo `index.html` (HTML, CSS y JavaScript sin frameworks).
- Mapa: [Leaflet](https://leafletjs.com) + OpenStreetMap.
- Voz: Web Speech API del navegador (dictado y lectura en voz alta).
- PWA instalable (`manifest.json` + `sw.js`).
- Costo de operación: $0 en GitHub Pages.

## Publicar en GitHub Pages

1. Settings → Pages → *Deploy from a branch* → rama `main`, carpeta `/ (root)` → Save.
2. En unos minutos queda en `https://richbello.github.io/ciudad_verde_360/`.

## Personalizar

Toda la configuración y los datos están al inicio del `<script>` de `index.html`:

- `WHATSAPP`: número de contacto (formato `57XXXXXXXXXX`).
- `CENTRO`: centro del mapa.
- `CASAS`, `NEGOCIOS`, `TALENTOS`, `CONJUNTOS`, `MASCOTAS`, `EVENTOS`, `ALERTAS`, `RUTAS`, `CONDUCTORES`: datos que se muestran.

Los registros marcados **«Ejemplo»** son de muestra y deben reemplazarse por datos reales autorizados. Las ubicaciones de conjuntos son aproximadas y deben verificarse en terreno.

## Publicaciones con aprobación (eventos)

La Agenda ya acepta eventos de cualquier vecino con **aprobación previa**, usando una hoja de Google como base de datos gratuita. Instrucciones en [`backend/LEEME.md`](backend/LEEME.md).

## Pendiente para la versión 2

- Extender el mismo backend a mascotas, alertas, talentos, reseñas y avisos de arriendo.
- Confirmación de reseñas por código de WhatsApp.
- Modo conductor: ubicación GPS real de las busetas.

## Datos personales

Verde360 trata los datos conforme a la Ley 1581 de 2012. Los estudios de arrendatario y las verificaciones se hacen solo con autorización expresa del titular, y sus resultados nunca se publican.
