const accessKey = "BANDA2026";

const loginScreen = document.querySelector("#login-screen");
const libraryScreen = document.querySelector("#library-screen");
const loginForm = document.querySelector("#login-form");
const passwordInput = document.querySelector("#password");
const errorMessage = document.querySelector("#error-message");
const logoutButton = document.querySelector("#logout-button");
const religiousLink = document.querySelector("#religious-link");
const religiousScreen = document.querySelector("#religious-screen");
const backToLibrary = document.querySelector("#back-to-library");
const libraryLayout = document.querySelector(".library-layout");
const categoryLinks = document.querySelectorAll(".library-category, .category-link");
const categoryTitle = document.querySelector("#religious-screen h1");
const categoryDescription = document.querySelector("#religious-screen .section-description");
const categoryScores = document.querySelector("#category-scores");
const scoreViewer = document.querySelector("#score-viewer");
const backToCategory = document.querySelector("#back-to-category");
const instrumentSelect = document.querySelector("#instrument-select");
const scorePages = document.querySelector("#score-pages");
const viewerTitle = document.querySelector("#viewer-title");
const viewerInstrument = document.querySelector("#viewer-instrument");
const viewerPageCount = document.querySelector("#viewer-pages");
const downloadScore = document.querySelector("#download-score");
const printScore = document.querySelector("#print-score");
let currentImageUrls = [];
const searchInputs = document.querySelectorAll("#score-search");
const searchForm = document.querySelector("#search-form");
const searchSuggestions = document.querySelector("#search-suggestions");
const instrumentLogo = document.querySelector("#instrument-logo");
const instrumentName = document.querySelector("#instrument-name");
const musicQuote = document.querySelector("#music-quote");

const instrumentMoments = [
  { name: "Clarinete", image: "Multimedia/logos/clarinete.png", phrase: "Cada ensayo convierte el esfuerzo en armonía." },
  { name: "Saxofón", image: "Multimedia/logos/saxo.png", phrase: "La música empieza donde termina la duda." },
  { name: "Trombón", image: "Multimedia/logos/trombon.png", phrase: "Una banda unida transforma sonidos en recuerdos." },
  { name: "Trompeta", image: "Multimedia/logos/trompeta.png", phrase: "Tu instrumento tiene una voz: haz que cuente." }
];

let instrumentMomentIndex = 0;

function showNextMusicMoment() {
  instrumentMomentIndex = (instrumentMomentIndex + 1) % instrumentMoments.length;
  const nextMoment = instrumentMoments[instrumentMomentIndex];
  instrumentLogo.classList.add("phrase-changing");
  instrumentName.classList.add("phrase-changing");
  musicQuote.classList.add("phrase-changing");
  window.setTimeout(() => {
    instrumentLogo.src = nextMoment.image;
    instrumentLogo.alt = nextMoment.name;
    instrumentName.textContent = nextMoment.name;
    musicQuote.textContent = nextMoment.phrase;
    instrumentLogo.classList.remove("phrase-changing");
    instrumentName.classList.remove("phrase-changing");
    musicQuote.classList.remove("phrase-changing");
  }, 180);
}

window.setInterval(showNextMusicMoment, 10000);

function filterLibrary(query) {
  const normalizedQuery = query.trim().toLowerCase();

  document.querySelectorAll(".score-card, .category-card").forEach((card) => {
    const title = (card.dataset.title || card.textContent).toLowerCase();
    card.hidden = normalizedQuery !== "" && !title.includes(normalizedQuery);
  });
}

function findSong(songName) {
  const normalizedName = songName.trim().toLowerCase();
  return Object.entries(categories).flatMap(([categoryId, category]) => category.songs.map((song) => ({ ...song, categoryId }))).find((song) => song.name.toLowerCase() === normalizedName);
}

function openSong(song) {
  if (!song || !scoreFiles[song.name]) return false;

  const instruments = Object.keys(scoreFiles[song.name]);
  instrumentSelect.innerHTML = instruments.map((instrument) => `<option value="${instrument}">${instrument}</option>`).join("");
  searchSuggestions.hidden = true;
  showScoreViewer(song.name, instruments[0], song.categoryId);
  return true;
}

