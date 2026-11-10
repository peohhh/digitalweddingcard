/* =========================================================
   EDIT YOUR WEDDING DETAILS HERE
   Date format: YYYY-MM-DDTHH:MM:SS+08:00 (Malaysia time)
   ========================================================= */
const WEDDING = {
  bride: "Aisyah",
  groom: "Adam",
  date: "2026-12-20T11:00:00+08:00",
  dateLabel: "SUNDAY, 20 DECEMBER 2026",
  dateLong: "Sunday, 20 December 2026",
  time: "11:00 AM – 2:00 PM",
  venue: "Grand Ballroom",
  address: "Kota Kinabalu, Sabah",
  mapUrl: "https://maps.google.com/?q=Kota+Kinabalu+Sabah",
  rsvpDeadline: "1 DECEMBER 2026",
  // International format without + or spaces, e.g. 60123456789
  whatsappNumber: "60123456789",
  quote: "Two hearts, one promise, and a lifetime of beautiful tomorrows.",
  // Paste your deployed Google Apps Script Web App URL here to enable shared RSVP + guest list.
  // Leave as "" until the Google Sheet and Apps Script are configured.
  rsvpEndpoint: ""
};

// Add/replace image paths here. Put your own files in the images folder.
const PHOTOS = [
  { src: "images/photo-1.jpg", alt: "A favourite moment, photograph one" },
  { src: "images/photo-2.jpg", alt: "A favourite moment, photograph two" },
  { src: "images/photo-3.jpg", alt: "A favourite moment, photograph three" }
];

const $ = (id) => document.getElementById(id);
let currentPhoto = 0;
let slideshowTimer = null;
let musicPlaying = false;

function applyWeddingDetails() {
  $("brideName").textContent = WEDDING.bride;
  $("groomName").textContent = WEDDING.groom;
  $("coverDate").textContent = WEDDING.dateLabel;
  $("heroDate").textContent = WEDDING.dateLabel;
  $("detailDate").textContent = WEDDING.dateLong;
  $("detailTime").textContent = WEDDING.time;
  $("venueName").textContent = WEDDING.venue;
  $("venueAddress").textContent = WEDDING.address;
  $("heroPlace").textContent = WEDDING.address.toUpperCase();
  $("mapLink").href = WEDDING.mapUrl;
  $("rsvpDeadline").textContent = WEDDING.rsvpDeadline;
  $("loveQuote").textContent = WEDDING.quote;
  $("footerNames").textContent = `${WEDDING.bride} & ${WEDDING.groom}`.toUpperCase();
  document.title = `${WEDDING.bride} & ${WEDDING.groom} | Wedding Invitation`;
}

function openInvitation() {
  $("cover").classList.add("cover-closed");
  $("cover").style.display = "none";
  $("invitation").classList.remove("is-hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  // Browsers require music to start after a visitor's click/tap.
  playMusic();
  loadGuestList();
}
$("openInvitation").addEventListener("click", openInvitation);

function playMusic() {
  const audio = $("weddingMusic");
  if (!audio.querySelector("source").getAttribute("src")) return;
  audio.play().then(() => {
    musicPlaying = true;
    updateMusicButton();
  }).catch(() => {
    $("musicLabel").textContent = "Tap ♫ to play";
  });
}
function updateMusicButton() {
  $("musicToggle").classList.toggle("is-playing", musicPlaying);
  $("musicToggle").setAttribute("aria-label", musicPlaying ? "Pause music" : "Play music");
  $("musicLabel").textContent = musicPlaying ? "Now playing" : "Play music";
}
$("musicToggle").addEventListener("click", async () => {
  const audio = $("weddingMusic");
  if (musicPlaying) { audio.pause(); musicPlaying = false; updateMusicButton(); }
  else {
    try { await audio.play(); musicPlaying = true; updateMusicButton(); }
    catch { $("musicLabel").textContent = "Add music/wedding-song.mp3"; }
  }
});

function updateCountdown() {
  const distance = new Date(WEDDING.date).getTime() - Date.now();
  if (distance <= 0) {
    ["days", "hours", "minutes", "seconds"].forEach(id => $(id).textContent = "00");
    return;
  }
  $("days").textContent = String(Math.floor(distance / 86400000)).padStart(2, "0");
  $("hours").textContent = String(Math.floor(distance / 3600000) % 24).padStart(2, "0");
  $("minutes").textContent = String(Math.floor(distance / 60000) % 60).padStart(2, "0");
  $("seconds").textContent = String(Math.floor(distance / 1000) % 60).padStart(2, "0");
}

function showPhoto(index) {
  currentPhoto = (index + PHOTOS.length) % PHOTOS.length;
  $("lightboxImage").src = PHOTOS[currentPhoto].src;
  $("lightboxImage").alt = PHOTOS[currentPhoto].alt;
  $("lightboxCaption").textContent = `${String(currentPhoto + 1).padStart(2,"0")} / ${String(PHOTOS.length).padStart(2,"0")}`;
  $("galleryCounter").textContent = $("lightboxCaption").textContent;
}
function openLightbox(index) {
  showPhoto(index);
  $("lightbox").classList.add("open");
  $("lightbox").setAttribute("aria-hidden", "false");
}
function closeLightbox() {
  $("lightbox").classList.remove("open");
  $("lightbox").setAttribute("aria-hidden", "true");
}
document.querySelectorAll(".gallery-item").forEach(button => {
  button.addEventListener("click", () => openLightbox(Number(button.dataset.index)));
});
$("galleryPrev").addEventListener("click", () => showPhoto(currentPhoto - 1));
$("galleryNext").addEventListener("click", () => showPhoto(currentPhoto + 1));
$("lightboxPrev").addEventListener("click", () => showPhoto(currentPhoto - 1));
$("lightboxNext").addEventListener("click", () => showPhoto(currentPhoto + 1));
$("lightboxClose").addEventListener("click", closeLightbox);
$("lightbox").addEventListener("click", event => { if (event.target === $("lightbox")) closeLightbox(); });
document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight" && $("lightbox").classList.contains("open")) showPhoto(currentPhoto + 1);
  if (event.key === "ArrowLeft" && $("lightbox").classList.contains("open")) showPhoto(currentPhoto - 1);
});
$("slideshowToggle").addEventListener("click", () => {
  if (slideshowTimer) {
    clearInterval(slideshowTimer); slideshowTimer = null;
    $("slideshowToggle").textContent = "START SLIDESHOW";
  } else {
    showPhoto(currentPhoto + 1);
    slideshowTimer = setInterval(() => showPhoto(currentPhoto + 1), 3000);
    $("slideshowToggle").textContent = "STOP SLIDESHOW";
  }
});

