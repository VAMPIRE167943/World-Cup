var express = require("express");
const Person = require("../models/person");
const { connect } = require("../mongo.js");
var router = express.Router();

// Base route: /users

// Get all users
router.get("/", async function (req, res, next)
{
  try
  {
    await connect();
    await Person.find();
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
    await connect();
    var email = req.params.email;
    var person = await Person.findOne({ email: email });
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
    await connect()
    var { email, password } = req.body;
    var person = await Person.findOne({ email: email });
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
    await connect()
    const { name, surname, email, password } = req.body;
    const newPerson = new Person({
      name: name,
      surname: surname,
      email: email,
      password: password,
    });
    await newPerson.save();
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
    await connect();
    var { email, teams } = req.body;
    var person = await Person.findOne({ email: email });
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