function renderSearchSuggestions(query) {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) {
    searchSuggestions.hidden = true;
    searchSuggestions.innerHTML = "";
    return;
  }

  const matches = Object.entries(categories).flatMap(([categoryId, category]) => category.songs
    .filter((song) => song.name.toLowerCase().includes(normalizedQuery))
    .map((song) => ({ ...song, categoryId, categoryTitle: category.title })));

  searchSuggestions.innerHTML = matches.length
    ? matches.map((song) => `<button class="suggestion-item" type="button" data-song="${song.name}"><span class="suggestion-icon">♫</span><span><strong>${song.name.toUpperCase()}</strong><small>${song.categoryTitle}</small></span><span class="suggestion-arrow">→</span></button>`).join("")
    : `<p class="no-suggestions">No se encontró ninguna partitura.</p>`;
  searchSuggestions.hidden = false;
}

const categories = {
  religiosa: { title: "Música religiosa", folder: "Música Religiosa - Católica", description: "Repertorio religioso de la banda.", songs: [{ name: "Pescador de hombres", instruments: ["Trompeta"] }, { name: "Santa maría del camino", instruments: ["Trompeta"] }] },
  cumbia: { title: "Cumbia y folklore", folder: "Cumbia y Folklore", description: "Música popular y repertorio folklórico.", songs: [{ name: "Una cerveza", instruments: ["Clarinete", "Saxofón alto", "Trompeta"] }] },
  himnos: { title: "Himnos patrios y cívicos", folder: "Himnos Patrios y Cívicos", description: "Himnos para ceremonias y actos cívicos.", songs: [{ name: "Gigantes de cenepa", instruments: ["Clarinete", "Saxofón alto"] }, { name: "Himno del colegio santísimo nombre de Jesús", instruments: ["Clarinete", "Trompeta"] }, { name: "Himno nacional del Perú", instruments: ["Clarinete", "Corno", "Saxofón alto", "Trompeta"] }, { name: "Jauja", instruments: ["Clarinete"] }, { name: "Marcha de banderas", instruments: ["Clarinete", "Saxofón alto", "Trompeta"] }, { name: "Tacna", instruments: ["Clarinete", "Trompeta"] }] },
  miscelaneo: { title: "Misceláneo", folder: "Misceláneo", description: "Repertorio variado de la banda.", songs: [{ name: "Risas y música, los payasos de la televisión", instruments: ["Clarinete", "Saxofón alto", "Trompeta"] }] },
  clasica: { title: "Música clásica y ópera", folder: "Música Clásica y Ópera", description: "Obras clásicas adaptadas para banda.", songs: [{ name: "Egmont", instruments: ["Clarinete", "Corno", "Saxofón Alto", "Trompeta"] }, { name: "Italian in Algiers", instruments: ["Clarinete", "Corno"] }] }
};

