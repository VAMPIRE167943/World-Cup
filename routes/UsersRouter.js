var express = require('express');
var router = express.Router();

// Base route: /users

// Get All users
router.get('/', async function (req, res) {
    try {
        await Person.find();
        res.json({message: "Success"});
      } catch (err) {
        console.error(err);
        res.json({ error: 'An error occurred while fetching users.' });
      }
})

// Get User details
router.get('/:userEmail', function (req, res) {

})

// Check credentials
router.post('/checkCred', function (req, res) {

})

// Registers user
router.post('/register', function (req, res) {

})

// Assign teams
router.patch('/assignTeams', function (req, res) {

})
module.exports = router;