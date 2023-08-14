var express = require('express');
var router = express.Router();

router.get('/', function (req, res, next)
{
  console.log("it works")
  res.send("Wc-back")
});

module.exports = router;