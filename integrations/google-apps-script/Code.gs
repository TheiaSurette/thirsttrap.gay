/** Signed server-to-server gateway. Deploy exactly one instance per response sheet. */
const HEADERS = [
  'Timestamp', 'What is your name/stage name/business name?', 'How can we contact you? (Instagram preferred)',
  'I would like to be considered for', 'How did you hear about Thirst Trap?', 'What are you looking to do?',
  'How long have you been Djing?', 'What type of music, if any, do you specialize in?',
  'Where can we find examples of your work?', 'What is your typical rate?',
  'How long have you been doing drag/performing?', 'What sort of performances do you typically do?',
  'Where can we find examples of your work? 2', 'What is your typical rate? 2',
  'What type of products do you make/sell?', 'What experience have you had vending at events/markets in the past?',
  'Where can we find examples of your work? 3', 'What experience do you have working at events in the past?',
  'What roles are you interested in?',
];

function doPost(event) {
  try {
    const envelope = JSON.parse(event.postData.contents);
    const properties = PropertiesService.getScriptProperties();
    const secret = properties.getProperty('SHARED_SECRET');
    if (!secret || secret.length < 32 || typeof envelope.payload !== 'string' || envelope.payload.length > 40000) return output({ status: 'unauthorized' });
    const signature = Utilities.computeHmacSha256Signature(envelope.payload, secret)
      .map(b => ('0' + ((b + 256) % 256).toString(16)).slice(-2)).join('');
    if (!equalSignature(signature, envelope.signature)) return output({ status: 'unauthorized' });
    const request = JSON.parse(envelope.payload);
    if (Math.abs(Date.now() - request.sentAt) > 300000 || !Number.isFinite(request.sentAt)) return output({ status: 'unauthorized' });
    const spreadsheetId = properties.getProperty('SPREADSHEET_ID');
    const sheetId = Number(properties.getProperty('SHEET_ID'));
    if (!spreadsheetId || !properties.getProperty('SHEET_ID') || !Number.isInteger(sheetId)) return output({ status: 'unavailable' });
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) return output({ status: 'unavailable' });
    try {
      const sheet = SpreadsheetApp.openById(spreadsheetId).getSheets().find(s => s.getSheetId() === sheetId);
      if (!sheet) return output({ status: 'unavailable' });
      const headers = sheet.getRange(1, 1, 1, 19).getValues()[0].map(v => String(v).trim());
      if (headers.length !== HEADERS.length || headers.some((h, i) => h !== HEADERS[i])) return output({ status: 'schema_mismatch' });
      const notes = sheet.getRange(1, 1, Math.max(1, sheet.getLastRow()), 1).getNotes();
      const records = notes.map((row, index) => {
        try { const value = JSON.parse(row[0]); return value.v === 1 && value.id ? { ...value, row: index + 1 } : null; }
        catch (_) { return null; }
      }).filter(Boolean);
      if (request.action === 'health') return output({ status: 'ok', spreadsheetId, sheetId, notificationTo: properties.getProperty('NOTIFICATION_TO') });
      if (request.action === 'notifications') return output({ status: 'ok', records: records.filter(r => r.notification !== 'sent').map(r => ({ id: r.id, status: r.notification })) });
      if (!/^[a-f0-9-]{36}$/i.test(request.id || '')) return output({ status: 'invalid' });
      const existing = records.find(r => r.id === request.id);
      if (request.action === 'status') return output({ status: existing ? 'saved' : 'not_found', matchingRows: records.filter(r => r.id === request.id).length, notification: existing ? existing.notification : null });
      if (request.action === 'notify') return output(notify(sheet, existing, spreadsheetId, properties));
      if (request.action !== 'save') return output({ status: 'invalid' });
      if (!Array.isArray(request.row) || request.row.length !== 19 || request.row.some(v => typeof v !== 'string' || v.length > 5000) || !/^[a-f0-9]{64}$/.test(request.fingerprint || '')) return output({ status: 'invalid' });
      if (existing) {
        if (existing.fingerprint !== request.fingerprint) return output({ status: 'conflict' });
        properties.deleteProperty('pending:' + request.id);
        return output({ status: 'saved' });
      }
      // This marker is written BEFORE issuing the remote mutation. A missing note
      // after an uncertain result is not proof that retrying an append is safe.
      const marker = 'pending:' + request.id;
      if (properties.getProperty(marker)) return output({ status: 'uncertain' });
      if (!allowSubmission(properties, request.rateKey)) return output({ status: 'limited' });
      const note = { v: 1, id: request.id, fingerprint: request.fingerprint, notification: 'pending' };
      properties.setProperty(marker, request.fingerprint);
      try {
        Sheets.Spreadsheets.batchUpdate({ requests: [{ appendCells: {
          sheetId,
          rows: [{ values: request.row.map((value, i) => ({ userEnteredValue: { stringValue: value }, ...(i === 0 ? { note: JSON.stringify(note) } : {}) })) }],
          fields: 'userEnteredValue,note',
        } }] }, spreadsheetId);
        // Row and identity note are one atomic Sheets mutation. A retry finds the
        // note even if the gateway response or this cleanup never arrives.
        properties.deleteProperty(marker);
        return output({ status: 'saved' });
      } catch (_) {
        return output({ status: 'uncertain' });
      }
    } finally { lock.releaseLock(); }
  } catch (_) { return output({ status: 'unavailable' }); }
}

