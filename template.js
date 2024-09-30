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
  const mainContent = document.getElementById("content");
  mainContent.innerHTML = `
    <div id="pokemonBoxes" class="pokemonBoxes" ><div class="card" style="width: 20rem;">
  <img src="..." class="card-img-top" alt="...">
  <div class="card-body">
    <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  </div>
</div></div>
      `;
});
