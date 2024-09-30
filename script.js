// Suchanfragen durch itterieren
//bei den ersten 3 Buchstaben schon ideen zeigen
const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=100&offset=50";

function init() {
  getPokemonNames();
}

function minLenghtSearchBar() {
  let inputValue = document.getElementById("searchBarInput").value;
  if (inputValue.length < 3) {
    alert("mindestens 3 Buchstaben eingeben");
  } else {
    console.log("Search input is valid");
  }
}

//inhalt festlegen, was soll angezeigt werden
// buttons für nächste Seite anzeigen
// on click soll das Bild groß werden
// pfeile für das näcshte Bild eingeben



async function getPokemonNames() {
  
    let response = await fetch(BASE_URL);
    let data = await response.json(); // Fetch JSON data from the API

    let allPokemon = data.results.slice(0, 10); // Display only the first 10 Pokémon
    let pokemonContainer = document.getElementById("content"); // The container for the Pokémon cards

    // Iterate through the Pokémon and create a card for each
    allPokemon.forEach((pokemon) => {
      // Create a div element for the Pokémon card
      let pokemonBox = document.createElement("div");
      pokemonBox.classList.add("card-body");
      pokemonBox.classList.add("pokemon-card"); // Add a class for styling
      

      // Fetch the individual Pokémon's details, including the image
      fetch(pokemon.url)
        .then((res) => res.json())
        .then((pokeDetails) => {
          // Create an image element for the Pokémon's image
          let img = document.createElement("img");
          img.src = pokeDetails.sprites.other.home.front_default; // Pokémon image from "home" sprite
          img.alt = pokemon.name;
          img.classList.add("pokemon-img");

          // Create a div to hold the text (name and types)
          let pokemonInfo = document.createElement("div");
          pokemonInfo.classList.add("pokemon-info");

          // Add Pokémon name and types
          let types = pokeDetails.types.map((typeInfo) => typeInfo.type.name).join(", "); // Join types by comma
          pokemonInfo.innerHTML = `<h3>${pokemon.name.capitalize()}</h3><p>Type: ${types}</p>`;

          // Append the image and text to the Pokémon card
          pokemonBox.appendChild(img); // Append image to the box
          pokemonBox.appendChild(pokemonInfo); // Append the text next to the image

          pokemonBG(pokeDetails, pokemonBox); // Set background based on Pokémon type
        });

      // Add the box to the container
      pokemonContainer.appendChild(pokemonBox);
    });
 
}

// first letter in uppercase
Object.defineProperty(String.prototype, "capitalize", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
});

function loadMorePokemon() {
// hier muss dann festgelegt werden von welchem punkt die daten vom API kommen
  let allPokemon = data.results.slice(10, 30);
  
}