const scoreFiles = {
  "Pescador de hombres": { "Trompeta · 1ra voz": { folder: "Trompeta", files: ["pescador-de-hombres-1trompeta.jpg"] } },
  "Santa maría del camino": { "Trompeta · 1ra voz": { folder: "Trompeta", files: ["santa-maria-del-camino-1trompeta.jpg"] } },
  "Una cerveza": {
    "Clarinete · 1ra voz": { folder: "Clarinete", files: ["una-cerveza-1clarinete.jpg"] },
    "Saxofón alto · 1ra voz": { folder: "Saxofón alto", files: ["una-cerveza-1altosax.jpg"] },
    "Trompeta · 1ra voz": { folder: "Trompeta", files: ["Una-Cerveza-1Trompeta.jpg"] }
  },
  "Gigantes de cenepa": {
    "Clarinete · 1ra voz": { folder: "Clarinete", files: ["gigante-de-cenepa-1clarinete.jpg"] },
    "Saxofón alto · 1ra voz": { folder: "Saxofón alto", files: ["gigante-de-cenepa-1altosax.jpg"] }
  },
  "Himno del colegio santísimo nombre de Jesús": {
    "Clarinete · 1ra voz": { folder: "Clarinete", files: ["himno-snj-1clarinete.jpg", "himno-snj-2clarinete.jpg"] },
    "Trompeta · 1ra voz": { folder: "Trompeta", files: ["himno-snj-1trompeta.jpg", "himno-snj-2trompeta.jpg"] }
  },
  "Himno nacional del Perú": {
    "Clarinete · 1ra voz": { folder: "Clarinete", files: ["himno-nacional-1clarinete.jpg", "himno-nacional-2clarinete.jpg"] },
    "Corno · 1ra y 2da voces": { folder: "Corno", files: ["himno-nacional-1y2corno.jpg"] },
    "Saxofón alto · 1ra voz": { folder: "Saxofón alto", files: ["himno-nacional-1altosax.jpg"] },
    "Trompeta · 1ra voz": { folder: "Trompeta", files: ["himno-nacional-1trompeta.jpg", "himno-nacional-2trompeta.jpg"] }
  },
  Jauja: { "Clarinete · 1ra voz": { folder: "Clarinete", files: ["jauja-1clarinete.jpg"] } },
  "Marcha de banderas": {
    "Clarinete · 1ra voz": { folder: "Clarinete", files: ["marcha-de-banderas-1clarinete.jpg"] },
    "Saxofón alto · 1ra voz": { folder: "Saxofón alto", files: ["marcha-de-banderas-1altosax.jpg"] },
    "Trompeta · 1ra voz": { folder: "Trompeta", files: ["marcha-de-banderas-1trompeta.jpg"] }
  },
  Tacna: {
    "Clarinete · 1ra voz": { folder: "Clarinete", files: ["tacna-1clarinete.jpg"] },
    "Trompeta · 1ra voz": { folder: "Trompeta", files: ["tacna-1trompeta.jpg", "tacna-2trompeta.jpg"] }
  },
  "Risas y música, los payasos de la televisión": {
    "Clarinete · 1ra voz": { folder: "Clarinete", files: ["risas-y-musica-1clarinete-1.jpg", "risas-y-musica-1clarinete-2.jpg", "risas-y-musica-1clarinete-3.jpg"] },
    "Saxofón alto · 1ra voz": { folder: "Saxofón alto", files: ["risas-y-musica-1altosax-1.jpg", "risas-y-musica-1altosax-2.jpg", "risas-y-musica-1altosax-3.jpg"] },
    "Trompeta · 1ra voz": { folder: "Trompeta", files: ["risas-y-musica-1trompeta-1.jpg", "risas-y-musica-1trompeta-2.jpg", "risas-y-musica-1trompeta-3.jpg"] }
  },
  Egmont: {
    "Clarinete · 1ra voz": { folder: "Clarinete", files: ["egmont-1clarinete-1.jpg", "egmont-1clarinete-2.jpg", "egmont-1clarinete-3.jpg"] },
    "Corno · 1ra voz": { folder: "Corno", files: ["egmont-1corno-1.jpg", "egmont-1corno-2.jpg", "egmont-1corno-3.jpg"] },
    "Saxofón Alto · 1ra voz": { folder: "Saxofón Alto", files: ["egmont-1altosax-1.jpg", "egmont-1altosax-2.jpg"] },
    "Trompeta · 1ra y 2da voces": { folder: "Trompeta", files: ["egmont-1y2trompeta.jpg"] }
  },
  "Italian in Algiers": {
    "Clarinete · 1ra voz": { folder: "Clarinete", files: ["italian-in-algiers-1clarinete-1.jpg", "italian-in-algiers-1clarinete-2.jpg", "italian-in-algiers-1clarinete-3.jpg"] },
    "Corno · 2da voz": { folder: "Corno", files: ["italian-in-algiers-2corno-1.jpg", "italian-in-algiers-2corno-2.jpg"] }
  }
};

function showCategory(categoryId) {
  const category = categories[categoryId];
  categoryTitle.textContent = category.title;
  categoryDescription.textContent = category.description;
  categoryScores.innerHTML = category.songs.map((song) => {
    const instruments = song.instruments.length
      ? song.instruments.map((instrument) => `<span class="instrument-info">${instrument}</span>`).join("")
      : `<span class="no-instruments">Sin instrumentos todavía</span>`;
    return `<article class="category-card song-card" data-title="${song.name}"><span class="category-icon">♫</span><span><strong>${song.name}</strong><small class="instrument-list">${instruments}</small></span></article>`;
  }).join("");
  libraryLayout.hidden = true;
  religiousScreen.hidden = false;
}

function showScoreViewer(song, instrument, categoryId) {
  const score = scoreFiles[song][instrument];
  const files = score.files;
  const folder = categories[categoryId].folder;
  currentImageUrls = files.map((file) => `../PARTITURAS!!/${folder}/${song}/${score.folder}/${file}`);
  scorePages.innerHTML = currentImageUrls.map((url) => `<img src="${url}" alt="Partitura de ${song} para ${instrument}">`).join("");
  viewerTitle.textContent = song;
  viewerInstrument.textContent = instrument;
  viewerPageCount.textContent = `${files.length} ${files.length === 1 ? "página disponible" : "páginas disponibles"}`;
  religiousScreen.hidden = true;
  scoreViewer.hidden = false;
  document.body.classList.add("viewer-open");
}

