var express = require("express");
var Person = require("../models/person");
var { connect } = require("../mongo.js");
var router = express.Router();

// Base route: /users

// Get all users
router.get("/", async function (req, res, next)
{
  try
  {
    var birb = await connect();
    await birb.collection("people").find();
    res.status(200).json({ message: "Gotteeeeem" });
  } catch (err)
  {
    console.error(err);
    next(err);
  }
});

// Get user details
router.get("/:userEmail", async function (req, res, next)
{
  try
  {
    var email = req.params.email;
    var birb = await connect();
    var person = await birb.collection("people").findOne({ email: email });
    if (!person)
    {
      return res
        .status(404)
        .json({ error: "Looks like this one was miscarried..." });
    }
    res.status(200).json({ data: person, message: "Gottem!" });
  } catch (err)
  {
    console.log(err);
    next(err);
  }
});

// Check credentials
router.post("/checkCred", async function (req, res, next)
{
  try
  {
    var { email, password } = req.body;
    var birb = await connect()
    var person = await birb.collection("people").findOne({ email: email });
    if (!person)
    {
      return res
        .status(404)
        .json({ message: "Probably playing hide and seek again..." });
    }
    if (person.password !== password)
    {
      return res.status(404).json({ message: "Stranger danger!" });
    }
    res.status(200).json({ message: "Ah yes, welcome back" });
  } catch (err)
  {
    console.log(err);
    next(err);
  }
});

// Registers user
router.post("/register", async function (req, res, next)
{
  try
  {
    var { name, surname, email, password } = req.body;
    var newPerson = new Person({
      name: name,
      surname: surname,
      email: email,
      password: password,
    });
    var birb = await connect()
    await birb.collection("people").insertOne(newPerson)
    res.status(201).json({ message: "You have given birth to a new person." });
  } catch (err)
  {
    console.error(err);
    next(err);
  }
});

// Assign teams
router.patch("/assignTeams", async function (req, res, next)
{
  try
  {
    var { email, teams } = req.body;
    var birb = await connect();
    var person = await birb.collection("people").findOne({ email: email });
    if (!person)
    {
      return res
        .status(404)
        .json({ error: "Looks like this one was miscarried..." });
    }
    person.teams = teams;
  } catch (err)
  {
    console.log(err);
    next(err);
  }
});
module.exports = router;
