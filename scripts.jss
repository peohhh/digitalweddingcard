
function openInvitation() {
    document.getElementById("opening").style.display = "none";

    const invitation = document.getElementById("invitation");
    invitation.style.display = "block";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// Wedding countdown
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
