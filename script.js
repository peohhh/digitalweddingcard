
/* =====================================================
   SYIKIN & HAFIDZ | WEDDING INVITATION
   Edit wedding information in this configuration.
   Malaysia timezone: UTC+8
===================================================== */

const WEDDING = {
  bride: "Syikin",
  groom: "Hafidz",

  date: "2026-12-20T10:00:00+08:00",
  dateLabel: "SUNDAY, 20 DECEMBER 2026",
  dateLong: "Sunday, 20 December 2026",

  time: "10:00 AM – 8:00 PM",

  venue: "Grand Ballroom",
  address: "Lahad Datu, Sabah",
  mapUrl: "https://maps.google.com/?q=Lahad+Datu+Sabah",

  rsvpDeadline: "1 DECEMBER 2026",

  quote:
    "Two hearts, one promise, and a lifetime of beautiful tomorrows.",

  brideBio:
    "A beautiful new chapter begins with love, hope and gratitude.",

  groomBio:
    "Ready to begin a lifetime journey with the one he loves.",

  familyBride: {
    name: "Bride's Family Representative",
    phone: "60123456789"
  },

  familyGroom: {
    name: "Groom's Family Representative",
    phone: "60198765432"
  }
};


/* =====================================================
   PHOTO GALLERY
===================================================== */

const PHOTOS = [
  {
    src: "images/photo-1.jpg",
    alt: "Syikin and Hafidz - Photograph 1"
  },
  {
    src: "images/photo-2.jpg",
    alt: "Syikin and Hafidz - Photograph 2"
  },
  {
    src: "images/photo-3.jpg",
    alt: "Syikin and Hafidz - Photograph 3"
  }
];


/* =====================================================
   LOCAL STORAGE
   RSVP stays on the visitor's current browser.
===================================================== */

const STORAGE_KEY = "syikin_hafidz_wedding_rsvp_v1";

const $ = id => document.getElementById(id);

let currentPhoto = 0;
let slideshowTimer = null;
let musicPlaying = false;


/* =====================================================
   HELPER FUNCTIONS
===================================================== */

function setText(id, value) {
  const element = $(id);
  if (element) element.textContent = value;
}

function getSavedGuests() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error("Unable to read RSVP data:", error);
    return [];
  }
}

function saveGuests(guests) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guests));
    return true;
  } catch (error) {
    console.error("Unable to save RSVP:", error);
    return false;
  }
}


/* =====================================================
   APPLY WEDDING INFORMATION
===================================================== */

function applyWeddingDetails() {

  setText("brideName", WEDDING.bride);
  setText("groomName", WEDDING.groom);

  setText("coverDate", WEDDING.dateLabel);
  setText("heroDate", WEDDING.dateLabel);
  setText("detailDate", WEDDING.dateLong);

  setText("detailTime", WEDDING.time);
  setText("venueName", WEDDING.venue);
  setText("venueAddress", WEDDING.address);
  setText("heroPlace", WEDDING.address.toUpperCase());

  setText("rsvpDeadline", WEDDING.rsvpDeadline);
  setText("loveQuote", WEDDING.quote);

  setText(
    "footerNames",
    `${WEDDING.bride} & ${WEDDING.groom}`.toUpperCase()
  );

  setText("brideDescription", WEDDING.brideBio);
  setText("groomDescription", WEDDING.groomBio);

  // Family contact information
  setText("brideFamilyName", WEDDING.familyBride.name);
  setText("groomFamilyName", WEDDING.familyGroom.name);

  const bridePhone = $("brideFamilyPhone");
  const groomPhone = $("groomFamilyPhone");

  if (bridePhone) {
    bridePhone.textContent = WEDDING.familyBride.phone;
    bridePhone.href = `tel:+${WEDDING.familyBride.phone}`;
  }

  if (groomPhone) {
    groomPhone.textContent = WEDDING.familyGroom.phone;
    groomPhone.href = `tel:+${WEDDING.familyGroom.phone}`;
  }

  const map = $("mapLink");
  if (map) map.href = WEDDING.mapUrl;

  document.title =
    `${WEDDING.bride} & ${WEDDING.groom} | Wedding Invitation`;
}


