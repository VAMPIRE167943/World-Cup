var express = require('express');
var router = express.Router();

// Base route: /teams

// Gets all teams
router.get('/', function (req, res) {

})

// Get Shortlist
router.get('/shortlist', function () {

})

// Get a specified team info
router.get('/:teamName', function (req, res) {

})

// get matches by team
router.get('/matches/:teamName', function (req, res) {

})

module.exports = router;