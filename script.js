const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

let offset = 50;
let limit = 14;
let initialized = false;
let currentPokemonId = null;
let pokemonList = [];
let pokemonMap = new Map();
let suggestedPokemons = [];

// ========== Initialization ==========
document.addEventListener("DOMContentLoaded", () => {
  init();
  const nextPokemonBt = document.getElementById("nextPokemonBt");
  nextPokemonBt.addEventListener("click", loadMorePokemon);
});

function init() {
  if (initialized) return;
  initialized = true;

  loadingSpinner();
  getPokemonNames(offset, limit);
  setupLoadMorePokemonButton();

  document.getElementById("header").innerHTML = headerText;
  document.getElementById("nextPokemonBt").innerHTML = nextPokemonBtText;
}

// ========== Utility Functions ==========
function capitalize(str) {
  if (typeof str !== "string") throw new Error("Input must be a string");
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// ========== Search and Filter ==========
function minLengthSearchBar() {
  let inputValue = document.getElementById("searchBarInput").value.trim().toLowerCase();
  const suggestionsContent = document.getElementById("content");
  suggestionsContent.innerHTML = "";

  if (inputValue.length < 3) {
    alert("Please enter at least 3 characters");
    return;
  }

  displayFilteredPokemons(inputValue, suggestionsContent);

  document.getElementById("searchBarInput").value = "";
}

async function displayFilteredPokemons(inputValue, container) {
  container.innerHTML = ""; 

  try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
    const data = await response.json();
    const matchingPokemons = data.results.filter(pokemon =>
      pokemon.name.toLowerCase().startsWith(inputValue)
    );

    if (matchingPokemons.length === 0) {
      container.innerHTML = "<p>No matching Pokémon found.</p>";
      return;
    }

    suggestedPokemons = matchingPokemons;

    for (const pokemon of matchingPokemons) {
      try {
        const detailsResponse = await fetch(pokemon.url);
        const details = await detailsResponse.json();
        const card = createPokemonCard(details, pokemon.name);
        pokemonMap.set(details.id, details);
        pokemonBG(details, card);
        addCardClickListener(card, details.id);
        container.appendChild(card);
      } catch (error) {
        console.error("Error loading Pokémon details:", error);
      }
    }
  } catch (error) {
    console.error("Error fetching Pokémon list:", error);
    container.innerHTML = "<p>Failed to load Pokémon. Try again later.</p>";
  }
}
// ========== Data Fetching ==========
async function getPokemonNames(offset, limit) {
  const data = await fetchPokemonList(offset, limit);
  const container = document.getElementById("content");

  await Promise.all(
    data.results.map(async (pokemon) => {
      const details = await fetchPokemonDetails(pokemon.url);
      const card = createPokemonCard(details, pokemon.name);

      pokemonBG(details, card);
      container.appendChild(card);

      pokemonList.push(details);
      pokemonMap.set(details.id, details);
    })
  );
}

async function fetchPokemonList(offset, limit) {
  const response = await fetch(`${BASE_URL}?limit=${limit}&offset=${offset}`);
  return response.json();
}

async function fetchPokemonDetails(url) {
  const response = await fetch(url);
  return response.json();
}

// ========== Card Creation ==========
function createPokemonCard(details, name) {
  const card = document.createElement("div");
  card.id = `pokemon-${details.id}`;
  card.classList.add("card-body", "pokemon-card");

  const img = createPokemonImg(details, name);
  const info = createPokemonTypes(details, name);

  card.append(img, info);
  addCardClickListener(card, details.id);

  return card;
}

function addCardClickListener(card, id) {
  card.addEventListener("click", () => openPokemonOverlay(id));
}

function createPokemonImg(details, name) {
  const img = document.createElement("img");
  img.src = details.sprites.other.home.front_default;
  img.alt = name;
  img.classList.add("pokemon-img");
  return img;
}

function createPokemonTypes(details, name) {
  const info = document.createElement("div");
  info.classList.add("pokemon-info");
  const types = details.types.map(t => t.type.name).join(", ");
  info.innerHTML = `<h3>${capitalize(name)}</h3><p>Type: ${types}</p>`;
  return info;
}

function addCardClickListener(card, id) {
  card.addEventListener("click", () => openPokemonOverlay(id));
}