/* =====================================================
   OPEN INVITATION
===================================================== */

function openInvitation() {

  $("cover")?.classList.add("cover-closed");

  if ($("cover")) {
    $("cover").style.display = "none";
  }

  $("invitation")?.classList.remove("is-hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  playMusic();
  renderGuestList();
}

$("openInvitation")?.addEventListener("click", openInvitation);


/* =====================================================
   BACKGROUND MUSIC
===================================================== */

function updateMusicButton() {

  const button = $("musicToggle");

  if (!button) return;

  button.classList.toggle("is-playing", musicPlaying);

  button.setAttribute(
    "aria-label",
    musicPlaying ? "Pause music" : "Play music"
  );

  setText(
    "musicLabel",
    musicPlaying ? "Now playing" : "Play music"
  );
}

async function playMusic() {

  const audio = $("weddingMusic");

  if (!audio) return;

  try {
    await audio.play();
    musicPlaying = true;
    updateMusicButton();
  } catch (error) {
    setText("musicLabel", "Tap ♫ to play");
  }
}

$("musicToggle")?.addEventListener("click", async () => {

  const audio = $("weddingMusic");

  if (!audio) return;

  if (musicPlaying) {

    audio.pause();
    musicPlaying = false;
    updateMusicButton();

  } else {

    await playMusic();

  }
});

$("weddingMusic")?.addEventListener("ended", () => {
  musicPlaying = false;
  updateMusicButton();
});


/* =====================================================
   WEDDING COUNTDOWN
===================================================== */

function updateCountdown() {

  const distance =
    new Date(WEDDING.date).getTime() - Date.now();

  if (distance <= 0) {

    ["days", "hours", "minutes", "seconds"].forEach(id => {
      setText(id, "00");
    });

    return;
  }

  const days = Math.floor(distance / 86400000);
  const hours = Math.floor(distance / 3600000) % 24;
  const minutes = Math.floor(distance / 60000) % 60;
  const seconds = Math.floor(distance / 1000) % 60;

  setText("days", String(days).padStart(2, "0"));
  setText("hours", String(hours).padStart(2, "0"));
  setText("minutes", String(minutes).padStart(2, "0"));
  setText("seconds", String(seconds).padStart(2, "0"));
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* =====================================================
   PHOTO GALLERY
===================================================== */

function showPhoto(index) {

  if (!PHOTOS.length) return;

  currentPhoto =
    (index + PHOTOS.length) % PHOTOS.length;

  const photo = PHOTOS[currentPhoto];

  const image = $("lightboxImage");

  if (image) {
    image.src = photo.src;
    image.alt = photo.alt;
  }

  const counter =
    `${String(currentPhoto + 1).padStart(2, "0")} / ` +
    `${String(PHOTOS.length).padStart(2, "0")}`;

  setText("lightboxCaption", counter);
  setText("galleryCounter", counter);
}

function openLightbox(index) {

  showPhoto(index);

  $("lightbox")?.classList.add("open");

  $("lightbox")?.setAttribute("aria-hidden", "false");

  document.body.style.overflow = "hidden";
}

function closeLightbox() {

  $("lightbox")?.classList.remove("open");

  $("lightbox")?.setAttribute("aria-hidden", "true");

  document.body.style.overflow = "";
}

document.querySelectorAll(".gallery-item").forEach(button => {

  button.addEventListener("click", () => {

    openLightbox(Number(button.dataset.index));

  });

});

$("galleryPrev")?.addEventListener("click", () => {
  showPhoto(currentPhoto - 1);
});

$("galleryNext")?.addEventListener("click", () => {
  showPhoto(currentPhoto + 1);
});

$("lightboxPrev")?.addEventListener("click", () => {
  showPhoto(currentPhoto - 1);
});

$("lightboxNext")?.addEventListener("click", () => {
  showPhoto(currentPhoto + 1);
});

$("lightboxClose")?.addEventListener("click", closeLightbox);

$("lightbox")?.addEventListener("click", event => {

  if (event.target === $("lightbox")) {
    closeLightbox();
  }

});

document.addEventListener("keydown", event => {

  if (event.key === "Escape") {
    closeLightbox();
  }

  if (
    event.key === "ArrowRight" &&
    $("lightbox")?.classList.contains("open")
  ) {
    showPhoto(currentPhoto + 1);
  }

  if (
    event.key === "ArrowLeft" &&
    $("lightbox")?.classList.contains("open")
  ) {
    showPhoto(currentPhoto - 1);
  }

});


/* =====================================================
   SLIDESHOW
===================================================== */

function stopSlideshow() {

  if (slideshowTimer) {
    clearInterval(slideshowTimer);
    slideshowTimer = null;
  }

  setText("slideshowToggle", "START SLIDESHOW");
}

$("slideshowToggle")?.addEventListener("click", () => {

  if (slideshowTimer) {

    stopSlideshow();

  } else {

    showPhoto(currentPhoto + 1);

    slideshowTimer = setInterval(() => {
      showPhoto(currentPhoto + 1);
    }, 3000);

    setText("slideshowToggle", "STOP SLIDESHOW");

  }

});


/* =====================================================
   RSVP FORM
   No WhatsApp. No external API.
===================================================== */

function setFormStatus(message, isError = false) {

  const status = $("formStatus");

  if (!status) return;

  status.textContent = message;

  status.style.color = isError
    ? "#ffb4a8"
    : "var(--gold)";
}

$("rsvpForm")?.addEventListener("submit", event => {

  event.preventDefault();

  const form = new FormData(event.currentTarget);

  const name = String(form.get("name") || "").trim();

  const attendance =
    String(form.get("attendance") || "");

  const message =
    String(form.get("message") || "").trim();

  if (!name) {
    setFormStatus("Please enter your name.", true);
    return;
  }

  if (!attendance) {
    setFormStatus("Please select your attendance.", true);
    return;
  }

  if (name.length > 80 || message.length > 300) {
    setFormStatus("Please check your information.", true);
    return;
  }

  const guests = getSavedGuests();

  // Prevent accidental duplicate RSVP from the same browser.
  const duplicate = guests.some(guest =>
    guest.name.toLowerCase() === name.toLowerCase()
  );

  if (duplicate) {
    setFormStatus(
      "This name has already submitted an RSVP on this browser.",
      true
    );
    return;
  }

  const newGuest = {
    id: Date.now(),
    name: name,
    attendance: attendance,
    message: message,
    submittedAt: new Date().toISOString()
  };

  guests.push(newGuest);

  if (!saveGuests(guests)) {

    setFormStatus(
      "Unable to save RSVP on this browser. Please try again.",
      true
    );

    return;
  }

  event.currentTarget.reset();

  setFormStatus(
    "Thank you! Your RSVP has been recorded. We appreciate your wishes."
  );

  renderGuestList();

});


/* =====================================================
   GUESTBOOK
===================================================== */

function renderGuestList() {

  const guests = getSavedGuests();

  const attending = guests.filter(guest =>
    guest.attendance === "Attending"
  );

  setText("attendingCount", attending.length);

  const list = $("guestList");

  if (!list) return;

  list.replaceChildren();

  if (!attending.length) {

    const empty = document.createElement("li");

    empty.className = "guest-empty";

    empty.textContent =
      "Be the first to confirm your attendance.";

    list.appendChild(empty);

    return;
  }

  attending.forEach(guest => {

    const item = document.createElement("li");

    item.className = "guest-message";

    const guestName = document.createElement("strong");

    guestName.textContent = guest.name;

    item.appendChild(guestName);

    if (guest.message) {

      const wish = document.createElement("p");

      wish.textContent = guest.message;

      item.appendChild(wish);

    }

    list.appendChild(item);

  });

}


/* =====================================================
   INITIALISE WEBSITE
===================================================== */

function initialiseWedding() {

  applyWeddingDetails();

  showPhoto(0);

  renderGuestList();

}

initialiseWedding();
