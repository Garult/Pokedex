// Suchanfragen durch itterieren
//bei den ersten 3 Buchstaben schon ideen zeigen
const BASE_URL = "https://pokeapi.co/api/v2/pokemon?limit=100&offset=50";


function init() {
    getPokemon();
}

function minLenghtSearchBar() {
  let inputValue = document.getElementById("searchBarInput").value;
  if (inputValue.length < 3) {
    alert("mindestens 3 Buchstaben eingeben");
  } else {
    console.log("Search input is valid");
  }
}

//boxen kreieren
//inhalt festlegen, was soll angezeigt werden
// buttons für nächste Seite anzeigen
// on click soll das Bild groß werden
// pfeile für das näcshte Bild eingeben

//hier muss noch durch irretiert werden damit jedes einzelne angezeigt wird
async function getPokemon() {
    let response = await fetch(BASE_URL) + ".json";
    response = 0;
    pokemonName = response.name;// name ist noch undefined
    response.forEach(element => {
        console.log(element);
    });
    
    
}

// das hier benutzen um die angezeigten Pokemon einzugrenzen pokemon?limit=100000&offset=0.