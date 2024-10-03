//header
const headerText = `
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

document.addEventListener("DOMContentLoaded", () => {
  const headerContent = document.getElementById("header");
  headerContent.innerHTML = headerText;
});

const nextPokemonBtText = `
  <div class="nextPokemonBt">
  <button type="button" onclick="loadMorePokemon()" class="btn btn-primary btn-lg"> <img src="./assets/icons/normalBall.png" 
  onMouseOver="this.src='./assets/icons/ultraBall.png'" onMouseOut="this.src='./assets/icons/normalBall.png'"
  alt="red poke ball" border="0" >nächste Pokemon</button></div>`;

const pokemontype = {
  grass: { class: "bg-grass", image: "./assets/icons/types/leafe.png" },
  fire: { class: "bg-fire", image: "./assets/icons/types/fire.png" },
  water: { class: "bg-water", image: "./assets/icons/types/water.png" },
  electric: {
    class: "bg-electric",
    image: "./assets/icons/types/electric.png",
  },
  psychic: { class: "bg-psychic", image: "./assets/icons/types/psychic.png" },
  rock: { class: "bg-rock", image: "./assets/icons/types/rock.png" },
  dark: { class: "bg-dark", image: "./assets/icons/types/dark.png" },
  poison: { class: "bg-poison", image: "./assets/icons/types/poison.png" },
  steel: { class: "bg-steel", image: "./assets/icons/types/metal.png" },
  fighting: {
    class: "bg-fighting",
    image: "./assets/icons/types/fighting.png",
  },
  dragon: { class: "bg-dragon", image: "./assets/icons/types/dragon.png" },
  ghost: { class: "bg-ghost", image: "./assets/icons/types/ghost.png" },
  fairy: { class: "bg-fairy", image: "./assets/icons/types/fairy.png" },
  flying: { class: "bg-flying", image: "./assets/icons/types/flying.png" },
  normal: { class: "bg-normal", image: "./assets/icons/types/normal.png" },
  bug: { class: "bg-bug", image: "./assets/icons/types/bug.png" },
  ice: { class: "bg-ice", image: "./assets/icons/types/ice.png" },
  ground: { class: "bg-ground", image: "./assets/icons/types/ground.png" },
};

function pokemonBG(pokeDetails, pokemonBox) {
  const typeClassMap = pokemontype;

  pokeDetails.types.forEach((typeInfo) => {
    let typeName = typeInfo.type.name;
    let typeData = typeClassMap[typeName];

    if (typeData) {
      pokemonBox.classList.add(typeData.class);

      let typeImg = document.createElement("img");
      typeImg.src = typeData.image;
      typeImg.alt = `${typeName} type icon`;
      typeImg.classList.add("type-icon");

      pokemonBox.appendChild(typeImg);
    }
  });
}
