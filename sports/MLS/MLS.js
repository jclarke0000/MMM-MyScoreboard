const moment = require('moment-timezone');

module.exports = 
{

  name: "MLS",

  teamsToFollow:[],

  configure: function(config) {
    this.teamsToFollow = config.teams;
  },

  getUrl: function(date) {

    var url = "http://site.api.espn.com/apis/site/v2/sports/soccer/usa.1/scoreboard?dates=" + 
      moment(date).format("YYYYMMDD") + "&limit=100";

    return url;
  },

  formatHalf: function(q) {
    switch (q) {
      case 1:
        return q + "<sup>ST</sup>";
      case 2:
        return q + "<sup>ND</sup>";
      default:
        return q;
    }
  },

  processData: function(data) {

    //expects JSON
    data = JSON.parse(data);

    var self = this;
    var formattedGamesList = new Array();
    var localTZ = moment.tz.guess();

    //filter to teams in this.teamsToFollow
    var filteredGamesList = data.events.filter(function(game) {
      return self.teamsToFollow.indexOf(game.competitions[0].competitors[0].team.abbreviation) != -1 || self.teamsToFollow.indexOf(game.competitions[0].competitors[1].team.abbreviation) != -1;
    });

    //iterate through games and construct formattedGamesList
    filteredGamesList.forEach(function(game) {

      var status = [];
      var classes = [];

      var gameState = 0;

      switch (game.status.type.id) {
        case "1": //scheduled
          gameState = 0;
          status.push(moment(game.competitions[0].date).tz(localTZ).format("h:mm a"));
          break;
        case "23":
          gameState = 1;
          status.push("HALFTIME");
          break;
        case "24":
          gameState = 1;
          status.push("OT");
          break;
        case "25": //first half
        case "26": //second half
          gameState = 1;
          status.push(game.status.displayClock);
          status.push(self.formatHalf(game.status.period));
          break;
        case "28":
          gameState = 2;
          status.push("Full Time");
          break;
        case "7":
        case "17":
          gameState = 1;
          classes.push["delay"];
          status.push("Delay");
          break;
        default:
          gameState = 2;
          status.push(game.status.type.description);
      }


      var hTeamData = game.competitions[0].competitors[0];
      var vTeamData = game.competitions[0].competitors[1];

      /*
        Looks like the home team is always the first in the feed, but it also specifies,
        so we can be sure.
      */
      if (hTeamData.homeAway == "away") {
        hTeamData = game.competitions[0].competitors[1];
        vTeamData = game.competitions[0].competitors[0];
      }

      formattedGamesList.push({
        gameMode: gameState,
        classes: classes,
        hTeam: hTeamData.team.abbreviation,
        vTeam: vTeamData.team.abbreviation,
        hTeamLong: hTeamData.team.shortDisplayName,
        vTeamLong: vTeamData.team.shortDisplayName,                    
        hScore: hTeamData.score,
        vScore: vTeamData.score,
        status: status
      });

    });

    return formattedGamesList;

  },

/*
  0 - TBD   
  1 - SCHEDULED   
  2 - IN PROGRESS   
  3 - FINAL   
  4 - FORFEIT   
  5 - CANCELLED   
  6 - POSTPONED   
  7 - DELAYED   
  8 - SUSPENDED   
  9 - FORFEIT OF HOME TEAM    
  10 - FORFEIT OF AWAY TEAM   
  17 - RAIN DELAY   
  21 - BEGINNING OF PERIOD    
  22 - END OF PERIOD    
  23 - HALFTIME   
  24 - OVERTIME   
  25 - FIRST HALF   
  26 - SECOND HALF    
  27 - ABANDONED    
  28 - FULL TIME    
  29 - RESCHEDULED    
  30 - START LIST   
  31 - INTERMEDIATE   
  32 - UNOFFICIAL   
  33 - MEDAL OFFICIAL   
  34 - GROUPINGS OFFICIAL   
  35 - PLAY COMPLETE    
  36 - OFFICIAL - EVENT SHORTENED   
  37 - CORRECTED RESULT   
  38 - RETIRED    
  39 - BYE    
  40 - WALKOVER   
  41 - VOID   
  42 - PRELIMINARY    
  43 - GOLDEN TIME    
  44 - SHOOTOUT   
  45 - FINAL SCORE - AFTER EXTRA TIME   
  46 - FINAL SCORE - AFTER GOLDEN GOAL    
  47 - FINAL SCORE - AFTER PENALTIES    
  48 - END EXTRA TIME   
  49 - EXTRA TIME HALF TIME   
  50 - FIXTURE - NO LIVE COVERAGE   
  51 - FINAL SCORE - ABANDONED
*/



};