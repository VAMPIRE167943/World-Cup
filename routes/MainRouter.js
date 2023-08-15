var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next)
{
  res.send("No no you don't belong here, shoo shoo")
});

module.exports = router;