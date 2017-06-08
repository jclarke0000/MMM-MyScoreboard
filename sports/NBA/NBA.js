// Module for NBA scores
const moment = require('moment-timezone');

module.exports = 
{

  name: "NBA",

  teamsToFollow:[],

  configure: function(config) {
    this.teamsToFollow = config.teams;
  },

  getUrl: function(date) {
    var url = "http://data.nba.com/5s/json/cms/noseason/scoreboard/" + 
      moment(date).format('YYYYMMDD') + "/games.json";

    return url;
  },
  
  processData: function(data) {

    //expects JSON
    data = JSON.parse(data);

    var self = this;
    var formattedGamesList = new Array();

    if (data.sports_content.games.game) {

      data.sports_content.games.game.forEach(function(game) {

        if (self.teamsToFollow.indexOf(game.home.team_key) != -1 ||
          self.teamsToFollow.indexOf(game.visitor.team_key) != -1) {

            var gameState = Number(game.period_time.game_status) - 1;

            var status = [];
            var classes = [];

            switch (gameState) {
              case 0: //future
                var localTZ = moment.tz.guess();             
                var gameTimeString = game.date + game.time;
                status.push(moment.tz(gameTimeString, 'YYYYMMDDHHmm', 'America/Toronto').tz(localTZ).format('h:mm a'));
                break;
              case 1: //in progress

                var periodStatus = game.period_time.period_status;
                periodStatus = periodStatus.replace(" Qtr", "");
                periodStatus = periodStatus.replace("of ", "");
                periodStatus = periodStatus.replace("End", "END");
                periodStatus = periodStatus.replace("Start", "START");
                periodStatus = periodStatus.replace("Halftime", "HALFTIME");
                periodStatus = periodStatus.replace("1st", "1<sup>ST</sup>");
                periodStatus = periodStatus.replace("2nd", "2<sup>ND</sup>");
                periodStatus = periodStatus.replace("3rd", "3<sup>RD</sup>");
                periodStatus = periodStatus.replace("4th", "4<sup>TH</sup>");
                
                if (Number(game.period_time.game_clock) == 0 || 
                  game.period_time.period_status.indexOf("Start") != -1 || 
                  game.period_time.period_status.indexOf("Tip") != -1  || 
                  game.period_time.period_status.indexOf("Halftime") != -1) {
                    status.push(periodStatus);
                } else {                    
                  status.push(game.period_time.game_clock + (game.period_time.game_clock.indexOf(".") != -1 ? "s": ""));
                  status.push(periodStatus);
                }

                break;
              case 2: //final
                status.push(game.period_time.period_status);
                break;
            }

            formattedGamesList.push({
              gameMode: gameState,
              classes: classes,
              hTeam: game.home.team_key,
              vTeam: game.visitor.team_key,
              hTeamLong: game.home.nickname,
              vTeamLong: game.visitor.nickname,                            
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
