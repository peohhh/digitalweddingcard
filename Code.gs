/*
 * GOOGLE APPS SCRIPT BACKEND FOR WEDDING RSVP + PUBLIC ATTENDANCE LIST
 *
 * 1. Create a Google Sheet.
 * 2. Copy its ID from the URL and paste it into SPREADSHEET_ID below.
 * 3. In Extensions > Apps Script, paste this whole file.
 * 4. Deploy > New deployment > Web app.
 *    Execute as: Me
 *    Who has access: Anyone
 * 5. Copy the Web app URL ending in /exec into WEDDING.rsvpEndpoint in script.js.
 *
 * Only names where the guest checked the public-list consent box are returned publicly.
 */
const SPREADSHEET_ID = "PASTE_YOUR_GOOGLE_SHEET_ID_HERE";
const SHEET_NAME = "RSVP";

function getSheet_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(["Timestamp", "Name", "Attendance", "Guests", "Message", "Show name publicly"]);
  }
  return sheet;
}

function doPost(e) {
  try {
    const data = e.parameter || {};
    const name = String(data.name || "").trim().slice(0, 80);
    const attendance = String(data.attendance || "");
    const guests = Math.min(5, Math.max(1, Number(data.guests) || 1));
    const message = String(data.message || "").trim().slice(0, 300);
    const showName = data.showName === "yes" ? "yes" : "no";

    if (!name || !["Attending", "Not attending"].includes(attendance)) {
      return ContentService.createTextOutput("Invalid RSVP");
    }
    getSheet_().appendRow([new Date(), name, attendance, guests, message, showName]);
    return ContentService.createTextOutput("OK");
  } catch (err) {
    return ContentService.createTextOutput("ERROR: " + err.message);
  }
}

function doGet(e) {
  const callback = String((e.parameter && e.parameter.callback) || "");
  const sheet = getSheet_();
  const rows = sheet.getDataRange().getValues();
  const guests = rows.slice(1)
    .filter(row => row[1] && row[2] === "Attending" && row[5] === "yes")
    .map(row => ({
      name: String(row[1]),
      attendance: String(row[2]),
      guests: Number(row[3]) || 1
    }));

  const payload = JSON.stringify({ guests: guests });
  if (callback && /^[A-Za-z_$][0-9A-Za-z_$]*$/.test(callback)) {
    return ContentService.createTextOutput(callback + "(" + payload + ");")
      .setMimeType(ContentService.MimeType.JAVASCRIPT);
  }
  return ContentService.createTextOutput(payload).setMimeType(ContentService.MimeType.JSON);
}
