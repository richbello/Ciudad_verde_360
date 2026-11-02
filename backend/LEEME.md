# Backend gratuito de Verde360 (Google Sheets + Apps Script)

Con esto, cualquier vecino publica un evento desde la página, queda **Pendiente** en una hoja de Google y **solo aparece en la Agenda cuando tú lo apruebas**. Costo: $0.

```
Vecino llena el formulario ──► Hoja «Eventos» (Pendiente) ──► te llega un correo
                                        │
                     tú cambias Estado a «Aprobado»
                                        │
                     la Agenda de Verde360 lo muestra a todos
```

## Instalación (una sola vez, unos 10 minutos)

1. **Crea la hoja.** En Google Drive: Nuevo → Hojas de cálculo. Llámala `Verde360 · Publicaciones`.
2. **Abre el editor de scripts.** En la hoja: Extensiones → Apps Script.
3. **Pega el código.** Borra lo que haya en `Código.gs` y pega todo el contenido de `backend/Code.gs`. Guarda (ícono de disquete).
4. **Crea las hojas.** En el editor, arriba, elige la función `configurar` y toca **Ejecutar**. Google pide permisos: Revisar permisos → tu cuenta → Configuración avanzada → Ir a Verde360 (no seguro) → Permitir. *(Es tu propio script; el aviso es normal.)* Vuelve a la hoja: ya existe la pestaña **Eventos**.
5. **Publícalo como app web.** En el editor: Implementar → Nueva implementación → tipo **Aplicación web**.
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
   - Implementar → copia la **URL de la aplicación web** (termina en `/exec`).
6. **Conéctalo a la página.** En `index.html`, busca `const API_URL = "";` y pega la URL entre las comillas:
   ```js
   const API_URL = "https://script.google.com/macros/s/XXXXXXXX/exec";
   ```
   Luego en PowerShell, dentro de la carpeta del proyecto:
   ```powershell
   git add .
   git commit -m "Conectar backend de eventos"
   git push
   ```

## Cómo aprobar

- Cada envío nuevo te llega por correo y queda en la hoja **Eventos** en amarillo, con Estado **Pendiente**.
- Cambia el Estado a **Aprobado** (verde) y en segundos aparece en la Agenda para todos. **Rechazado** (rojo) lo deja oculto.
- Puedes corregir el texto directamente en la hoja antes de aprobar.
- El WhatsApp de quien publica queda en la hoja para que lo contactes, pero **nunca se muestra en la página**.
- Cuando hay eventos reales aprobados, la Agenda oculta los de ejemplo. Los eventos pasados dejan de mostrarse solos.

## Protecciones incluidas

- Campo oculto contra robots que envían spam.
- Máximo 5 envíos por hora por número.
- Textos recortados a un largo máximo y sin código HTML.

## Si cambias el código del script

Implementar → Gestionar implementaciones → editar (lápiz) → Versión: **Nueva versión** → Implementar. La URL no cambia.

## Más adelante

El mismo script sirve para mascotas, alertas, talentos y avisos de arriendo: se agrega una entrada en `TIPOS` con sus columnas y la página se conecta igual.
