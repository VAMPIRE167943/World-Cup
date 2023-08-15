var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cron = require("node-cron");
var { connect, updateMatches } = require("./mongo.js");
var { Person } = require("./models/person.js");
var cors = require("cors")

var mainRouter = require("./routes/MainRouter");
var usersRouter = require("./routes/UsersRouter");
var teamsRouter = require("./routes/TeamsRouter");

var app = express();

app.use(cors())
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/", mainRouter);
app.use("/users", usersRouter);
app.use("/teams", teamsRouter);

app.use(function (err, req, res, next)
{
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send("error");
});

// schedulers update results at certain times after matches
var times = ["0 10 15 * * *", "0 45 17 * * *", "0 0 20 * * *", "0 15 23 * * *"];
var schedulers = [];
times.forEach(function (time)
{
  schedulers.push(
    cron.schedule(time, function ()
    {
      updateMatches()
        .then(function (result) { })
        .catch(function (err) { });
    })
  );
});

app.listen(3000);

module.exports = app;
