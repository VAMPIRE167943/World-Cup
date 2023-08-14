var express = require('express');
var router = express.Router();

// Base route: /users

// Get all users
router.get('/', async function (req, res) {
    try {
        await Person.find();
        res.json({message: "Success"});
      } catch (err) {
        console.error(err);
        res.json({ error: 'An error occurred while fetching users.' });
      }
})

// Get user details
router.get('/:userEmail', function (req, res) {

})

// Check credentials
router.post('/checkCred', function (req, res) {

})

// Registers user
router.post('/register', async function (req, res) {
    try {
        const { name, surname, email, password } = req.body;
        const newPerson = new Person({
          name: name,
          surname: surname,
          email: email,
          password: password,
        });
        await newPerson.save();
        res.json("You have given birth to a new person.");
      } catch (err) {
        console.error(err);
        res.json("Just wasn't meant to be...");
      }
})

// Assign teams
router.patch('/assignTeams', function (req, res) {

})
module.exports = router;