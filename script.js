/* =========================
   ELEMENTOS
========================= */
const input = document.getElementById("search");
const suggestionsEl = document.getElementById("suggestions");
const weatherEl = document.getElementById("weather");

/* =========================
   AUTOCOMPLETE + SEARCH
========================= */
let suggestions = [];
let selectedIndex = -1;
let scriptTag = null;

input.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const q = input.value.trim();
    if (!q) return;
    window.location.href =
      "https://www.google.com/search?q=" + encodeURIComponent(q);
  }

  if (e.key === "ArrowDown") {
    selectedIndex = Math.min(selectedIndex + 1, suggestions.length - 1);
    updateActive();
  }

  if (e.key === "ArrowUp") {
    selectedIndex = Math.max(selectedIndex - 1, 0);
    updateActive();
  }

  if (e.key === "Escape") {
    suggestionsEl.style.display = "none";
  }
});

input.addEventListener("input", () => {
  const q = input.value.trim();

  if (!q) {
    suggestionsEl.style.display = "none";
    return;
  }

  if (scriptTag) document.body.removeChild(scriptTag);

  scriptTag = document.createElement("script");
  scriptTag.src =
    `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(q)}&callback=handleSuggestions`;
  document.body.appendChild(scriptTag);
});

window.handleSuggestions = data => {
  suggestions = data[1] || [];
  renderSuggestions();
};

function renderSuggestions() {
  suggestionsEl.innerHTML = "";
  selectedIndex = -1;

  suggestions.slice(0, 6).forEach(text => {
    const div = document.createElement("div");
    div.textContent = text;

    div.onclick = () => {
      input.value = text;
      window.location.href =
        "https://www.google.com/search?q=" + encodeURIComponent(text);
    };

    suggestionsEl.appendChild(div);
  });

  suggestionsEl.style.display = suggestions.length ? "block" : "none";
}

function updateActive() {
  [...suggestionsEl.children].forEach((el, i) => {
    el.classList.toggle("active", i === selectedIndex);
    if (i === selectedIndex) input.value = el.textContent;
  });
}

/* =========================
           CLIMA
========================= */

// coordenadas demo (New York)
const CITY_NAME = "New York";
const LAT = 40.7128;
const LON = -74.0060;

fetch(`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true`)
  .then(r => r.json())
  .then(data => {
    const w = data.current_weather;
    weatherEl.textContent =
      `${CITY_NAME} · ${Math.round(w.temperature)}°C · viento ${w.windspeed} km/h`;
  })
  .catch(() => {
    weatherEl.textContent = "clima no disponible";
  });

/* =========================
     SALUDO TERMINAL
========================= */

document.getElementById("user").textContent = "seb_";

const host =
  location.hostname === "127.0.0.1" || location.hostname === "localhost"
    ? "local"
    : location.hostname;

document.getElementById("host").textContent = host;
