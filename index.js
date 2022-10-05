const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const loginRoute = require("./route/login");
const registerRoute = require("./route/register");
const pokemonRoute = require("./route/pokemon");
const axios = require("axios");
const Pokemon = require("./models/Pokemon");

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://anamarijajanjic:lozinka123@cluster0.k0a4a1l.mongodb.net/pokemon?retryWrites=true&w=majority"
    );

    console.log("MongoDB connected!");
  } catch (err) {
    console.log("Failed to connect to MongoDB", err);
  }
};
connectDB();
app.use(cors());
app.use(express.json());
app.use("/api", registerRoute);
app.use("/api", loginRoute);
app.use("/api", pokemonRoute);

app.listen(5000, () => {
  console.log("Backend server is running on port 5000!");
});

//scraping the data
async function getPokemon() {
  await axios
    .get("https://pokeapi.co/api/v2/pokemon?limit=151")
    .then(function (Allpokemon) {
      Allpokemon.data.results.forEach(function (pokemon) {
        getOnePokemon(pokemon);
      });
    })
    .catch((err) => console.log(err));
}
async function getOnePokemon(pokemon) {
  let url = pokemon.url;
  await axios
    .get(url)
    .then(function (pokemonData) {
      let onePokemon = {
        name: pokemonData.data.name,
        types: getPokemonTypes(pokemonData),
        id: pokemonData.data.id,
        abilities: getPokemonAbilities(pokemonData),
        //evolution: getPokemonEvolution(pokemonData.data.id), --> vraca pending, a console loga trazeni niz ?
        //encounterCondition: getPokemonEncounter(pokemonData),
        owner: "PokeAPI",
      };

      Pokemon.findOne({ name: onePokemon.name }, function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          if (docs === null) {
            var newPokemon = new Pokemon(onePokemon);
            newPokemon.save();
          }
        }
      });
    })
    .catch((err) => console.log("getOnePokemon" + err));
}
function getPokemonTypes(pokemon) {
  try {
    let typesArray = [];
    for (let i = 0; i < pokemon.data.types.length; i++) {
      typesArray.push(pokemon.data.types[i].type.name);
    }
    return typesArray;
  } catch {
    console.log("getPokemonTypes error");
  }
}
function getPokemonAbilities(pokemon) {
  try {
    let abilitiesArray = [];
    for (let i = 0; i < pokemon.data.abilities.length; i++) {
      abilitiesArray.push(pokemon.data.abilities[i].ability.name);
    }
    return abilitiesArray;
  } catch {
    console.log("getPokemonAbilities error");
  }
}

async function getPokemonEvolution(pokemonid) {
  let evolutionArray = [];
  await axios
    .get(`http://pokeapi.co/api/v2/evolution-chain/${pokemonid}/`)
    .then((data) => {
      let eData = data.data.chain;
      do {
        let noEvolution = eData["evolves_to"].length;
        evolutionArray.push(eData.species.name);
        if (noEvolution > 1) {
          for (let i = 1; i < noEvolution; i++) {
            evolutionArray.push(eData.evolves_to[i].species.name);
          }
        }
        eData = eData["evolves_to"][0];
      } while (!!eData && eData.hasOwnProperty("evolves_to"));
      return evolutionArray;
    })
    .catch((err) => console.log("getPokemonEvolution" + err + pokemonid));
}

getPokemon();
