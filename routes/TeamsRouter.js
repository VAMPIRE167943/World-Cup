var express = require('express');
var router = express.Router();
var { connect } = require("../mongo.js")
var { Team } = require("../models/teams.js");

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
   var totalPts = (await birb.collection("teams").findOne({ _id: specifiedTeam })).pts
   console.log(totalPts)
      (await birb.collection("matches").find({ $or: [{ 'teams.home.id': specifiedTeam }, { 'teams.away.id': specifiedTeam }] })).toArray()
      .then(function (docs)
      {
         res.status(200).json({ totalPts: totalPts, matches: docs })
      })
})

// get and update scores manually
router.patch('/:matchID/scores', async function (req, res, next)
{
   try
   {
      var id = Number(req.params.matchID)
      var homescore = Number(req.body.homescore)
      var awayscore = Number(req.body.awayscore)
      var birb = await connect()
      var { homePts, awayPts } = calcPoints(homescore, awayscore)
      await birb.collection("matches").findOneAndUpdate({ _id: id }, { $set: { "teams.home.score": homescore, "teams.away.score": awayscore, "teams.home.pts": homePts, "teams.away.pts": awayPts, "status": "FT" } })
      recalc()
      res.status(200).json({ message: "Admin go brrrrrrrrrrrrrrr" })
   } catch (error)
   {
      console.log(error)
   }

})


function calcPoints(homeScore, awayScore)
{

   var homePts = 0
   var awayPts = 0
   if (homeScore > awayScore)
   {
      homePts += 3
   } else if (homeScore == awayScore)
   {
      homePts += 1
      awayPts += 1
   } else
   {
      awayPts += 3
   }

   if ((homeScore - awayScore) > 20)
   {
      homePts += 2
      awayPts -= 2
   } else if ((awayScore - homeScore) > 20)
   {
      awayPts += 2
      homePts -= 2
   }

   return { homePts, awayPts }
}

async function recalc()
{
   var birb = await connect()
   var matches = await (await birb.collection('matches').find()).toArray()
   var teamList = await (await birb.collection('teams').find()).toArray()
   teamList.forEach((team, index, array) =>
   {
      var totalPoints = 0
      matches.forEach(match =>
      {
         if (match.teams.home.id == team._id)
         {
            totalPoints += match.teams.home.pts
         } else if (match.teams.away.id == team._id)
         {
            totalPoints += match.teams.away.pts
         }
      })
      teamList[index]['pts'] = totalPoints
   })

   birb.collection("teams").drop()
   birb.collection("teams").insertMany(teamList)

   var users = await birb.collection("people").find().toArray()
   users.forEach(async (details) =>
   {
      var pts = 0
      details.teams.forEach((team) =>
      {
         try
         {
            const selectedTeam = birb.collection("teams").findOne({ _id: team.id })
            pts += selectedTeam.pts
         } catch (error)
         {
         }
      })
      await birb.collection("people").findOneAndUpdate({ email: details.email }, { $set: { pts: pts } })
   })
}

module.exports = router;