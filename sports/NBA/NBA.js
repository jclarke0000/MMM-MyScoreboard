// Module for NBA scores
const moment = require('moment-timezone');

module.exports = 
{

  name: "NBA",

  teamsToFollow:[],

  configure: function(teams) {
    this.teamsToFollow = teams;
  },

  getUrl: function(date) {
    var url = "http://data.nba.com/5s/json/cms/noseason/scoreboard/" + 
      moment(date).format('YYYYMMDD') + "/games.json";

    return url;
  },
  
  processData: function(data) {

    var self = this;
    var formattedGamesList = new Array();

    if (data.sports_content.games.game) {

      data.sports_content.games.game.forEach(function(game) {

        if (self.teamsToFollow.indexOf(game.home.team_key) != -1 ||
          self.teamsToFollow.indexOf(game.visitor.team_key) != -1) {

            var gameState = Number(game.period_time.game_status) - 1;

            var stattus = '';
            switch (gameState) {
              case 0: //future
                var localTZ = moment.tz.guess();             
                var gameTimeString = game.date + game.time;
                status = moment.tz(gameTimeString, 'YYYYMMDDHHmm', 'America/Toronto').tz(localTZ).format('h:mm a');
                break;
              case 1: //in progress

                if (Number(game.period_time.game_clock) == 0 || 
                  game.period_time.period_status.indexOf("Start") != -1 || 
                  game.period_time.period_status.indexOf("Tip") != -1  || 
                  game.period_time.period_status.indexOf("Halftime") != -1) {
                    status = game.period_time.period_status;
                } else {                    
                  status = game.period_time.game_clock + 
                    (game.period_time.game_clock.indexOf(".") != -1 ? "s": "") +
                    " " + game.period_time.period_status;
                }

                status = status.replace(" Qtr", "");
                status = status.replace("of ", "");
                status = status.replace("End", "END");
                status = status.replace("Start", "START");
                status = status.replace("Halftime", "HALFTIME");
                status = status.replace("1st", "1<sup>ST</sup>");
                status = status.replace("2nd", "2<sup>ND</sup>");
                status = status.replace("3rd", "3<sup>RD</sup>");
                status = status.replace("4th", "4<sup>TH</sup>");
                break;
              case 2: //final
                status = game.period_time.period_status;
                break;
            }

            formattedGamesList.push({
              gameMode: gameState,
              hTeam: game.home.team_key,
              vTeam: game.visitor.team_key,
              hScore: game.home.score == '' ? "0" : game.home.score,
              vScore: game.visitor.score == '' ? "0" : game.visitor.score,
              status: status

            });
          
        }

      });

    }

    return formattedGamesList;

  }

}