function setFormStatus(message, isError = false) {
  $("formStatus").textContent = message;
  $("formStatus").style.color = isError ? "#ffb4a8" : "var(--gold)";
}
$("rsvpForm").addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const name = String(form.get("name") || "").trim();
  const attendance = String(form.get("attendance") || "");
  const guests = String(form.get("guests") || "1");
  const message = String(form.get("message") || "").trim();
  const showName = $("showName").checked ? "Yes, you may display my name" : "No, please keep my name private";

  if (!name) {
    setFormStatus("Please enter your name before sending your RSVP.", true);
    return;
  }
  if (!/^\d{10,15}$/.test(WEDDING.whatsappNumber)) {
    setFormStatus("The organiser's WhatsApp number has not been set correctly. Please contact the couple.", true);
    return;
  }

  const text = [
    `Assalamualaikum / Hello ${WEDDING.bride} & ${WEDDING.groom},`,
    "",
    "I would like to RSVP for your wedding celebration.",
    `Name: ${name}`,
    `Attendance: ${attendance}`,
    `Number of guests: ${attendance === "Attending" ? guests : "0"}`,
    `Guest-list preference: ${showName}`,
    message ? `Message: ${message}` : "",
    "",
    "Thank you for the invitation!"
  ].filter(Boolean).join("\n");

  const whatsappUrl = `https://wa.me/${WEDDING.whatsappNumber}?text=${encodeURIComponent(text)}`;
  window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  setFormStatus("WhatsApp is opening with your RSVP message. Please press Send in WhatsApp to complete your reply.");
});

function renderGuestList(guests) {
  const attending = guests.filter(g => g.attendance === "Attending");
  $("attendingCount").textContent = attending.reduce((sum, g) => sum + Number(g.guests || 1), 0);
  const list = $("guestList");
  list.innerHTML = "";
  if (!attending.length) {
    const li = document.createElement("li");
    li.className = "guest-empty";
    li.textContent = "No confirmed guest names to display yet.";
    list.appendChild(li);
    return;
  }
  attending.forEach(guest => {
    const li = document.createElement("li");
    li.textContent = guest.name;
    list.appendChild(li);
  });
}
function loadGuestList() {
  if (!WEDDING.rsvpEndpoint) return;
  // Apps Script JSONP endpoint allows the public guest list to be read from GitHub Pages.
  const callbackName = "weddingGuestCallback";
  window[callbackName] = data => {
    if (data && Array.isArray(data.guests)) renderGuestList(data.guests);
    delete window[callbackName];
  };
  const script = document.createElement("script");
  script.src = `${WEDDING.rsvpEndpoint}?action=list&callback=${callbackName}&_=${Date.now()}`;
  script.onerror = () => {
    $("guestList").innerHTML = '<li class="guest-empty">Guest list is temporarily unavailable.</li>';
    delete window[callbackName];
  };
  document.body.appendChild(script);
  script.onload = () => script.remove();
}

applyWeddingDetails();
updateCountdown();
setInterval(updateCountdown, 1000);
showPhoto(0);
