var express = require("express");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var { Person } = require("./models/person.js");
var cors = require("cors")
var APITools = require("./APImodule.js")
var cron = require("node-cron")
var { connect } = require("./mongo.js")

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

function matches(){
  APITools.getAllFixtures()
  .then(async function (res) {
    try{
        var birb = await connect()
        const count = await birb.collection("matches").countDocuments({})
        if(count > 0){
           await birb.collection("matches").deleteMany({})
           await birb.collection("matches").insertMany(res)
           console.log("surprise motherfucker")
         }else {
            console.log("Why are we still here, just to suffer")
            await birb.collection("matches").insertMany(res)
         }

        console.log("RESPECT++")
    }catch(err){
        console.log(err)
    }
  })
  .catch(function (err){
     console.log(err)
  })
}

matches()

var times = ["0 10 15 * * *", "0 45 17 * * *", "0 0 20 * * *", "0 15 23 * * *"];
var schedulers = [];
times.forEach(function (time)
{
  schedulers.push(
    cron.schedule(time, function ()
    {
      matches()
    })
  );
});

app.listen(3000);

module.exports = app;
