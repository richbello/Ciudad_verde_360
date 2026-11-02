/**
 * Verde360 · backend gratuito con Google Sheets + Apps Script
 * ------------------------------------------------------------
 * - Cualquier vecino envía un evento desde la página (POST).
 * - Queda en la hoja «Eventos» con Estado = «Pendiente».
 * - Tú cambias el Estado a «Aprobado» y aparece en la Agenda para todos (GET).
 * - Te llega un correo cada vez que alguien envía algo nuevo.
 *
 * Instalación: ver backend/LEEME.md
 */

// Tipos de publicación que acepta el backend. Para agregar mascotas, alertas
// o talentos más adelante, se añade otra entrada con sus columnas.
const TIPOS = {
  evento: {
    hoja: 'Eventos',
    // Columnas que llegan del formulario (en este orden en la hoja)
    campos: ['titulo', 'categoria', 'lugar', 'conjunto', 'fecha', 'hora', 'costo', 'descripcion', 'organizador', 'contacto'],
    // Columnas que se muestran en la página (el contacto NO se publica)
    publicos: ['id', 'titulo', 'categoria', 'lugar', 'conjunto', 'fecha', 'hora', 'costo', 'descripcion', 'organizador'],
    maximos: { titulo: 90, lugar: 90, descripcion: 400, organizador: 60, contacto: 20, hora: 30 }
  }
};

const ESTADOS = ['Pendiente', 'Aprobado', 'Rechazado'];
const AVISAR_POR_CORREO = true;

/** Ejecuta esta función UNA vez desde el editor para crear las hojas. */
function configurar() {
  const libro = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(TIPOS).forEach(function (t) { hojaDe_(libro, TIPOS[t]); });
  SpreadsheetApp.getUi().alert('Listo: hojas creadas. Ahora implementa la app web (ver LEEME).');
}

/** Recibe una publicación nueva desde la página. */
function doPost(e) {
  try {
    const datos = JSON.parse(e.postData.contents || '{}');
    if (datos.web) return json_({ ok: true });            // trampa anti-robots: campo oculto lleno
    const tipo = TIPOS[datos.tipo];
    if (!tipo) return json_({ ok: false, error: 'Tipo no válido' });

    const libro = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = hojaDe_(libro, tipo);
    const limpio = {};
    tipo.campos.forEach(function (c) {
      let v = String(datos[c] == null ? '' : datos[c]).replace(/[<>]/g, '').trim();
      const max = (tipo.maximos && tipo.maximos[c]) || 120;
      limpio[c] = v.slice(0, max);
    });
    if (!limpio.titulo || !limpio.fecha) return json_({ ok: false, error: 'Faltan título o fecha' });

    // Evita que una misma persona envíe decenas de cosas seguidas
    const cache = CacheService.getScriptCache();
    const clave = 'n_' + (limpio.contacto || 'anon');
    const n = Number(cache.get(clave) || 0);
    if (n >= 5) return json_({ ok: false, error: 'Demasiados envíos, intenta más tarde' });
    cache.put(clave, String(n + 1), 3600);

    const id = Utilities.getUuid().slice(0, 8);
    hoja.appendRow([id, new Date(), 'Pendiente'].concat(tipo.campos.map(function (c) { return limpio[c]; })));

    if (AVISAR_POR_CORREO) {
      MailApp.sendEmail(Session.getEffectiveUser().getEmail(),
        'Verde360 · Nuevo ' + datos.tipo + ' por aprobar: ' + limpio.titulo,
        'Llegó una publicación nueva a la hoja «' + tipo.hoja + '».\n\n' +
        tipo.campos.map(function (c) { return c + ': ' + limpio[c]; }).join('\n') +
        '\n\nPara publicarla, cambia su Estado a «Aprobado»:\n' + libro.getUrl());
    }
    return json_({ ok: true, id: id });
  } catch (err) {
    return json_({ ok: false, error: String(err) });
  }
}

/** Devuelve solo lo aprobado, sin datos de contacto. Ej.: ?tipo=evento */
function doGet(e) {
  const tipo = TIPOS[(e.parameter && e.parameter.tipo) || 'evento'];
  if (!tipo) return json_({ ok: false, error: 'Tipo no válido' });
  const hoja = hojaDe_(SpreadsheetApp.getActiveSpreadsheet(), tipo);
  const filas = hoja.getDataRange().getValues();
  const cab = filas.shift();
  const iEstado = cab.indexOf('Estado');
  const tz = Session.getScriptTimeZone();
  const items = filas
    .filter(function (f) { return String(f[iEstado]).trim().toLowerCase() === 'aprobado'; })
    .map(function (f) {
      const o = {};
      tipo.publicos.forEach(function (c) {
        let v = f[cab.indexOf(c)];
        if (v instanceof Date) v = Utilities.formatDate(v, tz, c === 'hora' ? 'HH:mm' : 'yyyy-MM-dd');
        o[c] = v;
      });
      return o;
    });
  return json_({ ok: true, items: items });
}

/* ---------- utilidades ---------- */
function hojaDe_(libro, tipo) {
  let hoja = libro.getSheetByName(tipo.hoja);
  if (!hoja) {
    hoja = libro.insertSheet(tipo.hoja);
    const cab = ['id', 'Recibido', 'Estado'].concat(tipo.campos);
    hoja.getRange(1, 1, 1, cab.length).setValues([cab]).setFontWeight('bold').setBackground('#0f7a4a').setFontColor('#ffffff');
    hoja.setFrozenRows(1);
    const regla = SpreadsheetApp.newDataValidation().requireValueInList(ESTADOS, true).build();
    hoja.getRange(2, 3, 1000, 1).setDataValidation(regla);
    // Colores: amarillo pendiente, verde aprobado, rojo rechazado
    const r = hoja.getRange(2, 3, 1000, 1);
    hoja.setConditionalFormatRules([
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Pendiente').setBackground('#fff3c4').setRanges([r]).build(),
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Aprobado').setBackground('#c8f5d8').setRanges([r]).build(),
      SpreadsheetApp.newConditionalFormatRule().whenTextEqualTo('Rechazado').setBackground('#fde2e2').setRanges([r]).build()
    ]);
  }
  return hoja;
}

function json_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
