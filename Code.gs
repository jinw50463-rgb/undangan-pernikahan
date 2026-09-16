// =====================================================================
// WEDDING INVITATION – Google Apps Script
// Melayani halaman HTML + API ucapan ke Google Sheets
// =====================================================================

// ⚙️ Ganti dengan Spreadsheet ID milikmu
const SPREADSHEET_ID = 'GANTI_DENGAN_SPREADSHEET_ID_KAMU';
const SHEET_NAME     = 'Ucapan';

// -----------------------------------------------------------------------
// doGet: sajikan halaman HTML ATAU ambil ucapan (jika ?action=wishes)
// -----------------------------------------------------------------------
function doGet(e) {
  const action = e && e.parameter && e.parameter.action;

  if (action === 'wishes') {
    return getWishes();
  }

  // Sajikan halaman undangan
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Undangan Pernikahan – Andri Pratama & Andriani')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// -----------------------------------------------------------------------
// doPost: simpan ucapan baru dari form HTML
// -----------------------------------------------------------------------
function doPost(e) {
  try {
    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (_) {
      payload = e.parameter;
    }

    const name   = (payload.name   || '').toString().trim();
    const msg    = (payload.msg    || '').toString().trim();
    const att    = (payload.att    || '-').toString().trim();
    const guests = (payload.guests || '').toString().trim();

    if (!name || !msg) {
      return jsonResponse({ status: 'error', message: 'Nama dan pesan wajib diisi.' });
    }

    const sheet = getSheet();
    sheet.appendRow([new Date(), name, msg, att, guests]);
    return jsonResponse({ status: 'ok', message: 'Ucapan berhasil disimpan!' });

  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

// -----------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------
function getWishes() {
  try {
    const sheet = getSheet();
    const rows  = sheet.getDataRange().getValues();

    if (rows.length <= 1) {
      return jsonResponse({ status: 'ok', data: [] });
    }

    const wishes = rows.slice(1).reverse().map(row => ({
      timestamp : row[0] ? new Date(row[0]).toISOString() : '',
      name      : row[1] || '',
      msg       : row[2] || '',
      att       : row[3] || '-',
      guests    : row[4] || ''
    }));

    return jsonResponse({ status: 'ok', data: wishes });

  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

function getSheet() {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  let   sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Nama', 'Pesan', 'Kehadiran', 'Jumlah Tamu']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
  }
  return sheet;
}

function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}


// -----------------------------------------------------------------------
// Helper: buka sheet (buat otomatis jika belum ada)
// -----------------------------------------------------------------------
function getSheet() {
  const ss    = SpreadsheetApp.openById(SPREADSHEET_ID);
  let   sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Nama', 'Pesan', 'Kehadiran', 'Jumlah Tamu']);
    sheet.getRange(1, 1, 1, 5).setFontWeight('bold');
  }
  return sheet;
}

// -----------------------------------------------------------------------
// Helper: buat response JSON
// -----------------------------------------------------------------------
function jsonResponse(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

// -----------------------------------------------------------------------
// GET → ambil semua ucapan (untuk ditampilkan di halaman)
// -----------------------------------------------------------------------
function doGet(e) {
  try {
    const sheet = getSheet();
    const rows  = sheet.getDataRange().getValues();

    if (rows.length <= 1) {
      return jsonResponse({ status: 'ok', data: [] });
    }

    // Lewati baris header, balik agar terbaru di atas
    const wishes = rows.slice(1).reverse().map(row => ({
      timestamp : row[0] ? new Date(row[0]).toISOString() : '',
      name      : row[1] || '',
      msg       : row[2] || '',
      att       : row[3] || '-',
      guests    : row[4] || ''
    }));

    return jsonResponse({ status: 'ok', data: wishes });

  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}

// -----------------------------------------------------------------------
// POST → simpan ucapan baru dari form HTML
// -----------------------------------------------------------------------
function doPost(e) {
  try {
    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (_) {
      payload = e.parameter;
    }

    const name   = (payload.name   || '').toString().trim();
    const msg    = (payload.msg    || '').toString().trim();
    const att    = (payload.att    || '-').toString().trim();
    const guests = (payload.guests || '').toString().trim();

    if (!name || !msg) {
      return jsonResponse({ status: 'error', message: 'Nama dan pesan wajib diisi.' });
    }

    const sheet = getSheet();
    sheet.appendRow([new Date(), name, msg, att, guests]);

    return jsonResponse({ status: 'ok', message: 'Ucapan berhasil disimpan!' });

  } catch (err) {
    return jsonResponse({ status: 'error', message: err.toString() });
  }
}
