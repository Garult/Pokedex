const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

let offset = 0;
let limit = 20;
let initialized = false;
let currentPokemonId = null;
let pokemonList = [];
let pokemonMap = new Map();
let suggestedPokemons = [];

const pokemontype = {
  grass: { class: "bg-grass", image: "./assets/icons/types/leafe.png" },
  fire: { class: "bg-fire", image: "./assets/icons/types/fire.png" },
  water: { class: "bg-water", image: "./assets/icons/types/water.png" },
  electric: { class: "bg-electric", image: "./assets/icons/types/electric.png" },
  psychic: { class: "bg-psychic", image: "./assets/icons/types/psychic.png" },
  rock: { class: "bg-rock", image: "./assets/icons/types/rock.png" },
  dark: { class: "bg-dark", image: "./assets/icons/types/dark.png" },
  poison: { class: "bg-poison", image: "./assets/icons/types/poison.png" },
  steel: { class: "bg-steel", image: "./assets/icons/types/metal.png" },
  fighting: { class: "bg-fighting", image: "./assets/icons/types/fighting.png" },
  dragon: { class: "bg-dragon", image: "./assets/icons/types/dragon.png" },
  ghost: { class: "bg-ghost", image: "./assets/icons/types/ghost.png" },
  fairy: { class: "bg-fairy", image: "./assets/icons/types/fairy.png" },
  flying: { class: "bg-flying", image: "./assets/icons/types/flying.png" },
  normal: { class: "bg-normal", image: "./assets/icons/types/normal.png" },
  bug: { class: "bg-bug", image: "./assets/icons/types/bug.png" },
  ice: { class: "bg-ice", image: "./assets/icons/types/ice.png" },
  ground: { class: "bg-ground", image: "./assets/icons/types/ground.png" },
};

// ========== Initialization ==========
document.addEventListener("DOMContentLoaded", () => {
  init();
  setupEventListeners();
});

function init() {
  if (initialized) return;
  initialized = true;

  loadingSpinner();
  getPokemonNames(offset, limit);
  setupLoadMorePokemonButton();
  updateHeader();
}

function setupEventListeners() {
  const nextPokemonBt = document.getElementById("nextPokemonBt");
  nextPokemonBt.addEventListener("click", loadMorePokemon);
  document.getElementById("searchBarInput").addEventListener("keyup", minLengthSearchBar);
}

function updateHeader() {
  document.getElementById("header").innerHTML = headerText;
  document.getElementById("nextPokemonBt").innerHTML = nextPokemonBtText;
}

