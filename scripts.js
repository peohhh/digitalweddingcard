function openInvitation() {
const openInvitation = document.getElementById("openInvitation");
const invitation = document.getElementById("invitation");
const cover = document.getElementById("cover");

const weddingMusic = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");

// OPEN WEDDING INVITATION
const openButton = document.getElementById("openInvitation");
const invitation = document.getElementById("invitation");
const cover = document.getElementById("cover");

// BACKGROUND MUSIC
const weddingMusic = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");

// Open invitation and play music
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
        musicLabel.textContent = "Play music";
    }
});

// PLAY / PAUSE MUSIC
musicToggle.addEventListener("click", async () => {
    if (weddingMusic.paused) {
        try {
            await weddingMusic.play();
            musicToggle.textContent = "♫";
            musicLabel.textContent = "Pause music";
            musicToggle.setAttribute("aria-label", "Pause music");
        } catch (error) {
            musicLabel.textContent = "Play music";
        }
    } else {
        weddingMusic.pause();
        musicToggle.textContent = "♪";
        musicLabel.textContent = "Play music";
        musicToggle.setAttribute("aria-label", "Play music");
    }
});
        return;
    }

   // WEDDING COUNTDOWN
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
