/* ==========================================
   SYIKIN & HAFIDZ
   MAIN JAVASCRIPT
========================================== */

/* PASTE YOUR GOOGLE APPS SCRIPT WEB APP URL HERE */
const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyyRe2kJVvOw1cC9Oc_GNPeIUFEn-P0dVqdeUZkzKWvOEcvuTN_m4tHxFQNP_0_ISFo/exec";


/* ==========================================
   OPEN INVITATION
========================================== */

const cover = document.getElementById("cover");
const invitation = document.getElementById("invitation");
const openInvitation = document.getElementById("openInvitation");

openInvitation.addEventListener("click", () => {
  cover.classList.add("is-hidden");
  invitation.classList.remove("is-hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  loadGuestbook();
});


/* ==========================================
   COUNTDOWN
========================================== */

const weddingDate = new Date("2026-12-20T11:00:00+08:00").getTime();

function updateCountdown() {
  const now = Date.now();
  const distance = weddingDate - now;

  if (distance <= 0) {
    document.getElementById("countdown").innerHTML =
      "<p>Today is the special day!</p>";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor(
    (distance % (1000 * 60 * 60)) / (1000 * 60)
  );
  const seconds = Math.floor(
    (distance % (1000 * 60)) / 1000
  );

  document.getElementById("days").textContent =
    String(days).padStart(2, "0");

  document.getElementById("hours").textContent =
    String(hours).padStart(2, "0");

  document.getElementById("minutes").textContent =
    String(minutes).padStart(2, "0");

  document.getElementById("seconds").textContent =
    String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);


/* ==========================================
   BACKGROUND MUSIC
========================================== */

const weddingMusic = document.getElementById("weddingMusic");
const musicButton = document.getElementById("musicButton");
const musicLabel = document.getElementById("musicLabel");

let musicPlaying = false;

musicButton.addEventListener("click", async () => {
  if (!musicPlaying) {
    try {
      await weddingMusic.play();
      musicPlaying = true;
      musicLabel.textContent = "PAUSE MUSIC";
    } catch (error) {
      musicLabel.textContent = "MUSIC UNAVAILABLE";
    }
  } else {
    weddingMusic.pause();
    musicPlaying = false;
    musicLabel.textContent = "PLAY MUSIC";
  }
});


/* ==========================================
   RSVP MODAL
========================================== */

const rsvpModal = document.getElementById("rsvpModal");
const openRsvp = document.getElementById("openRsvp");
const closeRsvp = document.getElementById("closeRsvp");
const finishRsvp = document.getElementById("finishRsvp");

function showRsvpModal() {
  rsvpModal.classList.add("active");
  rsvpModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function hideRsvpModal() {
  rsvpModal.classList.remove("active");
  rsvpModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

openRsvp.addEventListener("click", showRsvpModal);
closeRsvp.addEventListener("click", hideRsvpModal);
finishRsvp.addEventListener("click", hideRsvpModal);

rsvpModal.addEventListener("click", (event) => {
  if (event.target === rsvpModal) {
    hideRsvpModal();
  }
});


/* ==========================================
   JSONP CONNECTION
   FOR GOOGLE APPS SCRIPT
========================================== */

function callGoogleScript(parameters) {
  return new Promise((resolve, reject) => {

    if (
      !SCRIPT_URL ||
      SCRIPT_URL === "PASTE_YOUR_WEB_APP_URL_HERE"
    ) {
      reject(new Error("Google Apps Script URL has not been added."));
      return;
    }

    const callbackName =
      "rsvpCallback_" +
      Date.now() +
      "_" +
      Math.random().toString(36).slice(2);

    const script = document.createElement("script");
    const query = new URLSearchParams({
      ...parameters,
      callback: callbackName
    });

    const timeout = setTimeout(() => {
      cleanup();
      reject(new Error("The server took too long to respond."));
    }, 15000);

    function cleanup() {
      clearTimeout(timeout);
      delete window[callbackName];
      script.remove();
    }

    window[callbackName] = (response) => {
      cleanup();
      resolve(response);
    };

    script.onerror = () => {
      cleanup();
      reject(new Error("Unable to connect to the RSVP server."));
    };

    script.src = `${SCRIPT_URL}?${query.toString()}`;
    document.body.appendChild(script);
  });
}


/* ==========================================
   RSVP SUBMISSION
========================================== */

const rsvpForm = document.getElementById("rsvpForm");
const submitRsvp = document.getElementById("submitRsvp");
const formStatus = document.getElementById("formStatus");
const rsvpSuccess = document.getElementById("rsvpSuccess");

const guestName = document.getElementById("guestName");
const attendance = document.getElementById("attendance");
const guestCount = document.getElementById("guestCount");
const guestMessage = document.getElementById("guestMessage");
const showName = document.getElementById("showName");

rsvpForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const name = guestName.value.trim();
  const response = attendance.value;
  const numberOfGuests = Number(guestCount.value);
  const message = guestMessage.value.trim();

  if (!name || !response) {
    formStatus.textContent = "Please complete the required fields.";
    return;
  }

  if (response === "Not Attending" && numberOfGuests !== 1) {
    formStatus.textContent = "Please select 1 guest if you cannot attend.";
    return;
  }

  submitRsvp.disabled = true;
  submitRsvp.textContent = "SUBMITTING...";
  formStatus.textContent = "Sending your response...";

  try {
    const result = await callGoogleScript({
      action: "submit",
      name: name,
      attendance: response,
      guests: String(numberOfGuests),
      message: message,
      showName: showName.checked ? "yes" : "no"
    });

    if (!result.success) {
      throw new Error(result.message || "Submission failed.");
    }

    rsvpForm.classList.add("is-hidden");
    rsvpSuccess.classList.remove("is-hidden");

    loadGuestbook();

  } catch (error) {
    formStatus.textContent =
      error.message || "Something went wrong. Please try again.";

    submitRsvp.disabled = false;
    submitRsvp.textContent = "SUBMIT RSVP";
    return;
  }

  submitRsvp.disabled = false;
  submitRsvp.textContent = "SUBMIT RSVP";
});


/* ==========================================
   LOAD PUBLIC GUESTBOOK
========================================== */

const liveGuestbook = document.getElementById("liveGuestbook");
const attendingCount = document.getElementById("attendingCount");

function createGuestCard(guest) {
  const card = document.createElement("article");
  card.className = "guest-message-card";

  const name = document.createElement("h3");
  name.textContent = guest.name || "A Lovely Guest";

  const message = document.createElement("p");
  message.textContent = guest.message || "Congratulations to the lovely couple!";

  const status = document.createElement("small");
  status.textContent = "JOYFULLY CELEBRATING WITH YOU";

  card.append(name, message, status);
  return card;
}

async function loadGuestbook() {
  if (!liveGuestbook) return;

  liveGuestbook.innerHTML =
    '<p class="loading-message">Loading lovely wishes...</p>';

  try {
    const result = await callGoogleScript({
      action: "list"
    });

    if (!result.success) {
      throw new Error("Unable to load guestbook.");
    }

    attendingCount.textContent =
      Number(result.totalGuests || 0).toLocaleString();

    liveGuestbook.innerHTML = "";

    if (!result.guests || result.guests.length === 0) {
      liveGuestbook.innerHTML =
        '<p class="empty-message">Be the first to leave a lovely wish!</p>';
      return;
    }

    result.guests.forEach((guest) => {
      liveGuestbook.appendChild(createGuestCard(guest));
    });

  } catch (error) {
    liveGuestbook.innerHTML =
      '<p class="empty-message">Guestbook is temporarily unavailable. Please try again later.</p>';
  }
}


/* ==========================================
   RESET RSVP FORM AFTER SUCCESS
========================================== */

finishRsvp.addEventListener("click", () => {
  hideRsvpModal();

  rsvpForm.reset();
  rsvpForm.classList.remove("is-hidden");
  rsvpSuccess.classList.add("is-hidden");

  formStatus.textContent = "";
});


/* ==========================================
   GALLERY LIGHTBOX
========================================== */

const galleryButtons = document.querySelectorAll(".gallery-image");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const closeLightbox = document.getElementById("closeLightbox");

galleryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.dataset.image;

    lightboxImage.src = image;
    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
  });
});

