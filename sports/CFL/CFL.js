// CFL Module
const moment = require('moment-timezone');

module.exports = 
{
  name: "CFL",

  /*
    This is populated by the configure() function
  */
  teamsIdsToFollow : [],
  apiKey : "",  

  configure: function(config) {
    this.teamsIdsToFollow = config.teams;
    this.apiKey = config.apiKey;

    this.gameDate = null;
  },

  getUrl: function(date) {
    
    var d = moment(date);
    this.gameDate = d;
    var tomorrow = moment(date).add(1, 'day');

    var builtURL = 'http://api.cfl.ca/v1/games/' + d.format('YYYY') + 
      '?key=' + this.apiKey;

      /*
        I have not been able to get filters working as I expect them do according
        to the API docs here: http://api.cfl.ca/docs.

        So for now we'll retrieve the entire season with each request and filter
        on our side in the processData() routine.  The amount of data retrieved isn't
        too large, so this should be acceptable right now.
      */

      // '&filter[team][in]=' + this.teamsIdsToFollow.join(",") +
      // '&filter[date_start][ge]=' + d.format('YYYY-MM-DD') + 'T00:00:00-04:00' + 
      // '&filter[date_start][lt]=' + tomorrow.format('YYYY-MM-DD') + 'T00:00:00-04:00';

    // console.log("CFL URL: " + builtURL);

    return builtURL;
  },

  processData: function(data) {

    var self = this;

    //expects JSON
    data = JSON.parse(data);


    /*
      filter to today's games featuring the teams in teamsToFollow.
      This is only temporary until I can figure out how to make the
      filters in the CFL API to work.
    */
    var filteredGames = data.data.filter(function (game) {
      return moment(game.date_start).isSame(self.gameDate, 'day') &&
        (self.teamsIdsToFollow.indexOf(game.team_1.abbreviation) != -1 ||
          self.teamsIdsToFollow.indexOf(game.team_2.abbreviation) != -1);
    });


    var formattedGames = [];

    filteredGames.forEach(function(game) {


      var gameState;
      switch(game.event_status.event_status_id) {
        case 1:
          gameState = 0; //not started
          break;
        case 2:
          gameState = 1; //in-progress
          break;
        case 4:
          gameState = 3; //final
          break;
        case 9: //cancelled
          gameState = 0; //we'll handle this special below
      }

      var status = [];
      var classes = [];

      switch(gameState) {
        case 0:
          if (game.event_status.event_status_id == 9) {
            status.push("Cancelled");
            classes.push("cancelled"); //in case want to style this differently
          } else {
            var localTZ = moment.tz.guess();
            status.push(moment(game.date_start).tz(localTZ).format('h:mm a'));
          }
          break;
        case 1:
          //build game clock and quater          
          status.push(game.event_status.minutes + ":" + (game.event_status.seconds > 9 ? "0" + game.event_status.seconds : game.event_status.seconds));
          status.push(self.getOrdinal(game.event_status.quarter));
          break;
        case 3:
          status.push(game.event_status.name);
          break;
      }



      formattedGame = {
        classes: classes,
        gameMode: gameState,
        hTeam: game.team_2.abbreviation,
        vTeam: game.team_1.abbreviation,
        hTeamLong: game.team_2.nickname,
        vTeamLong: game.team_1.nickname,
        hScore: game.team_2.score,
        vScore: game.team_1.score,
        status: status

      }

      formattedGames.push(formattedGame);
    });


    return formattedGames;
  },

  getOrdinal: function(quarter) {

    switch(quarter) {
      case 1:
        return "1<sup>ST</sup>";
        break;
      case 2:
        return "2<sup>ND</sup>";
        break;
      case 3:
        return "3<sup>RD</sup>";
        break;
      case 4:
        return "4<sup>TH</sup>";
        break;
      default:
        return quarter;
    }
  }

}