// ========== Overlay Controls ==========
function openPokemonOverlay(pokemonId) {
  const details = pokemonMap.get(pokemonId);
  if (!details) {
    console.error(`No Pokémon found for ID: ${pokemonId}`);
    return;
  }

  currentPokemonId = pokemonId;
  openOverlay(pokemonId, details, details.name);
  overlayDetailsAbout(details); 
}

function openOverlay(pokemonId, details, name) {
  const overlay = document.querySelector(".overlay");
  document.body.classList.add("no-scroll");
  overlay.style.display = "block";

  insertOverlayData(pokemonId, details, name);
  addOverlayCloseListener(overlay, document.body);
}

function addOverlayCloseListener(overlay, body) {
  overlay.addEventListener("click", (e) => {
    const container = document.querySelector(".overlayContainerDetails");
    if (!container.contains(e.target)) {
      overlay.style.display = "none";
      body.classList.remove("no-scroll");
    }
  });

  overlay.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", (e) => e.stopPropagation());
  });

  document.getElementById("prevPokemonBtn").addEventListener("click", () => navigatePokemon("prev"));
  document.getElementById("nextPokemonBtn").addEventListener("click", () => navigatePokemon("next"));
}

function navigatePokemon(direction) {
  const currentIndex = suggestedPokemons.findIndex(pokemon => pokemon.id === currentPokemonId);
  let newIndex;

  if (direction === "next") {
    newIndex = currentIndex + 1;
    if (newIndex >= suggestedPokemons.length) return; 
  } else if (direction === "prev") {
    newIndex = currentIndex - 1;
    if (newIndex < 0) return; 
  }

  const newPokemon = suggestedPokemons[newIndex];
  openPokemonOverlay(newPokemon.id); 
}

// ========== Overlay Content ==========
function insertOverlayData(pokemonId, details, name) {
  const overlayContent = document.getElementById("overlay");
  if (!overlayContent) return console.error("Overlay content not found");

  overlayContent.innerHTML = "";

  const overlayContainer = createOverlayContainer(pokemonId);
  const overlayDetails = createOverlayDetailsContainer();
  const img = createPokemonImg(details, name);
  const info = createPokemonTypes(details, name);

  pokemonBG(details, overlayContainer);
  overlayContainer.append(img, info);
  overlayContent.append(overlayContainer, overlayDetails);

  overlayDetails.innerHTML = getOverlayHeaderHTML(pokemonId);
  overlayDetails.appendChild(createDetailsContainer());

  document.getElementById("detailsAboutBtn").addEventListener("click", showAbout);
  document.getElementById("detailsBaseStatsBtn").addEventListener("click", showBaseStats);
  document.getElementById("detailsShinyBtn").addEventListener("click", showShiny);
}

function getOverlayHeaderHTML(id) {
  return `
    <div class="overlayContainerDetailsHeader">
      <button class="navBtn" id="prevPokemonBtn">
        <img src="./assets/icons/arrowLeft.png" alt="left arrow" style="width: 50px; height: 50px;">
      </button>
      <button id="detailsAboutBtn" class="overlayContainerDetailsHeaderBtn">About</button>
      <button id="detailsBaseStatsBtn" class="overlayContainerDetailsHeaderBtn">Base Stats</button>
      <button id="detailsShinyBtn" class="overlayContainerDetailsHeaderBtn">Shiny</button>
      <button class="navBtn" id="nextPokemonBtn">
        <img src="./assets/icons/arrowRight.png" alt="right arrow" style="width: 50px; height: 50px;">
      </button>
    </div>`;
}
function addOverlayCloseListener(overlay, body) {
  overlay.addEventListener("click", (e) => {
    const container = document.querySelector(".overlayContainerDetails");
    if (!container.contains(e.target)) {
      overlay.style.display = "none";
      body.classList.remove("no-scroll");
    }
  });

  overlay.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", (e) => e.stopPropagation());
  });

  document.getElementById("prevPokemonBtn").addEventListener("click", () => navigatePokemon("prev"));
  document.getElementById("nextPokemonBtn").addEventListener("click", () => navigatePokemon("next"));
}

