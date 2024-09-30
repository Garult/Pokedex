//header

document.addEventListener("DOMContentLoaded", () => {
  const headerContent = document.getElementById("header");
  headerContent.innerHTML = `
    <div class="headerContainer">
        <div class="headerPngContainer">
            <img src="./assets/icons/normalBall.png" class="ball1" alt="red poke ball">
            <img src="./assets/icons/greatBall.png" class="ball2" alt="great poke ball">
            <img src="./assets/icons/ultraBall.png" class="ball3" alt="ultra poke ball">
        </div>
        <h1>Pokedex</h1>
        <div class="input-group mb-3">
      <button onclick="minLenghtSearchBar()" class="btn btn-outline-secondary" type="button" id="button-addon1">search</button>
      <input id="searchBarInput" type="text" class="form-control" placeholder="" aria-label="search bar" aria-describedby="button-addon1">
    </div>
    </div>`;
});

document.addEventListener("DOMContentLoaded", () => {
  const nextPokemonBt = document.getElementById("nextPoakemonBt");
  nextPokemonBt.innerHTML = `
  <div class="nextPokemonBt">
  <button type="button" onclick="loadMorePokemon()" class="btn btn-primary btn-lg"> <img src="./assets/icons/normalBall.png" 
  onMouseOver="this.src='./assets/icons/ultraBall.png'" onMouseOut="this.src='./assets/icons/normalBall.png'"
  alt="red poke ball" border="0" >nächste Pokemon</button></div>`;
});

function pokemonBG(pokeDetails, pokemonBox) {
  
  if (pokeDetails.types.some(type => type.type.name === "grass")) {
    pokemonBox.classList.add("bg-grass");
  }
  if (pokeDetails.types.some(type => type.type.name === "fire")) {
    pokemonBox.classList.add("bg-fire");
  }
  if (pokeDetails.types.some(type => type.type.name === "water")) {
    pokemonBox.classList.add("bg-water");
  }
  if (pokeDetails.types.some(type => type.type.name === "electric")) {
    pokemonBox.classList.add("bg-electric");
  }
  if (pokeDetails.types.some(type => type.type.name === "psychic")) {
    pokemonBox.classList.add("bg-psychic");
  }
  if (pokeDetails.types.some(type => type.type.name === "rock")) {
    pokemonBox.classList.add("bg-rock");
  }
  if (pokeDetails.types.some(type => type.type.name === "dark")) {
    pokemonBox.classList.add("bg-dark");
  }
  if (pokeDetails.types.some(type => type.type.name === "poison")) {
    pokemonBox.classList.add("bg-poison");
  }
  if (pokeDetails.types.some(type => type.type.name === "steel")) {
    pokemonBox.classList.add("bg-steel");
  }
  if (pokeDetails.types.some(type => type.type.name === "fighting")) {
    pokemonBox.classList.add("bg-fighting");
  }
  if (pokeDetails.types.some(type => type.type.name === "dragon")) {
    pokemonBox.classList.add("bg-dragon");
  }
  if (pokeDetails.types.some(type => type.type.name === "ghost")) {
    pokemonBox.classList.add("bg-ghost");
  }
  if (pokeDetails.types.some(type => type.type.name === "fairy")) {
    pokemonBox.classList.add("bg-fairy");
  }
  if (pokeDetails.types.some(type => type.type.name === "flying")) {
    pokemonBox.classList.add("bg-flying");
  }
  if (pokeDetails.types.some(type => type.type.name === "normal")) {
    pokemonBox.classList.add("bg-normal");
  }
  if (pokeDetails.types.some(type => type.type.name === "bug")) {
    pokemonBox.classList.add("bg-bug");
  }
  if (pokeDetails.types.some(type => type.type.name === "ice")) {
    pokemonBox.classList.add("bg-ice");
  }
  if (pokeDetails.types.some(type => type.type.name === "ground")) {
    pokemonBox.classList.add("bg-ground");
  }
}
  