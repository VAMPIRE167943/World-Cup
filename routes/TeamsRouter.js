var express = require('express');
var router = express.Router();
var { connect } = require("../mongo.js")
var {Team} = require("../models/teams.js");

// Base route: /teams


// Gets all teams
router.get('/', async function (req, res, next)
{
   try
   {
      var birb = await connect()
      var teams = await birb.collection("teams").find().toArray()
      res.status(200).json({ teams: teams })
   } catch (err)
   {
      console.log(err)
      next(err)
   }
})

// Get Shortlist
router.get('/shortlist', async function (req, res, next)
{
   try
   {
      await connect()
   } catch (err)
   {
      console.log(err)
      next(err)
   }
})

// Get a specified team info
router.get('/:teamName', async function (req, res, next)
{
   try
   {
      await connect()
      var team_name = req.params.team_name
      var team = await Team.findOne({ team_name: team_name })
      if (!team)
      {
         return res.status(404).json({ error: "You sure they even exist? Cause not found..." })
      }
      res.status(200).json({ data: team, message: "Gottem!" })
   } catch (err)
   {
      console.log(err)
      next(err)
   }
})

// get matches by team
router.get('/matches/:teamID', async function (req, res, next)
{
   const specifiedTeam = Number(req.params.teamID)
   var birb = await connect()
   var totalPts = (await birb.collection("teams").findOne({_id: specifiedTeam})).pts
   (await birb.collection("matches").find({ $or: [{ 'teams.home.id': specifiedTeam }, { 'teams.away.id': specifiedTeam }] })).toArray()
   .then(function (docs)
   {
      res.status(200).json({totalPts: totalPts, matches: docs})
   })
})

// get and update scores manually
router.patch('/:matchID/scores', async function(req, res, next){
   var id = req.params.matchID
   var { homescore, awayscore } = req.body
   var birb = await connect()
   await birb.collection("matches").findOneAndUpdate({_id: id}, {$set: {"teams.home.score": homescore, "teams.away.score": awayscore}})
   res.status(200).json({message: "Admin go brrrrrrrrrrrrrrr"})
})

module.exports = router;