function navigatePokemon(direction) {
  const currentId = currentPokemonId;
  let newId;

  if (direction === "next") {
    newId = currentId + 1;
    if (!pokemonMap.has(newId)) return; 
  } else if (direction === "prev") {
    newId = currentId - 1;
    if (!pokemonMap.has(newId)) return; 
  }

  openPokemonOverlay(newId); 
}

function createOverlayContainer(id) {
  const container = document.createElement("div");
  container.classList.add("overlayContainer");
  container.id = `pokemon-${id}`;
  return container;
}

function createOverlayDetailsContainer() {
  const container = document.createElement("div");
  container.classList.add("overlayContainerDetails");
  container.id = "overlayContainerDetails";
  return container;
}

function createDetailsContainer() {
  const container = document.createElement("div");
  container.classList.add("pokemonOverlayDetails");
  container.id = "pokemonOverlayDetails";
  return container;
}

function resetOverlayDetails(container) {
  if (!container) return console.error("Details container not found!");
  container.innerHTML = "";
  container.style.display = "block";
}

// ========== Overlay Tabs ==========
function overlayDetailsAbout(details) {
  const container = document.getElementById("pokemonOverlayDetails");
  if (!container) return console.error("Details container not found!");

  const content = createAboutTable(details);
  resetOverlayDetails(container);
  container.innerHTML = content;
}

function overlayDetailsBaseStats(details) {
  const container = document.getElementById("pokemonOverlayDetails");
  if (!container) return console.error("Details container not found!");

  const content = createBaseStatsProgressBars(extractBaseStats(details));
  resetOverlayDetails(container);
  container.innerHTML = content;
}

function overlayDetailsShiny(details) {
  const container = document.getElementById("pokemonOverlayDetails");
  if (!container) return console.error("Details container not found!");

  const shinyImg = details.sprites.other.home.front_shiny;
  container.innerHTML = shinyImg
    ? `<img src="${shinyImg}" alt="Shiny version of ${details.name}" class="shiny-image">`
    : `<p>No shiny image available</p>`;
}

// ========== Navigation ==========
function plusPokemon(id) {
  const nextId = id + 1;
  if (pokemonMap.has(nextId)) openPokemonOverlay(nextId);
}

function minusPokemon(id) {
  const prevId = id - 1;
  if (pokemonMap.has(prevId)) openPokemonOverlay(prevId);
}

// ========== Tab Handlers ==========
function showAbout() {
  const details = pokemonMap.get(currentPokemonId);
  const container = document.getElementById("pokemonOverlayDetails");
  container.style.backgroundColor = "white";
  container.classList.remove("pokemonOverlayDetailsSparkling");
  overlayDetailsAbout(details);
}

function showBaseStats() {
  const details = pokemonMap.get(currentPokemonId);
  const container = document.getElementById("pokemonOverlayDetails");
  container.style.backgroundColor = "white";
  container.classList.remove("pokemonOverlayDetailsSparkling");
  overlayDetailsBaseStats(details);
}

function showShiny() {
  const details = pokemonMap.get(currentPokemonId);
  const container = document.getElementById("pokemonOverlayDetails");

  if (!container.classList.contains("pokemonOverlayDetailsSparkling")) {
    container.classList.add("pokemonOverlayDetailsSparkling");
    container.style.backgroundColor = "#f0f0f0";
  }

  overlayDetailsShiny(details);
}

// ========== UI Helpers ==========
function loadMorePokemon() {
  offset += limit;
  getPokemonNames(offset, limit);
}

function loadingSpinner() {
  const loading = document.getElementById("loadingSpinner");
  const cards = document.getElementById("content");

  setTimeout(() => {
    loading.style.opacity = 0;
    cards.style.opacity = 1;
    setTimeout(() => loading.style.display = "none", 2000);
  }, 800);
}

function setupLoadMorePokemonButton() {
  const btn = document.getElementById("nextPokemonBt");
  btn.addEventListener("click", () => {
    btn.innerHTML = `<div class="o-pokeball c-loader u-bounce"></div>`;
    btn.disabled = true;
    btn.style.opacity = 1;

    setTimeout(() => {
      btn.innerHTML = nextPokemonBtText;
      btn.disabled = false;
      btn.style.opacity = 1;
      loadMorePokemon();
    }, 2000);
  });
}