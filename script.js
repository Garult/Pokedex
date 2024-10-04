const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

let offset = 50;
let limit = 18;

function init() {
  loadingSpinner();
  getPokemonNames(offset, limit);
  loadingSpinnerLoadMorePokemon();
}

function minLenghtSearchBar() {
  let inputValue = document.getElementById("searchBarInput").value;
  if (inputValue.length < 3) {
    alert("mindestens 3 Buchstaben eingeben");
  } else {
    console.log("Search input is valid");
  }
}

async function getPokemonNames(offset, limit) {
  let data = await fetchPokemonList(offset, limit);
  let pokemonContainer = document.getElementById("content");

  data.results.forEach(async (pokemon) => {
    let pokeDetails = await fetchPokemonDetails(pokemon.url);
    let pokemonBox = createPokemonCard(pokeDetails, pokemon.name);
    pokemonBG(pokeDetails, pokemonBox);
    pokemonContainer.appendChild(pokemonBox);
  });
}

async function fetchPokemonList(offset, limit) {
  let response = await fetch(`${BASE_URL}?limit=${limit}&offset=${offset}`);
  return await response.json();
}

let idCounter = 1;

async function fetchPokemonDetails(url) {
  let response = await fetch(url);
  return await response.json();
}

function createPokemonCard(pokeDetails, pokemonName) {
  let pokemonBox = document.createElement("div");

  pokemonBox.setAttribute('id', `pokemon-${idCounter}`);
  pokemonBox.classList.add("card-body", "pokemon-card");

  let img = createPokemonImg(pokeDetails, pokemonName);
  let pokemonInfo = createPokemonTypes(pokeDetails, pokemonName);

  pokemonBox.append(img, pokemonInfo);
  document.getElementById("content").appendChild(pokemonBox);

  // Add click event listener to open the overlay and pass both idCounter and pokemonName
  pokemonBox.addEventListener("click", () => openOverlay(idCounter, pokeDetails, pokemonName.capitalize(), pokemonBox));

  idCounter++; // Increment the id counter after attaching the event listener

  return pokemonBox;
}

function createPokemonTypes(pokeDetails, pokemonName) {
  let pokemonInfo = document.createElement("div");
  pokemonInfo.classList.add("pokemon-info");
  let types = pokeDetails.types.map((t) => t.type.name).join(", ");
  pokemonInfo.innerHTML = `<h3>${pokemonName.capitalize()}</h3><p>Type: ${types}</p>`;

  return pokemonInfo;
}

function createPokemonImg(pokeDetails, pokemonName) {
  let img = document.createElement("img");
  img.src = pokeDetails.sprites.other.home.front_default;
  img.alt = pokemonName;
  img.classList.add("pokemon-img");

  return img;
}

Object.defineProperty(String.prototype, "capitalize", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
});

document.addEventListener("DOMContentLoaded", () => {
  const nextPokemonBt = document.getElementById("nextPoakemonBt");
  nextPokemonBt.innerHTML = nextPokemonBtText;
});

function loadMorePokemon() {
  offset += limit;
  getPokemonNames(offset, limit);
}

function loadingSpinner() {
  let loading = document.getElementById("loadingSpinner");
  let backGroundCards = document.getElementById("content");

  setTimeout(() => {
    loading.style.opacity = 0;
    backGroundCards.style.opacity = 1;
    setTimeout(() => {
      loading.style.display = "none";
    }, 2000);
  }, 1800);
}

function loadingSpinnerLoadMorePokemon() {
  let btnEl = document.getElementById("nextPoakemonBt");
  btnEl.addEventListener("click", () => {
    btnEl.innerHTML = `<div class="o-pokeball c-loader u-bounce">`;
    btnEl.disabled = true;
    btnEl.style.opacity = 1;

    setTimeout(() => {
      btnEl.innerHTML = nextPokemonBtText;
      btnEl.disabled = false;
      btnEl.style.opacity = 1;
    }, 3000);
  });
}


function openOverlay(idCounter, pokeDetails, pokemonName, pokemonBox) {
  let overlay = document.querySelector(".overlay");
  let closeDiv = document.querySelector(".overlay");
  const body = document.body;
  body.classList.add('no-scroll');

  overlay.style.display = "block"; 
  insertOverlayData(idCounter, pokeDetails, pokemonName, pokemonBox); 

  // Add event listener to close the overlay
  closeDiv.addEventListener("click", () => {
    overlay.style.display = "none"; // Hide the overlay when the close button is clicked
    body.classList.remove('no-scroll');
  });
}

function insertOverlayData(idCounter, pokeDetails, pokemonName) {
  let idCounterPokemon = idCounter;
  let pokemonImg = createPokemonImg(pokeDetails, pokemonName); // Get the Pokémon image
  let pokemonInfoName = createPokemonTypes(pokeDetails, pokemonName); // Get the Pokémon info
  let overlayContent = document.getElementById("overlay");

  // Get the background color from pokemonBG and apply it to the overlay
  let overlayContainer = document.createElement('div');
  overlayContainer.classList.add("overlayContainer");
  overlayContainer.setAttribute("id", idCounterPokemon);

  if (overlayContent) {
    overlayContent.innerHTML = ''; // Clear previous content

    // Apply the background from pokemonBG to the overlay container
    pokemonBG(pokeDetails, overlayContainer); 

    // Append the elements (image and info) to the overlay container
    overlayContainer.appendChild(pokemonImg);
    overlayContainer.appendChild(pokemonInfoName);

    // Append the fully styled container to the overlay
    overlayContent.appendChild(overlayContainer);
  }
}



// to do: noch ein Overlay was in der unteren Hälfte des Overlays sitzt
// 4 Reiter machen mit verschiedenen daten
// pfeile links und rechts um durch die daten zu scrollen