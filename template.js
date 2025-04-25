String.prototype.capitalize = function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

const headerText = `
    <div class="headerContainer">
        <div class="headerPngContainer">${createHeaderImages()}</div>
        <h1>Pokedex</h1>${createSearchBar()}
    </div>
`;

function createHeaderImages() {
    return `
        <img src="./assets/icons/normalBall.png" class="ball1" alt="red poke ball">
        <img src="./assets/icons/greatBall.png" class="ball2" alt="great poke ball">
        <img src="./assets/icons/ultraBall.png" class="ball3" alt="ultra poke ball">
    `;
}

function createSearchBar() {
    return `
      <div class="input-group mb-3">
          <input id="searchBarInput" type="text" class="form-control" placeholder="Search Pokémon">
      </div>
    `;
  }
  
const nextPokemonBtText = `
    <div id="nextPokemonBt" class="nextPokemonBt">
        <button onclick="loadMorePokemon()" class="btn btn-primary btn-lg">
            ${createNextPokemonButtonIcon()} Nächste Pokémon
        </button>
    </div>
`;

function createNextPokemonButtonIcon() {
    return `
        <img src="./assets/icons/normalBall.png" onMouseOver="this.src='./assets/icons/ultraBall.png'" 
             onMouseOut="this.src='./assets/icons/normalBall.png'" alt="red poke ball">
    `;
}

function pokemonBG(pokeDetails, pokemonBox) {
    pokeDetails.types.forEach(typeInfo => addTypeClassAndIcon(typeInfo, pokemonBox));
}

function addTypeClassAndIcon(typeInfo, pokemonBox) {
    const typeName = typeInfo.type.name;
    const typeData = pokemontype[typeName];
    if (typeData) {
        pokemonBox.classList.add(typeData.class);
        const typeImg = createTypeImage(typeData);
        pokemonBox.appendChild(typeImg);
    }
}

function createTypeImage(typeData) {
    const img = document.createElement("img");
    img.src = typeData.image;
    img.alt = `${typeData.class} type icon`;
    img.classList.add("type-icon");
    return img;
}

function overlayDetailsAbout(pokeDetails) {
    const container = getOrCreateAboutContainer();
    container.innerHTML = createAboutTable(pokeDetails);
    container.style.display = "block";
}

function createAboutTable(pokeDetails) {
    const { species, height, weight, abilities } = extractPokemonDetails(pokeDetails);
    return `
        <table>
            <tr><th>Species</th><td>${species}</td></tr>
            <tr><th>Height</th><td>${height} cm</td></tr>
            <tr><th>Weight</th><td>${weight} kg</td></tr>
            <tr><th>Abilities</th><td>${abilities}</td></tr>
        </table>
    `;
}

function extractPokemonDetails(pokeDetails) {
    const species = pokeDetails.species.name.capitalize();
    const height = pokeDetails.height * 10; // Convert to cm
    const weight = pokeDetails.weight / 10; // Convert to kg
    const abilities = pokeDetails.abilities
        .map(ability => ability.ability.name.capitalize())
        .join(", ");
    return { species, height, weight, abilities };
}

function overlayDetailsBaseStats(pokeDetails) {
    const stats = extractBaseStats(pokeDetails);
    const container = getOrCreateAboutContainer();
    container.innerHTML = createBaseStatsProgressBars(stats);
    container.style.display = 'block';
}

function extractBaseStats(pokeDetails) {
    return {
        hp: pokeDetails.stats.find(stat => stat.stat.name === 'hp').base_stat,
        attack: pokeDetails.stats.find(stat => stat.stat.name === 'attack').base_stat,
        defense: pokeDetails.stats.find(stat => stat.stat.name === 'defense').base_stat,
        speed: pokeDetails.stats.find(stat => stat.stat.name === 'speed').base_stat,
    };
}

function createBaseStatsProgressBars(stats) {
    return `
        ${createProgressBar(stats.hp, 'HP', 'bg-success')}
        ${createProgressBar(stats.attack, 'Attack', 'bg-danger text-dark')}
        ${createProgressBar(stats.defense, 'Defense', 'bg-info text-dark')}
        ${createProgressBar(stats.speed, 'Speed', 'bg-warning')}
    `;
}

function createProgressBar(value, label, barClass) {
    return `
        <div class="progress mb-2" role="progressbar" aria-label="${label}" aria-valuenow="${value}" aria-valuemax="100">
            <div class="progress-bar ${barClass}" style="width: ${value}%">${label} ${value}</div>
        </div>
    `;
}

function createOverlayDetailsShiny(pokeDetails) {
    const shinyImg = pokeDetails.sprites.other.home.front_shiny;
    return `<img src="${shinyImg}" alt="Shiny version of ${pokeDetails.name.capitalize()}">`;
}

function getOrCreateAboutContainer() {
    let container = document.getElementById("pokemonOverlayDetails");
    if (!container) container = createAboutContainer();
    else container.innerHTML = '';
    return container;
}

function createAboutContainer() {
    const container = document.createElement("div");
    container.classList.add("pokemonOverlayDetails");
    container.setAttribute("id", "pokemonOverlayDetails");
    const parent = document.querySelector('.overlayContainerDetails');
    if (parent) parent.appendChild(container);
    return container;
}






