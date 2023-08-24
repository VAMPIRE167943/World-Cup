var express = require("express");
var Person = require("../models/person");
var { connect } = require("../mongo.js");
var router = express.Router();
var encrypt = require("bcrypt");

// Base route: /users

// Get all users
router.get("/", async function (req, res, next)
{
  try
  {
    var birb = await connect();
   //  var organisms = await birb.collection("people").find().sort({pts: -1, "teams." }).toArray()
   const organisms = await birb.collection("people").aggregate([
      { $unwind: '$teams' }, // Unwind the 'teams' array
      { $sort: { pts: -1, 'teams.pts': -1 } }, // Sort by pts and then by first team's pts
      { $group: { _id: '$_id', document: { $first: '$$ROOT' } } }, // Group back with first sorted document
      { $replaceRoot: { newRoot: '$document' } } // Replace the root document with sorted result
    ]).toArray();
    console.log(organisms)
    
    res.status(200).json({ message: "Gotteeeeem", names: names, teams: teams })
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
    var email = req.params.userEmail;
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
        .json({ error: "Probably playing hide and seek again..." });
    }
    // var samesame = await encrypt.compare(password, person.password)
    if (person.password !== password)
    {
      return res.status(404).json({ message: "Stranger danger!" });
    }
    res.status(200).json({ message: "Ah yes, welcome back", email: email });
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
    var hash = await encrypt.hash(password, 10)
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
    var person = await birb.collection("people").findOneAndUpdate({email: email}, { $set: { teams: teams }});
    if (!person)
    {
      return res
        .status(404)
        .json({ error: "Looks like this one was miscarried..." });
    }
    res.status(200).json({message: "Hope you were lucky"})
  } catch (err)
  {
    console.log(err);
    next(err);
  }
});

router.post("/checkTeams", async function(req, res, next){
  try{
    var { email } = req.body;
    var birb = await connect()
    var person = await birb.collection("people").findOne({ email: email });
    if (!person)
    {
      return res
        .status(404)
        .json({ message: "Probably playing hide and seek again..." });
    }
    if (person.teams.length === 0)
    {
      return res.status(404).json({ message: "No teams? Gonna cry? 🥲" });
    }
    res.status(200).json({ hasTeams: true, email: email });
  }catch(err){
    console.log(err);
    next(err);
  }
})

router.patch("/:userEmail/password", async function(req, res, next){
  try{
    var email = req.params.userEmail
    var { newPassword  } = req.body;
    var birb = await connect()
    var hash = await encrypt.hash(newPassword, 10)
    var person = await birb.collection("people").findOneAndUpdate({email: email}, { $set: { password: newPassword  }});
    if (!person)
    {
      return res
        .status(404)
        .json({ error: "Looks like this one was miscarried..." });
    }
    res.status(200).json({message: "You have ascended"})
  }catch(err){
    console.log(err)
  }
})

router.patch("/:userEmail/email", async function(req, res, next){
  try{
    var email = req.params.userEmail;
    var { newEmail } = req.body;
    var birb = await connect()
    var person = await birb.collection("people").findOneAndUpdate({email: email}, { $set: { email: newEmail }});
    if (!person)
    {
      return res
        .status(404)
        .json({ error: "Looks like this one was miscarried..." });
    }
    res.status(200).json({message: "You have ascended"})
  }catch(err){
    console.log(err)
  }
})

module.exports = router;