function notify(sheet, record, spreadsheetId, properties) {
  if (!record) return { status: 'not_found' };
  if (record.notification === 'sent') return { status: 'sent' };
  if (record.notification === 'sending' || record.notification === 'uncertain') return { status: 'uncertain' };
  const recipient = properties.getProperty('NOTIFICATION_TO');
  if (!recipient || MailApp.getRemainingDailyQuota() < 1) {
    record.notification = 'failed'; writeNote(sheet, record); return { status: 'failed' };
  }
  record.notification = 'sending'; writeNote(sheet, record);
  // Never resend after an ambiguous mail-provider result. An administrator must
  // investigate it; a sheet-delivery retry must not become a duplicate email.
  try {
    MailApp.sendEmail({ to: recipient, subject: 'New Thirst Trap application',
      body: 'A new application of interest is ready to review.\n\nhttps://docs.google.com/spreadsheets/d/' + spreadsheetId + '/edit#gid=' + sheet.getSheetId(),
      name: 'Thirst Trap',
    });
    record.notification = 'sent'; writeNote(sheet, record);
    return { status: 'sent' };
  } catch (_) {
    record.notification = 'uncertain'; writeNote(sheet, record);
    return { status: 'uncertain' };
  }
}

function writeNote(sheet, record) {
  const { row, ...note } = record;
  sheet.getRange(row, 1).setNote(JSON.stringify(note));
  SpreadsheetApp.flush();
}

function allowSubmission(properties, rateKey) {
  if (typeof rateKey !== 'string' || !rateKey || rateKey.length > 100) return false;
  rateKey = rateKey.slice(0, 20); // Keep the hourly property below Apps Script's per-value size limit.
  const hour = Math.floor(Date.now() / 3600000);
  let limits = JSON.parse(properties.getProperty('rate') || '{}');
  if (limits.hour !== hour) limits = { hour, total: 0, clients: {} };
  if (limits.total >= 300 || (limits.clients[rateKey] || 0) >= 20) return false;
  limits.total++;
  limits.clients[rateKey] = (limits.clients[rateKey] || 0) + 1;
  properties.setProperty('rate', JSON.stringify(limits));
  return true;
}
function equalSignature(a, b) {
  if (typeof b !== 'string' || a.length !== b.length) return false;
  let different = 0;
  for (let i = 0; i < a.length; i++) different |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return different === 0;
}
function output(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
