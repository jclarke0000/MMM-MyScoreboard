// CFL Module
const moment = require("moment-timezone");

module.exports = 
{
  name: "CFL",

  /*
    This is populated by the configure() function
  */
  teamsIdsToFollow : [],
  // apiKey : "",  

  configure: function(config) {
    this.teamsIdsToFollow = config.teams;
    // this.apiKey = config.apiKey;

    this.gameDate = null;
  },

  getUrl: function(date) {
    
    var d = moment(date);
    this.gameDate = d;

    /*
      Uses Sportsnet's scoreboard JSON endpoint
    */
    return "http://www.sportsnet.ca/wp-content/uploads/scoreboard.json";
  },

  processData: function(data) {

    var self = this;

    //expects JSON
    data = JSON.parse(data);


    /*
      Sportsnet's feed is subdivided by sport and then further subdivided
      into up to three arrays:

      e.g.: data.cfl.In-Progress, data.cfl.Pre-Game, data.cfl.Final

      So we'll build one array that has games from each if they match
      this.gameDate and this.teamsIdsToFollow
    */

    var filteredGames = [];

    //First iterate through in-progress games
    if (data.data.cfl["In-Progress"]) {
      data.data.cfl["In-Progress"].forEach(function(game) {
        if ( moment(game.date, "ddd MMM D").isSame(self.gameDate, "day") && 
          (self.teamsIdsToFollow.indexOf(game.home_team_short) != -1 ||
            self.teamsIdsToFollow.indexOf(game.visiting_team_short) != -1)) {
          filteredGames.push(game);
        }
      });
    }

    //then scheduled games
    if (data.data.cfl["Pre-Game"]) {
      data.data.cfl["Pre-Game"].forEach(function(game) {
        if ( moment(game.date, "ddd MMM D").isSame(self.gameDate, "day") && 
          (self.teamsIdsToFollow.indexOf(game.home_team_short) != -1 ||
            self.teamsIdsToFollow.indexOf(game.visiting_team_short) != -1)) {
          filteredGames.push(game);
        }
      });
    }

    //finally any finished games
    if (data.data.cfl["Final"]) {
      data.data.cfl["Final"].forEach(function(game) {
        if ( moment(game.date, "ddd MMM D").isSame(self.gameDate, "day") && 
          (self.teamsIdsToFollow.indexOf(game.home_team_short) != -1 ||
            self.teamsIdsToFollow.indexOf(game.visiting_team_short) != -1)) {
          filteredGames.push(game);
        }
      });
    }

    var formattedGames = [];

    filteredGames.forEach(function(game) {


      var gameState;
      switch(game.game_status) {
        case "Pre-Game":
          gameState = 0; //not started
          break;
        case "In-Progress":
          gameState = 1; //in-progress
          break;
        case "Final":
          gameState = 2; //final
          break;
        default:
          gameState = 0;
          break;
      }

      var status = [];
      var classes = [];

      switch(gameState) {
        case 0:
          var localTZ = moment.tz.guess();
          status.push(moment(game.time, "hh:mm a zz").tz(localTZ).format("h:mm a"));
          break;
        case 1:
          //build game clock and quater          
          status.push(game.clock);
          status.push(self.getOrdinal(game.period));
          break;
        case 2:
          status.push( "Final" + (game.period > 4 ? " (OT)" : "") );
          break;
      }

      var formattedGame = {
        classes: classes,
        gameMode: gameState,
        hTeam: game.home_team_short,
        vTeam: game.visiting_team_short,
        hTeamLong: game.home_team,
        vTeamLong: game.visiting_team,
        hScore: game.home_score,
        vScore: game.visiting_score,
        status: status
      };

      formattedGames.push(formattedGame);
    });


    return formattedGames;
  },

  getOrdinal: function(quarter) {

    switch(quarter) {
      case 1:
        return "1<sup>ST</sup>";
      case 2:
        return "2<sup>ND</sup>";
      case 3:
        return "3<sup>RD</sup>";
      case 4:
        return "4<sup>TH</sup>";
      case 5:
        return "OT";
      default:
        return quarter;
    }
  }

};