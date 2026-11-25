/* =================================
   ELEMENTS
================================= */

const openButton = document.getElementById("openInvitation");
const cover = document.getElementById("cover");
const invitation = document.getElementById("invitation");

const weddingMusic = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");


/* =================================
   OPEN INVITATION + MUSIC
================================= */

openButton.addEventListener("click", async () => {

  cover.classList.add("is-hidden");
  invitation.classList.remove("is-hidden");

  window.scrollTo({
    top: 0,
    behavior: "instant"
  });

  try {
    await weddingMusic.play();

    musicToggle.textContent = "♫";
    musicLabel.textContent = "Pause music";
    musicToggle.setAttribute("aria-label", "Pause music");

  } catch (error) {
    console.error("Music error:", error);
    musicLabel.textContent = "Play music";
  }

});


/* =================================
   PLAY / PAUSE MUSIC
================================= */

musicToggle.addEventListener("click", async () => {

  if (weddingMusic.paused) {

    try {
      await weddingMusic.play();

      musicToggle.textContent = "♫";
      musicLabel.textContent = "Pause music";
      musicToggle.setAttribute("aria-label", "Pause music");

    } catch (error) {
      console.error("Music error:", error);
    }

  } else {

    weddingMusic.pause();

    musicToggle.textContent = "♪";
    musicLabel.textContent = "Play music";
    musicToggle.setAttribute("aria-label", "Play music");

  }

});


/* =================================
   COUNTDOWN
================================= */

const weddingDate = new Date("December 20, 2026 11:00:00+08:00").getTime();

function updateCountdown() {

  const now = new Date().getTime();
  const distance = weddingDate - now;

  if (distance <= 0) {
    ["days", "hours", "minutes", "seconds"].forEach(id => {
      document.getElementById(id).textContent = "00";
    });
    return;
  }

  document.getElementById("days").textContent =
    Math.floor(distance / (1000 * 60 * 60 * 24));

  document.getElementById("hours").textContent =
    Math.floor((distance / (1000 * 60 * 60)) % 24);

  document.getElementById("minutes").textContent =
    Math.floor((distance / (1000 * 60)) % 60);

  document.getElementById("seconds").textContent =
    Math.floor((distance / 1000) % 60);

}

updateCountdown();
setInterval(updateCountdown, 1000);


/* =================================
   RSVP MODAL
================================= */

const rsvpModal = document.getElementById("rsvpModal");
const openRsvp = document.getElementById("openRsvp");
const closeRsvp = document.getElementById("closeRsvp");
const finishRsvp = document.getElementById("finishRsvp");

function showRsvp() {
  rsvpModal.classList.add("open");
  rsvpModal.setAttribute("aria-hidden", "false");
}

function hideRsvp() {
  rsvpModal.classList.remove("open");
  rsvpModal.setAttribute("aria-hidden", "true");
}

openRsvp.addEventListener("click", showRsvp);
closeRsvp.addEventListener("click", hideRsvp);
finishRsvp.addEventListener("click", hideRsvp);

rsvpModal.addEventListener("click", event => {
  if (event.target === rsvpModal) {
    hideRsvp();
  }
});

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    hideRsvp();
  }
});


/* =================================
   RSVP FORM
================================= */

const rsvpForm = document.getElementById("rsvpForm");
const attendance = document.getElementById("attendance");
const guestCountField = document.getElementById("guestCountField");
const rsvpSuccess = document.getElementById("rsvpSuccess");
const formStatus = document.getElementById("formStatus");

attendance.addEventListener("change", () => {

  guestCountField.style.display =
    attendance.value === "Attending" ? "block" : "none";

});

rsvpForm.addEventListener("submit", event => {

  event.preventDefault();

  const guestName = document.getElementById("guestName").value.trim();
  const attendanceValue = attendance.value;

  if (!guestName) {
    formStatus.textContent = "Please enter your name.";
    return;
  }

  formStatus.textContent = "Thank you for your response.";

  rsvpForm.hidden = true;
  rsvpSuccess.hidden = false;

});


/* =================================
   GALLERY
================================= */

const galleryImages = [
  "images/photo-1.jpg",
  "images/photo-2.jpg",
  "images/photo-3.jpg"
];

