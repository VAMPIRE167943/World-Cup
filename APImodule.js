process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var moment = require('moment')

var myHeaders = new Headers();
myHeaders.append("x-rapidapi-key", "bf7371dddab41bef8854e3a86e5f55c6");
myHeaders.append("x-rapidapi-host", "v1.rugby.api-sports.io");

const leagueNum = 69
const seasonNum = 2023

var requestOptions = {
   method: 'GET',
   headers: myHeaders,
   redirect: 'follow',
};

var APITools = {
   getAllFixtures: async function ()
   {
      var matches = [singleTeamMatches.prototype]

      const response = (await fetch(`https://v1.rugby.api-sports.io/games?league=${leagueNum}&season=${seasonNum}`, requestOptions)).json()
      const results = await response
      matches = []
      results.response.forEach(element =>
      {
         if (moment(element.date).isAfter("2023-09-06"))
         {
            matches.push(new singleTeamMatches(element))
         }
      });
      return matches
   },
}

class singleTeamMatches
{
   constructor(result)
   {
      this._id = result.id
      this.date = result.date
      this.time = result.time
      this.status = result.status.short
      this.teams = {
         home: {
            id: result.teams.home.id,
            name: result.teams.home.name,
            score: result.scores.home,
            pts: 0
         },
         away: {
            id: result.teams.away.id,
            name: result.teams.away.name,
            score: result.scores.away,
            pts: 0
         },

      }
      this.calcPoints()
   }
   isFixture(status)
   {
      switch (status)
      {
         case "NS" || "POST":
            return true;
            break
         case "1H" || "2H" || "HT" || "ET" || "BT" || "PT" || "INTR" || "AWA" || "AET" || "FT":
            return false
            break;
      }
   }
   calcPoints()
   {
      if (this.isFixture(this.status) == undefined || this.isFixture(this.status) == false)
      {
         var home = 0
         var away = 0
         if (this.teams.home.score > this.teams.away.score)
         {
            home += 3
         } else if (this.teams.home.score == this.teams.away.score)
         {
            home += 1
            away += 1
         } else
         {
            away += 3
         }

         if ((this.teams.home.score - this.teams.away.score) > 20)
         {
            home += 2
            away -= 2
         } else if ((this.teams.away.score - this.teams.home.score) > 20)
         {
            away += 2
            home -= 2
         }
         this.teams.home.pts = home
         this.teams.away.pts = away
      }
   }
}



module.exports = APITools