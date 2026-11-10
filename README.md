# Digital Wedding Card — Navy Blue & Champagne

## Files
- `index.html` — page structure
- `style.css` — design and responsive layout
- `script.js` — wedding details, countdown, gallery, music and RSVP connection
- `Code.gs` — optional Google Apps Script backend for shared RSVP records and public guest list
- `images/` — add your own photos
- `music/` — add your own MP3 file

## 1. Personalise the invitation
Open `script.js` and edit the `WEDDING` object near the top:
- bride, groom
- date (Malaysia timezone: `+08:00`)
- date labels, time
- venue, address, map URL
- RSVP deadline and quote

## 2. Add photos
Place three photos in `images/` and name them exactly:
- `photo-1.jpg`
- `photo-2.jpg`
- `photo-3.jpg`

Or change the paths in the `PHOTOS` array in `script.js`. Use photos you have permission to publish.

## 3. Add music
Place an MP3 you have permission to use at `music/wedding-song.mp3`.
Visitors must tap the invitation or music button before audio can play; browsers block autoplay with sound.

## 4. Configure WhatsApp RSVP
1. In `script.js`, set `whatsappNumber` to the organiser's WhatsApp number in international digits only (Malaysia example: `60123456789`, no `+`, spaces, or dashes).
2. Guests complete the RSVP form and are redirected to WhatsApp with a prepared message.
3. They must press **Send** in WhatsApp to submit the RSVP.

WhatsApp messages do not automatically populate a public guest list or Google Sheet. If you want a live attendance list, configure the optional Google Sheets integration below.

## 5. Optional: Enable shared RSVP records + public attendance list
GitHub Pages is static and cannot save form submissions by itself. Use the included `Code.gs` Google Apps Script:
1. Create a Google Sheet.
2. Copy the spreadsheet ID from its URL (the part between `/d/` and `/edit`).
3. Open Extensions > Apps Script and paste `Code.gs`.
4. Replace `PASTE_YOUR_GOOGLE_SHEET_ID_HERE` with your Sheet ID.
5. Deploy > New deployment > Web app.
6. Execute as: Me. Who has access: Anyone.
7. Deploy and copy the Web app URL ending `/exec`.
8. Paste it into `rsvpEndpoint` in `script.js`.
9. Commit and push the updated files to GitHub.

The form sends RSVP records to the Sheet. The public guest list displays only attendees who opted in to show their name. The attendance count totals the guest numbers of those public-list attendees. The form uses a no-cors browser request, so it cannot verify the Sheet response in the page; check the Sheet to confirm submissions.

**Privacy:** Do not collect sensitive information. Tell guests their names may be shown publicly and let them opt out. The RSVP spreadsheet is controlled by the wedding organiser; keep its sharing settings restricted.

## 6. Publish on GitHub Pages
The repository root must contain `index.html`, `style.css`, and `script.js`.
In GitHub: Settings > Pages > Deploy from a branch > `main` > `/(root)`.