let currentImage = 0;
let slideshowTimer = null;

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");

const galleryCounter = document.getElementById("galleryCounter");

function updateGallery() {

  lightboxImage.src = galleryImages[currentImage];

  const number = String(currentImage + 1).padStart(2, "0");
  const total = String(galleryImages.length).padStart(2, "0");

  galleryCounter.textContent = `${number} / ${total}`;
  lightboxCaption.textContent = `${number} / ${total}`;

}

function showImage(index) {

  currentImage = (index + galleryImages.length) % galleryImages.length;
  updateGallery();

}

document.querySelectorAll(".gallery-item").forEach(button => {

  button.addEventListener("click", () => {

    showImage(Number(button.dataset.index));

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");

  });

});

document.getElementById("galleryPrev").addEventListener("click", () => {
  showImage(currentImage - 1);
});

document.getElementById("galleryNext").addEventListener("click", () => {
  showImage(currentImage + 1);
});

document.getElementById("lightboxPrev").addEventListener("click", () => {
  showImage(currentImage - 1);
});

document.getElementById("lightboxNext").addEventListener("click", () => {
  showImage(currentImage + 1);
});

function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
}

document.getElementById("lightboxClose").addEventListener("click", closeLightbox);

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});


/* =================================
   SLIDESHOW
================================= */

const slideshowToggle = document.getElementById("slideshowToggle");

slideshowToggle.addEventListener("click", () => {

  if (slideshowTimer) {

    clearInterval(slideshowTimer);
    slideshowTimer = null;
    slideshowToggle.textContent = "START SLIDESHOW";

  } else {

    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");

    slideshowToggle.textContent = "STOP SLIDESHOW";

    slideshowTimer = setInterval(() => {
      showImage(currentImage + 1);
    }, 3000);

  }

});

lightbox.addEventListener("click", event => {

  if (event.target === lightbox && slideshowTimer) {
    clearInterval(slideshowTimer);
    slideshowTimer = null;
    slideshowToggle.textContent = "START SLIDESHOW";
  }

});
/* =================================
   OPEN INVITATION & BACKGROUND MUSIC
================================= */

const openButton = document.getElementById("openInvitation");
const cover = document.getElementById("cover");
const invitation = document.getElementById("invitation");

const weddingMusic = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");

// OPEN INVITATION + PLAY MUSIC
openButton.addEventListener("click", async () => {
    cover.classList.add("is-hidden");
    invitation.classList.remove("is-hidden");

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    try {
        await weddingMusic.play();

        musicToggle.textContent = "♫";
        musicLabel.textContent = "Pause music";
        musicToggle.setAttribute("aria-label", "Pause music");

    } catch (error) {
        console.error("Music could not play:", error);
        musicLabel.textContent = "Play music";
    }
});

// MUSIC PLAY / PAUSE
musicToggle.addEventListener("click", async () => {

    if (weddingMusic.paused) {

        try {
            await weddingMusic.play();

            musicToggle.textContent = "♫";
            musicLabel.textContent = "Pause music";
            musicToggle.setAttribute("aria-label", "Pause music");

        } catch (error) {
            console.error("Music could not play:", error);
        }

    } else {

        weddingMusic.pause();

        musicToggle.textContent = "♪";
        musicLabel.textContent = "Play music";
        musicToggle.setAttribute("aria-label", "Play music");
    }
});


/* =================================
   WEDDING COUNTDOWN
================================= */

const weddingDate = new Date("December 20, 2026 11:00:00").getTime();

function updateCountdown() {

    const now = new Date().getTime();
    const distance = weddingDate - now;

    if (distance <= 0) {
        ["days", "hours", "minutes", "seconds"].forEach(id => {
            document.getElementById(id).innerText = "00";
        });
        return;
    }

    document.getElementById("days").innerText =
        Math.floor(distance / (1000 * 60 * 60 * 24));

    document.getElementById("hours").innerText =
        Math.floor((distance / (1000 * 60 * 60)) % 24);

    document.getElementById("minutes").innerText =
        Math.floor((distance / (1000 * 60)) % 60);

    document.getElementById("seconds").innerText =
        Math.floor((distance / 1000) % 60);
}

updateCountdown();
setInterval(updateCountdown, 1000);