function showLibrary() {
  loginScreen.hidden = true;
  libraryScreen.classList.remove("empty-state");
  libraryScreen.hidden = false;
  libraryLayout.hidden = false;
  religiousScreen.hidden = true;
  scoreViewer.hidden = true;
  document.body.classList.remove("viewer-open");
}

if (sessionStorage.getItem("authenticated") === "true") {
  showLibrary();
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (passwordInput.value === accessKey) {
    sessionStorage.setItem("authenticated", "true");
    showLibrary();
  } else {
    errorMessage.textContent = "La clave no es correcta.";
    passwordInput.value = "";
  }
});

categoryLinks.forEach((link) => link.addEventListener("click", (event) => {
  event.preventDefault();
  showCategory(link.dataset.category || "religiosa");
}));

backToLibrary.addEventListener("click", () => {
  religiousScreen.hidden = true;
  libraryLayout.hidden = false;
});

categoryScores.addEventListener("click", (event) => {
  const songCard = event.target.closest(".song-card");
  if (!songCard) return;

  event.preventDefault();
  const song = songCard.dataset.title;
  if (!scoreFiles[song]) return;
  const instruments = Object.keys(scoreFiles[song]);
  instrumentSelect.innerHTML = instruments.map((instrument) => `<option value="${instrument}">${instrument}</option>`).join("");
  const categoryId = Object.keys(categories).find((id) => categories[id].songs.some((item) => item.name === song));
  showScoreViewer(song, instruments[0], categoryId);
});

backToCategory.addEventListener("click", () => {
  scoreViewer.hidden = true;
  religiousScreen.hidden = false;
  document.body.classList.remove("viewer-open");
});

instrumentSelect.addEventListener("change", () => {
  const song = viewerTitle.textContent;
  const categoryId = Object.keys(categories).find((id) => categories[id].songs.some((item) => item.name === song));
  showScoreViewer(song, instrumentSelect.value, categoryId);
});

downloadScore.addEventListener("click", () => {
  currentImageUrls.forEach((url, index) => {
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = `${viewerTitle.textContent}-${viewerInstrument.textContent}-pagina-${index + 1}.jpg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  });
});

printScore.addEventListener("click", () => {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`<title>${viewerTitle.textContent} - ${viewerInstrument.textContent}</title>
    <style>
      @page { size: A4 portrait; margin: 8mm; }
      html, body { margin: 0; padding: 0; }
      .print-page {
        display: flex;
        width: 100%;
        height: 281mm;
        align-items: center;
        justify-content: center;
        break-after: page;
        page-break-after: always;
        break-inside: avoid;
      }
      .print-page:last-child { break-after: auto; page-break-after: auto; }
      .print-page img { display: block; max-width: 100%; max-height: 100%; object-fit: contain; }
    </style>`);
  currentImageUrls.forEach((url) => {
    printWindow.document.write(`<section class="print-page"><img src="${url}" alt="Partitura"></section>`);
  });
  printWindow.document.write("<script>window.onload = () => window.print();<\/script>");
  printWindow.document.close();
});

searchInputs.forEach((input) => {
  input.addEventListener("input", () => {
    searchInputs.forEach((otherInput) => {
      otherInput.value = input.value;
    });
    filterLibrary(input.value);
    renderSearchSuggestions(input.value);
  });
});

searchForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const song = findSong(searchInputs[0].value);
  if (openSong(song)) return;

  filterLibrary(searchInputs[0].value);
  renderSearchSuggestions(searchInputs[0].value);
});

searchSuggestions.addEventListener("click", (event) => {
  const suggestion = event.target.closest(".suggestion-item");
  if (!suggestion) return;

  const song = findSong(suggestion.dataset.song);
  openSong(song);
});

logoutButton.addEventListener("click", () => {
  sessionStorage.removeItem("authenticated");

  libraryScreen.classList.add("empty-state");
  libraryScreen.hidden = true;
  religiousScreen.hidden = true;
  document.body.classList.remove("viewer-open");
  loginScreen.hidden = false;
  passwordInput.value = "";
  errorMessage.textContent = "";
});