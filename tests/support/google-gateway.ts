import { DatabaseSync } from 'node:sqlite';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { createHmac } from 'node:crypto';
import type { Gateway } from '../../lib/applications/intake';

// Persistent external-service emulator. Runs the actual Apps Script entry point;
// only Google's storage, lock, Sheets API, and Mail API edges are replaced.
export function googleGateway(databasePath: string) {
  const db = new DatabaseSync(databasePath);
  db.exec(
    'CREATE TABLE IF NOT EXISTS properties (key TEXT PRIMARY KEY, value TEXT); CREATE TABLE IF NOT EXISTS rows (id INTEGER PRIMARY KEY, cells TEXT, note TEXT); CREATE TABLE IF NOT EXISTS mail (id INTEGER PRIMARY KEY, body TEXT);',
  );
  const get = (key: string) =>
    (
      db.prepare('SELECT value FROM properties WHERE key=?').get(key) as
        | { value: string }
        | undefined
    )?.value ?? null;
  const set = (key: string, value: string) => {
    db.prepare('INSERT OR REPLACE INTO properties VALUES (?,?)').run(
      key,
      value,
    );
  };
  set('SHARED_SECRET', 'test-secret-only-not-a-real-credential-1234');
  set('SPREADSHEET_ID', 'test-sheet');
  set('SHEET_ID', '123');
  set('NOTIFICATION_TO', 'test@example.invalid');
  const fault = {
    appendAfterWrite: false,
    appendBeforeWrite: false,
    lostResponse: false,
    mail: false,
    quota: 100,
    schema: false,
  };
  const headers = [
    'Timestamp',
    'What is your name/stage name/business name?',
    'How can we contact you? (Instagram preferred)',
    'I would like to be considered for',
    'How did you hear about Thirst Trap?',
    'What are you looking to do?',
    'How long have you been Djing?',
    'What type of music, if any, do you specialize in?',
    'Where can we find examples of your work?',
    'What is your typical rate?',
    'How long have you been doing drag/performing?',
    'What sort of performances do you typically do?',
    'Where can we find examples of your work? 2',
    'What is your typical rate? 2',
    'What type of products do you make/sell?',
    'What experience have you had vending at events/markets in the past?',
    'Where can we find examples of your work? 3',
    'What experience do you have working at events in the past?',
    'What roles are you interested in?',
  ];
  const allRows = () =>
    db.prepare('SELECT * FROM rows ORDER BY id').all() as unknown as {
      id: number;
      cells: string;
      note: string;
    }[];
  const sheet = {
    getSheetId: () => 123,
    getLastRow: () => allRows().length + 1,
    getRange: (row: number) => ({
      getValues: () => [fault.schema ? ['Incorrect schema'] : headers],
      getNotes: () => [[''], ...allRows().map((r) => [r.note])],
      setNote: (note: string) => {
        db.prepare('UPDATE rows SET note=? WHERE id=?').run(note, row - 1);
      },
    }),
  };
  const context = vm.createContext({
    Date,
    JSON,
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty: get,
        setProperty: set,
        deleteProperty: (key: string) =>
          db.prepare('DELETE FROM properties WHERE key=?').run(key),
      }),
    },
    Utilities: {
      computeHmacSha256Signature: (payload: string, secret: string) =>
        Array.from(createHmac('sha256', secret).update(payload).digest()),
    },
    LockService: {
      getScriptLock: () => ({ tryLock: () => true, releaseLock: () => {} }),
    },
    SpreadsheetApp: {
      openById: () => ({ getSheets: () => [sheet] }),
      flush: () => {},
    },
    Sheets: {
      Spreadsheets: {
        batchUpdate: (request: {
          requests: {
            appendCells: {
              rows: {
                values: {
                  userEnteredValue: { stringValue: string };
                  note?: string;
                }[];
              }[];
            };
          }[];
        }) => {
          if (fault.appendBeforeWrite)
            throw new Error('Unknown remote outcome');
          const cells = request.requests[0].appendCells.rows[0].values;
          db.prepare('INSERT INTO rows(cells,note) VALUES (?,?)').run(
            JSON.stringify(cells.map((c) => c.userEnteredValue.stringValue)),
            cells[0].note!,
          );
          if (fault.appendAfterWrite)
            throw new Error('Response lost after remote commit');
        },
      },
    },
    MailApp: {
      getRemainingDailyQuota: () => fault.quota,
      sendEmail: (message: unknown) => {
        if (fault.mail) throw new Error('Unknown mail outcome');
        db.prepare('INSERT INTO mail(body) VALUES (?)').run(
          JSON.stringify(message),
        );
      },
    },
    ContentService: {
      MimeType: { JSON: 'json' },
      createTextOutput: (body: string) => ({ setMimeType: () => body }),
    },
  });
  vm.runInContext(
    readFileSync(
      new URL('../../integrations/google-apps-script/Code.gs', import.meta.url),
      'utf8',
    ),
    context,
  );
  function call(request: Record<string, unknown>) {
    // SQLite's write lock serializes gateway invocations against this durable file.
    db.exec('BEGIN IMMEDIATE');
    try {
      const payload = JSON.stringify({ ...request, sentAt: Date.now() });
      context.event = {
        postData: {
          contents: JSON.stringify({
            payload,
            signature: createHmac('sha256', get('SHARED_SECRET')!)
              .update(payload)
              .digest('hex'),
          }),
        },
      };
      const result = JSON.parse(vm.runInContext('doPost(event)', context));
      db.exec('COMMIT');
      if (fault.lostResponse) {
        fault.lostResponse = false;
        throw new Error('HTTP response lost');
      }
      return result;
    } catch (error) {
      if (db.isTransaction) db.exec('ROLLBACK');
      throw error;
    }
  }
  const gateway: Gateway = {
    save: async (application) => call({ action: 'save', ...application }),
    notify: async (id) => call({ action: 'notify', id }),
  };
  return {
    gateway,
    fault,
    rows: () => allRows().map((r) => JSON.parse(r.cells)),
    mail: () =>
      db
        .prepare('SELECT body FROM mail')
        .all()
        .map((r) => JSON.parse(String(r.body))),
    notifications: () => call({ action: 'notifications' }),
    close: () => db.close(),
  };
}
