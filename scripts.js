function openInvitation() {
const openInvitation = document.getElementById("openInvitation");
const invitation = document.getElementById("invitation");
const cover = document.getElementById("cover");

const weddingMusic = document.getElementById("weddingMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");

openInvitation.addEventListener("click", async () => {
  cover.classList.add("is-hidden");
  invitation.classList.remove("is-hidden");

  try {
    await weddingMusic.play();
    musicToggle.textContent = "♫";
    musicLabel.textContent = "Pause music";
  } catch (error) {
    musicLabel.textContent = "Play music";
  }
});

musicToggle.addEventListener("click", async () => {
  if (weddingMusic.paused) {
    try {
      await weddingMusic.play();
      musicToggle.textContent = "♫";
      musicLabel.textContent = "Pause music";
    } catch (error) {
      musicLabel.textContent = "Play music";
    }
  } else {
    weddingMusic.pause();
    musicToggle.textContent = "♪";
    musicLabel.textContent = "Play music";
  }
});
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((distance / (1000 * 60)) % 60);
    const seconds = Math.floor((distance / 1000) % 60);

    document.getElementById("days").innerText = days;
    document.getElementById("hours").innerText = hours;
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;
}

updateCountdown();
setInterval(updateCountdown, 1000);