function hideLightbox() {
  lightbox.classList.remove("active");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
}

closeLightbox.addEventListener("click", hideLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    hideLightbox();
  }
});


/* ==========================================
   KEYBOARD ACCESSIBILITY
========================================== */

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    hideLightbox();

    if (rsvpModal.classList.contains("active")) {
      hideRsvpModal();
    }
  }
   
/* ==========================================
   COVER FIX - SYIKIN & HAFIDZ
========================================== */

.cover {
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 50px 20px;
  overflow: hidden;
  background:
    radial-gradient(
      ellipse at center,
      #55594C 0%,
      #45483D 60%,
      #34382F 100%
    );
}

/* FRAME */
.cover-frame {
  position: absolute;
  top: 45px;
  bottom: 45px;
  left: 50%;
  transform: translateX(-50%);
  width: min(90%, 680px);
  min-height: 0;
  height: auto;
  padding: 0;
  border: 1px solid var(--gold);
  outline: 1px solid rgba(185,157,101,.3);
  outline-offset: 9px;
  pointer-events: none;
  z-index: 1;
}

.cover-frame::before,
.cover-frame::after {
  content: "✦";
  position: absolute;
  color: var(--gold);
  font-size: 18px;
}

.cover-frame::before {
  top: 20px;
  left: 20px;
}

