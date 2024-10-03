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
  idCounter++; 

  pokemonBox.classList.add("card-body", "pokemon-card");

  let img = createPokemonImg(pokeDetails, pokemonName);
  let pokemonInfo = createPokemonTypes(pokeDetails, pokemonName);

  pokemonBox.append(img, pokemonInfo);
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

// id muss dynamisch vergeben werden

function openOverlay(idCounter) {
  const openDiv = document.getElementById(`pokemon-${idCounter}`);
  const closeDiv = document.querySelector(".closeOverlay"); // Selecting the close button
  const overlay = document.querySelector(".overlay");

  // Ensure openDiv exists before attaching the event listener
  if (openDiv) {
    openDiv.addEventListener("click", () => {
      overlay.style.display = "block"; // Show the overlay when a Pokémon card is clicked
    });
  }

  // Ensure closeDiv exists before attaching the event listener
  if (closeDiv) {
    closeDiv.addEventListener("click", () => {
      overlay.style.display = "none"; // Hide the overlay when the close button is clicked
    });
  }
}

// 