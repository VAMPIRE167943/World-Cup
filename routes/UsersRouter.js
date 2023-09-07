var express = require("express");
var Person = require("../models/person");
var { connect } = require("../mongo.js");
var router = express.Router();
var encrypt = require("bcrypt");

// Base route: /users

// Get all users
router.get("/", async function (req, res, next) {
   try {
      var birb = await connect();
      const users = await birb.collection("people").aggregate([
         {
            $sort: {
               pts: -1,
               "teams.0.pts": -1
            }
         }
      ]).toArray();

      res.status(200).json({ users })
   } catch (err) {
      console.error(err);
      next(err);
   }
});

// Get user details
router.get("/:userEmail", async function (req, res, next) {
   try {
      var rank = 0
      var email = req.params.userEmail;
      var birb = await connect();
      const users = await birb.collection("people").aggregate([
         {
            $sort: {
               pts: -1,
               "teams.0.pts": -1
            }
         }
      ]).toArray();

      users.forEach((user, index) => {
         if (user.email == email) {
            rank = index + 1
         }
      })
      var person = await birb.collection("people").findOne({ email: email });
      if (!person) {
         return res
            .status(404)
            .json({ error: "Looks like this one was miscarried..." });
      }
      res.status(200).json({ data: person, rank, message: "Gottem!" });
   } catch (err) {
      console.log(err);
      next(err);
   }
});

// Check credentials
router.post("/checkCred", async function (req, res, next) {
   try {
      var { email, password, selectedleague } = req.body;
      var birb = await connect()
      var person = await birb.collection("people").findOne({ email: email });
      if (!person) {
         return res
            .status(404)
            .json({ error: "Probably playing hide and seek again..." });
      }
      if (person.password !== password) {
         return res.status(404).json({ message: "Stranger danger!" });
      }
      if (!person.leagues.includes(selectedleague)) {
         return res.status(403).json({ error: "Get the hell outta here, you don't belong there fam" })
      }
      res.status(200).json({ message: "Ah yes, welcome back", email: email });
   } catch (err) {
      console.log(err);
      next(err);
   }
});

// Registers user
router.post("/register", async function (req, res, next) {
   try {
      var { name, surname, email, password, selectedleague } = req.body;
      var birb = await connect()
      var birth = await birb.collection("people").findOne({
         email: email
      })
      if (birth) {
         await birb.collection("people").updateOne({email: email}, {$addToSet: {leagues: selectedleague}})
         return res.status(200).json({ message: "U... R... Adopted..." })
      }
      var person = {
         name: name,
         surname: surname,
         email: email,
         password: password,
         leagues: [selectedleague],
         teams: []
      }
      await birb.collection("people").insertOne(person)
      res.status(201).json({ message: "You have given birth to a new person." });
   } catch (err) {
      console.error(err);
      next(err);
   }
});

// Assign teams
router.patch("/assignTeams", async function (req, res, next) {
   try {
      var { email, teams } = req.body;
      var birb = await connect();
      var person = await birb.collection("people").findOneAndUpdate({ email: email }, { $set: { teams: teams } });
      var newConn = await connect()
      var selectedTeams = []
      var selectedIds = []
      teams.forEach((team) => {
         selectedTeams.push(team)
         selectedIds.push(team.id)
      })

      const allTeams = await newConn.collection("teams").find().toArray()
      var pts = 0
      teams.forEach((team, index) => {
         allTeams.forEach((dbTeam) => {
            if (dbTeam._id == team.id) {
               selectedTeams[index]["pts"] = (dbTeam.pts == undefined) ? 0 : dbTeam.pts
               pts += (dbTeam.pts == undefined) ? 0 : dbTeam.pts
            }

         })

      })
      console.log(pts)
      await newConn.collection("people").findOneAndUpdate({ email: email }, { $set: { pts: pts, teams: selectedTeams } })
      if (!person) {
         return res
            .status(404)
            .json({ error: "Looks like this one was miscarried..." });
      }
      res.status(200).json({ message: "Hope you were lucky" })
   } catch (err) {
      console.log(err);
      next(err);
   }
});

router.post("/checkTeams", async function (req, res, next) {
   try {
      var { email } = req.body;
      var birb = await connect()
      var person = await birb.collection("people").findOne({ email: email });
      if (!person) {
         return res
            .status(404)
            .json({ message: "Probably playing hide and seek again..." });
      }
      if (person.teams.length === 0) {
         return res.status(404).json({ hasTeams: false, message: "No teams? Gonna cry? 🥲" });
      }
      res.status(200).json({ hasTeams: true, email: email });
   } catch (err) {
      console.log(err);
      next(err);
   }
})

router.patch("/:userEmail/password", async function (req, res, next) {
   try {
      var email = req.params.userEmail
      var { newPassword } = req.body;
      var birb = await connect()
      var hash = await encrypt.hash(newPassword, 10)
      var person = await birb.collection("people").findOneAndUpdate({ email: email }, { $set: { password: newPassword } });
      if (!person) {
         return res
            .status(404)
            .json({ error: "Looks like this one was miscarried..." });
      }
      res.status(200).json({ message: "You have ascended" })
   } catch (err) {
      console.log(err)
   }
})

router.patch("/:userEmail/email", async function (req, res, next) {
   try {
      var email = req.params.userEmail;
      var { newEmail } = req.body;
      var birb = await connect()
      var person = await birb.collection("people").findOneAndUpdate({ email: email }, { $set: { email: newEmail } });
      if (!person) {
         return res
            .status(404)
            .json({ error: "Looks like this one was miscarried..." });
      }
      res.status(200).json({ message: "You have ascended" })
   } catch (err) {
      console.log(err)
   }
})

module.exports = router;