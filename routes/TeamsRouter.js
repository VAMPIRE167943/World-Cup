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


// get matches by team
router.get('/matches/:teamID', async function (req, res, next)
{
   const specifiedTeam = Number(req.params.teamID)
   var birb = await connect()
   var totalPts = (await birb.collection("teams").findOne({ _id: specifiedTeam })).pts
   console.log(totalPts)
   const team = (await birb.collection("matches").find({ $or: [{ 'teams.home.id': specifiedTeam }, { 'teams.away.id': specifiedTeam }] })).toArray()

   team.then(function (docs)
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
   try {
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

   await birb.collection("teams").drop()
   await birb.collection("teams").insertMany(teamList)

   var users = await birb.collection("people").find().toArray()
   const allTeams =  await birb.collection("teams").find().toArray()
   users.forEach(async (details) =>
   {
      var newConn = await connect()
      var selectedTeams = []
      var selectedIds = []
      details.teams.forEach((team) =>
      {
         selectedTeams.push(team)
         selectedIds.push(team.id)
      })

      var pts = 0
      details.teams.forEach( (team, index) =>
      {

         allTeams.forEach((dbTeam) => {

            if(dbTeam._id == team.id){
               selectedTeams[index]["pts"] = dbTeam.pts
               pts += dbTeam.pts
            }

         })

      })
      console.log(pts)
      await newConn.collection("people").findOneAndUpdate({ email: details.email }, { $set: { pts: pts, teams: selectedTeams } })
   })
   } catch (error) {
      console.log(error)
   }

}

module.exports = router;