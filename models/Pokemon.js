const mongoose = require("mongoose");

const PokemonSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  types: { type: Array, required: true },
  id: { type: Number, required: true, unique: true },
  abilities: { type: Array, required: true },
  evolutions: { type: Array },
  encounterCondition: { type: Array },
  owner: { type: String, required: true },
});

module.exports = mongoose.model("Pokemon", PokemonSchema);
