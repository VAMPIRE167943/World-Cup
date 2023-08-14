var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var { connect } = require("./mongo.js");
var { Person } = require("./models/person.js");

var mainRouter = require('./routes/MainRouter')
var usersRouter = require('./routes/UsersRouter')
var teamsRouter = require('./routes/TeamsRouter')

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', mainRouter);
app.use('/users', usersRouter)
app.use('/teams', teamsRouter)

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error");
});

app.listen(3000);

module.exports = app;