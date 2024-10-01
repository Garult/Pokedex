const BASE_URL = "https://pokeapi.co/api/v2/pokemon";

// Initialize the starting offset and limit
let offset = 50;
let limit = 18;

function init() {
  getPokemonNames(offset, limit);
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
  return await response.json(); // Returns the Pokémon list
}

async function fetchPokemonDetails(url) {
  let response = await fetch(url);
  return await response.json(); // Returns individual Pokémon details
}

function createPokemonCard(pokeDetails, pokemonName) {
  let pokemonBox = document.createElement("div");
  pokemonBox.classList.add("card-body", "pokemon-card");

  let img = document.createElement("img");
  img.src = pokeDetails.sprites.other.home.front_default;
  img.alt = pokemonName;
  img.classList.add("pokemon-img");

  let pokemonInfo = document.createElement("div");
  pokemonInfo.classList.add("pokemon-info");
  let types = pokeDetails.types.map((t) => t.type.name).join(", ");
  pokemonInfo.innerHTML = `<h3>${pokemonName.capitalize()}</h3><p>Type: ${types}</p>`;

  pokemonBox.append(img, pokemonInfo);
  return pokemonBox; // Return the complete card
}


// First letter in uppercase
Object.defineProperty(String.prototype, "capitalize", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
});

// Load more Pokémon when the "Next" button is pressed
function loadMorePokemon() {
  offset += limit; // Increase the offset to get the next set of Pokémon
  getPokemonNames(offset, limit); // Fetch the next set of Pokémon
}