.cover-frame::after {
  bottom: 20px;
  right: 20px;
}

/* COVER CONTENT */
.cover-content {
  position: relative;
  z-index: 2;
  width: min(100%, 580px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 60px 20px;
}

/* SMALL HEADING */
.cover-content .eyebrow {
  font-family: var(--serif);
  font-size: 12px;
  letter-spacing: 5px;
  color: var(--gold);
  margin-bottom: 35px;
}

/* INITIALS */
.wax-seal {
  width: 65px;
  height: 65px;
  border: 1px solid var(--gold);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--serif);
  font-size: 22px;
  color: var(--champagne);
  margin-bottom: 30px;
}

.wax-seal span {
  color: var(--gold);
  font-style: italic;
  margin: 0 3px;
}

/* COUPLE NAMES */
.cover-names {
  font-family: var(--serif);
  font-size: clamp(65px, 9vw, 100px);
  font-weight: 400;
  line-height: .85;
  color: var(--champagne);
  margin: 0 0 30px;
  text-align: center;
}

.cover-names span {
  display: block;
  font-size: .48em;
  font-style: italic;
  color: var(--gold);
  margin: 15px 0;
}

/* WEDDING DATE */
.cover-date {
  font-family: var(--sans);
  font-size: 11px;
  letter-spacing: 5px;
  color: var(--champagne);
  margin-bottom: 30px;
}

/* OPEN INVITATION BUTTON */
.primary-button {
  min-height: 48px;
  padding: 0 30px;
  border: 1px solid var(--gold);
  background: transparent;
  color: var(--champagne);
  font-family: var(--sans);
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 3px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  transition: all .35s ease;
}

.primary-button:hover {
  background: var(--champagne);
  color: var(--olive-dark);
}

/* OPEN BUTTON */
.open-button {
  margin-top: 5px;
}

/* COVER DESCRIPTION */
.cover-hint {
  font-family: var(--serif);
  font-size: 17px;
  font-style: italic;
  color: var(--muted);
  letter-spacing: 1px;
  margin-top: 25px;
}

/* MUSIC CONTROL */
.music-control {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 10px;
}

.music-button {
  position: static;
  width: 45px;
  height: 45px;
  padding: 0;
  border: 1px solid var(--gold);
  background: rgba(52,56,47,.8);
  color: var(--champagne);
  font-size: 16px;
}

#musicLabel {
  font-size: 10px;
  letter-spacing: 2px;
  color: var(--champagne);
}

/* MOBILE RESPONSIVE */
@media (max-width: 600px) {
  .cover {
    padding: 30px 15px;
  }

  .cover-frame {
    top: 30px;
    bottom: 30px;
    width: 85%;
  }

  .cover-content {
    padding: 50px 10px;
  }

  .cover-content .eyebrow {
    font-size: 9px;
    letter-spacing: 3px;
  }

  .cover-names {
    font-size: clamp(58px, 15vw, 78px);
  }

  .cover-date {
    font-size: 9px;
    letter-spacing: 3px;
  }

  .cover-hint {
    font-size: 14px;
  }

  .music-control {
    top: 12px;
    right: 12px;
  }

  #musicLabel {
    display: none;
  }
}

});
