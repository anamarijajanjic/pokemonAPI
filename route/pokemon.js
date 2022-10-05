const Pokemon = require("../models/Pokemon");
const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const mongoose = require("mongoose");

const getToken = (req) => {
  const auth = req.get("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer")) {
    return auth.substring(7);
  }
  return null;
};
//CREATE
router.post("/createPokemon", async (req, res) => {
  try {
    const token = getToken(req);
    const dekToken = jwt.verify(token, "pass");
    if (!token || !dekToken.id) {
      return res.status(401).json("Authentication invalid");
    }
    let name = " ";
    let id = mongoose.Types.ObjectId(dekToken.id);
    User.findOne({ _id: id })
      .then((doc) => {
        name = doc.username;
        const newPokemon = new Pokemon({
          name: req.body.name.toLowerCase(),
          types: req.body.types,
          id: req.body.id,
          abilities: req.body.abilities,
          evolution: req.body.evolution,
          encounterCondition: req.body.encounterCondition,
          owner: name,
        });
        const savedPokemon = newPokemon.save();
        return res.status(201).json(savedPokemon);
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (err) {
    return res.status(401).json(err);
  }
});

//READ
router.get("/readPokemon", async (req, res) => {
  try {
    const token = getToken(req);
    const dekToken = jwt.verify(token, "pass");
    if (!token || !dekToken.id) {
      return res.status(401).json("Authentication invalid");
    }
    const allPokemon = await Pokemon.find({});
    return res.status(200).json(allPokemon);
  } catch (err) {
    return res.status(401).json(err);
  }
});

//UPDATE
router.put("/updatePokemon", async (req, res) => {
  try {
    const token = getToken(req);
    const dekToken = jwt.verify(token, "pass");
    if (!token || !dekToken.id) {
      return res.status(401).json("Authentication invalid");
    }
    let id = req.body.id;
    Pokemon.findByIdAndUpdate(
      id,
      {
        name: req.body.name.toLowerCase(),
        types: req.body.types,
        abilities: req.body.abilities,
        evolution: req.body.evolution,
        encounterCondition: req.body.encounterCondition,
      },
      function (err, docs) {
        if (err) {
          return res.status(400).json(err);
        } else {
          console.log("Updated User : ", docs);
          return res.status(200).json(docs);
        }
      }
    );
  } catch (err) {
    return res.status(401).json(err);
  }
});

//DELETE
router.delete("/deletePokemon", async (req, res) => {
  try {
    const token = getToken(req);
    const dekToken = jwt.verify(token, "pass");
    if (!token || !dekToken.id) {
      return res.status(401).json("Authentication invalid");
    }
    try {
      Pokemon.findByIdAndDelete(req.body.id, function (err, docs) {
        if (err) {
          return res.status(400).json(err);
        } else {
          return res.status(200).json(docs);
        }
      });
    } catch (err) {
      return res.status(500).json(err);
    }
  } catch (err) {
    return res.status(401).json(err);
  }
});

module.exports = router;