// ========== Utility Functions ==========
function capitalize(str) {
  if (typeof str !== "string") throw new Error("Input must be a string");
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function sortPokemonsById(pokemonArray) {
  return pokemonArray.sort((a, b) => a.id - b.id);
}

// ========== Search and Filter ==========
function minLengthSearchBar() {
  let inputValue = getSearchInput();
  const suggestionsContent = document.getElementById("content");
  const nextBtn = document.getElementById("nextPokemonBt");

  if (inputValue.length < 1) {
    handleEmptySearchInput(suggestionsContent, nextBtn);
    return;
  }

  if (nextBtn) nextBtn.style.opacity = "0.0";
  displayFilteredPokemons(inputValue, suggestionsContent);
}

function handleEmptySearchInput(suggestionsContent, nextBtn) {
  suggestionsContent.innerHTML = ""; 
  suggestedPokemons = []; 
  resetPokemonSearch(nextBtn); 
}

function renderPokemons(container, fetchedPokemons) {
  pokemonList = sortPokemonsById([...fetchedPokemons]); 
  container.innerHTML = ""; 
  pokemonList.forEach((pokemon) => renderPokemon(container, pokemon));
}

function getSearchInput() {
  return document.getElementById("searchBarInput").value.trim().toLowerCase();
}

function resetPokemonSearch(nextBtn) {
  if (nextBtn) nextBtn.style.opacity = "0.9";
  offset = 0;

  // Reset global Pokémon list and clear container
  pokemonList = [];
  const pokemonContainer = document.getElementById("pokemonContainer");
  if (pokemonContainer) {
    pokemonContainer.innerHTML = "";
  }

  // Fetch and display Pokémon starting from the beginning
  getPokemonNames(offset, limit).then(() => {
    console.log("Pokémon list reset and reloaded.");
  });
}

async function displayFilteredPokemons(inputValue, container) {
  container.innerHTML = "";
  try {
    const data = await fetchPokemonListData();
    const matchingPokemons = filterPokemons(data, inputValue);
    renderMatchingPokemons(container, matchingPokemons);
  } catch (error) {
    handleSearchError(container, error);
  }
}

async function fetchPokemonListData() {
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=10000');
  return response.json();
}

function filterPokemons(data, inputValue) {
  return data.results.filter(pokemon =>
    pokemon.name.toLowerCase().startsWith(inputValue)
  );
}

async function renderMatchingPokemons(container, matchingPokemons) {
  const matchingPokemonsWithDetails = [];
  for (const pokemon of matchingPokemons) {
    await renderPokemonCard(container, pokemon, matchingPokemonsWithDetails);
  }
  suggestedPokemons = sortPokemonsById(matchingPokemonsWithDetails);
}

async function renderPokemonCard(container, pokemon, matchingPokemonsWithDetails) {
  try {
    const details = await fetchPokemonDetails(pokemon.url);
    const card = configurePokemonCard(details, pokemon.name);
    appendPokemonCard(container, card, details, matchingPokemonsWithDetails);
  } catch (error) {
    console.error("Error loading Pokémon details:", error);
  }
}

function configurePokemonCard(details, name) {
  const card = createPokemonCard(details, name);
  pokemonMap.set(details.id, details);
  pokemonBG(details, card);
  addCardClickListener(card, details.id);
  return card;
}

function appendPokemonCard(container, card, details, matchingPokemonsWithDetails) {
  container.appendChild(card);
  matchingPokemonsWithDetails.push(details);
}
function handleSearchError(container, error) {
  console.error("Error fetching Pokémon list:", error);
  container.innerHTML = "<p>Failed to load Pokémon. Try again later.</p>";
}

// ========== Data Fetching ==========
async function getPokemonNames(offset, limit) {
  const data = await fetchPokemonList(offset, limit);
  const container = document.getElementById("content");
  const fetchedPokemons = await fetchPokemonsDetails(data.results);
  renderPokemons(container, fetchedPokemons);
}

async function fetchPokemonsDetails(results) {
  const fetchedPokemons = [];
  await Promise.all(
    results.map(async (pokemon) => {
      const details = await fetchPokemonDetails(pokemon.url);
      fetchedPokemons.push(details);
      pokemonMap.set(details.id, details);
    })
  );
  return fetchedPokemons;
}

function renderPokemons(container, fetchedPokemons) {
  pokemonList = sortPokemonsById([...pokemonList, ...fetchedPokemons]);
  container.innerHTML = "";
  pokemonList.forEach((pokemon) => renderPokemon(container, pokemon));
}

function renderPokemon(container, pokemon) {
  const card = createPokemonCard(pokemon, pokemon.name);
  pokemonBG(pokemon, card);
  container.appendChild(card);
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
  overlay.addEventListener("click", (e) => closeOverlayOnOutsideClick(e, overlay, body));
  addButtonEventPropagationPrevention(overlay);
}

function closeOverlayOnOutsideClick(event, overlay, body) {
  const container = document.querySelector(".overlayContainerDetails");
  if (!container.contains(event.target)) {
    overlay.style.display = "none";
    body.classList.remove("no-scroll");
  }
}

function addButtonEventPropagationPrevention(overlay) {
  overlay.querySelectorAll("button").forEach(button => {
    button.addEventListener("click", (e) => e.stopPropagation());
  });

  addNavigationButtonListeners();
}

function addNavigationButtonListeners() {
  document.getElementById("prevPokemonBtn").addEventListener("click", () => navigatePokemon("prev"));
  document.getElementById("nextPokemonBtn").addEventListener("click", () => navigatePokemon("next"));
}

function navigatePokemon(direction) {
  const currentIndex = suggestedPokemons.findIndex(p => p.id === currentPokemonId);


  if (isInSearchMode(currentIndex)) {
    handleSearchModeNavigation(currentIndex, direction);
  } 
  
  else {
    handleDefaultNavigation(direction);
  }
}

function isInSearchMode(currentIndex) {
  return suggestedPokemons.length > 0 && currentIndex !== -1;
}

function handleSearchModeNavigation(currentIndex, direction) {
  const newIndex = calculateNewIndex(currentIndex, direction);
  if (newIndex === null || newIndex < 0 || newIndex >= suggestedPokemons.length) return;

  const newPokemon = suggestedPokemons[newIndex];
  openPokemonOverlay(newPokemon.id);
}

function calculateNewIndex(currentIndex, direction) {
  return direction === "next" ? currentIndex + 1 : currentIndex - 1;
}

function handleDefaultNavigation(direction) {
  const newId = direction === "next" ? currentPokemonId + 1 : currentPokemonId - 1;
  if (!pokemonMap.has(newId)) return;

  openPokemonOverlay(newId);
}

// ========== Overlay Content ==========
function insertOverlayData(pokemonId, details, name) {
  const overlayContent = initializeOverlayContent();
  if (!overlayContent) return;

  const overlayContainer = setupOverlayContainer(pokemonId, details, name);
  const overlayDetails = setupOverlayDetails(pokemonId);

  overlayContent.append(overlayContainer, overlayDetails);
  addOverlayTabListeners();
}

function initializeOverlayContent() {
  const overlayContent = document.getElementById("overlay");
  if (!overlayContent) {
    console.error("Overlay content not found");
    return null;
  }

  overlayContent.innerHTML = ""; 
  return overlayContent;
}

function setupOverlayContainer(pokemonId, details, name) {
  const overlayContainer = createOverlayContainer(pokemonId);
  const img = createPokemonImg(details, name);
  const info = createPokemonTypes(details, name);

  pokemonBG(details, overlayContainer);
  overlayContainer.append(img, info);

  return overlayContainer;
}

function setupOverlayDetails(pokemonId) {
  const overlayDetails = createOverlayDetailsContainer();
  overlayDetails.innerHTML = getOverlayHeaderHTML(pokemonId);
  overlayDetails.appendChild(createDetailsContainer());

  return overlayDetails;
}

function addOverlayTabListeners() {
  document.getElementById("detailsAboutBtn").addEventListener("click", showAbout);
  document.getElementById("detailsBaseStatsBtn").addEventListener("click", showBaseStats);
  document.getElementById("detailsShinyBtn").addEventListener("click", showShiny);
}

function getOverlayHeaderHTML(id) {
  return `
    <div class="overlayContainerDetailsHeader">
      ${createNavigationButtonHTML("prev")}
      ${createTabButtonHTML("About", "detailsAboutBtn")}
      ${createTabButtonHTML("Base Stats", "detailsBaseStatsBtn")}
      ${createTabButtonHTML("Shiny", "detailsShinyBtn")}
      ${createNavigationButtonHTML("next")}
    </div>`;
}

function createNavigationButtonHTML(direction) {
  const arrow = direction === "prev" ? "Left" : "Right";
  return `
    <button class="navBtn" id="${direction}PokemonBtn">
      <img src="./assets/icons/arrow${arrow}.png" alt="${arrow} arrow" style="width: 50px; height: 50px;">
    </button>`;
}

function createTabButtonHTML(label, id) {
  return `<button id="${id}" class="overlayContainerDetailsHeaderBtn">${label}</button>`;
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

// ========== Tab Handlers ==========
function showAbout() {
  const details = pokemonMap.get(currentPokemonId);
  const container = document.getElementById("pokemonOverlayDetails");
  container.style.backgroundColor =" #EEE9DB";
  container.classList.remove("pokemonOverlayDetailsSparkling");
  overlayDetailsAbout(details);
}

function showBaseStats() {
  const details = pokemonMap.get(currentPokemonId);
  const container = document.getElementById("pokemonOverlayDetails");
  container.style.backgroundColor = "#EEE9DB";
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
  btn.addEventListener("click", () => handleLoadMoreButtonClick(btn));
}

function handleLoadMoreButtonClick(btn) {
  btn.innerHTML = `<div class="o-pokeball c-loader u-bounce"></div>`;
  btn.disabled = true;
  btn.style.opacity = 1;

  setTimeout(() => {
    resetLoadMoreButton(btn);
    loadMorePokemon();
  }, 2000);
}

function resetLoadMoreButton(btn) {
  btn.innerHTML = nextPokemonBtText;
  btn.disabled = false;
  btn.style.opacity = 1;
}