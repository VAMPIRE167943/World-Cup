var express = require('express');
var router = express.Router();
var { connect } = require("../mongo.js")
var Team = require("../models/teams.js");
const APITools = require('../APImodule.js');
var cron = require("node-cron");

// schedulers update results at certain times after matches
var times = ["0 10 15 * * *", "0 45 17 * * *", "0 0 20 * * *", "0 15 23 * * *"];
var schedulers = [];
times.forEach(function (time)
{
  schedulers.push(
    cron.schedule(time, function ()
    {
      const matches = APITools.getAllFixtures()
      .then(function (result) {
         
      })
      .catch(function (err){
         consol.log(err)
      })
    })
  );
});


// Base route: /teams

// Gets all teams
router.get('/', async function (req, res, next)
{
    try
    {
        await connect()
        await Team.find()
        res.status(200).json({ message: "Gottemmmm" })
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
router.get('/matches/:teamName', async function (req, res, next)
{
    try
    {
        //await connect()
      //await APITools.getFixtures(460)
      await APITools.getAllFixtures()
      res.status(200).json({yes: "yes"})
    } catch (err)
    {
        console.log(err)
        next(err)
    }
})



module.exports = router;