# Sintrex-world-cup-back

NB! Please run `npm install` before running Node (Especially if package.json is changed, indicating deleted or installed packages)

## Routes Table
| Name | Description | Relative URL |
|----------|-----------------------------|------------------------|
base route | This is just a base route, it can be used as a wrapper or to test whether the server is online. | /
**TEAMS**
Get all teams | This retrieves all teams along with details | /teams (GET)
Get Shortlist | This retrieves a list of teams, code and their Tier | /teams/shortlist (GET)
Get Specified team | This retrieves a specific team's details | /teams/:teamName (GET)
Get Matches by team | This retrieves all matches past and future by team | /matches/:teamName (GET)
**USERS**
Get all users | This retrieves all users along with their details | /users (GET)
Get User details | This retrieves users details | /users/:userEmail (GET)
Check credentials | This checks entered credentials when logging in | /users/checkCred (POST)
Register user | This registers user to database | /users/register (POST)
Assign teams | This saves assigned teams to database for a specific user | /users/assignTeams(PATCH)

### Match update Scheduler

The scheduler uses CRON to update match results approximately after a match ends. <br>
Update times: **3:10 pm**, **5:45 pm**, **8:00 pm**, **11:15 pm**

```javascript
var times = ['0 10 15 * * *', '0 45 17 * * *', '0 0 20 * * *', '0 15 23 * * *']
var schedulers = []
times.forEach(function (time) {
   schedulers.push(cron.schedule(time, function () {
      updateMatches()
      .then(function (result) {
         // to be added
      })
      .catch(function (err) {
         // To be added
      })
   }))
})
```
Times are set in an array of CRON strings.
A `forEach` is used to create schedulers and is stored in another array. When a specified time is reached. The API is called and its results are stored to the database.
