// Provider SNET
const request = require("request");
const moment = require("moment-timezone");
const parseJSON = require("json-parse-async");

module.exports = {

  PROVIDER_NAME: "SNET",
  POLL_FREQUENCY: 30 * 1000, //every 30 seconds

  scoresObj: null,
  dataPollStarted: false,

  getScores: function(sport, teams, gameDate, callback) {
    
    var self = this;

    if (this.scoresObj == null) {

      //start the data poll.  Set a timer to check every second to see if the scoresObj gets populated.
      if (!this.dataPollStarted) {
        this.startDataPoll();
      }
      
      var waitForDataTimer = setInterval(function() {
        if (self.scoresObj != null) {

          clearInterval(waitForDataTimer);
          waitForDataTimer = null;

          callback(self.getLeague(sport,teams, gameDate));
        }
      }, 1000);

    } else {
      callback(self.getLeague(sport,teams, gameDate));
    }
  },

  startDataPoll: function() {

    this.dataPollStarted = true;
    this.getData();

    var self = this;
    setInterval(function() {
      self.getData();
    }, this.POLL_FREQUENCY);

  },

  getData: function() {

    // console.log("Get SNET JSON");
    var self = this;

    request({url: "http://www.sportsnet.ca/wp-content/uploads/scoreboard.json", method: "GET"}, function(r_err, response, body) {

      if(!r_err && response.statusCode == 200) {
        
        parseJSON(body, function(p_err, content) {
          if (p_err) {
            console.log( "[MMM-MyScoreboard] **  ERROR ** Couldn't parse data for provider SNET: " + p_err );       
          } else if (content.data) {
            self.scoresObj = content;
          }
        });

      } else {
        console.log( "[MMM-MyScoreboard] **  ERROR ** Couldn't retrieve data for provider SNET: " + r_err );       
      }

    });
  },

  getLeague: function(league, teams, gameDate) {

    var self = this;
    var d = moment(gameDate);

    /*
      Sportsnet's feed is subdivided by sport and then further subdivided
      into up to three arrays:
      e.g.: data.cfl.In-Progress, data.cfl.Pre-Game, data.cfl.Final
      So we'll build one array that has games from each if they match
      gameDate and the teams array if present
    */

    // In case the front end requests scores for a sport currently out of season
    if (!this.scoresObj.data[league.toLowerCase()]) {
      return [];
    }
    var leagueData = this.scoresObj.data[league.toLowerCase()];

    var filteredGames = [];

    //First iterate through in-progress games
    if (leagueData["In-Progress"]) {
      leagueData["In-Progress"].forEach(function(game) {
        if ( moment(game.date, "ddd MMM D").isSame(d, "day") && 
          (teams == null || teams.indexOf(game.home_team_short) != -1 ||
            teams.indexOf(game.visiting_team_short) != -1)) {
          filteredGames.push(game);
        }
      });
    }

    //then finished games
    if (leagueData["Final"]) {
      leagueData["Final"].forEach(function(game) {
        if ( moment(game.date, "ddd MMM D").isSame(d, "day") && 
          (teams == null || teams.indexOf(game.home_team_short) != -1 ||
            teams.indexOf(game.visiting_team_short) != -1)) {
          filteredGames.push(game);
        }
      });
    }

    //finally any scheduled games
    if (leagueData["Pre-Game"]) {
      leagueData["Pre-Game"].forEach(function(game) {
        if ( moment(game.date, "ddd MMM D").isSame(d, "day") && 
          (teams == null || teams.indexOf(game.home_team_short) != -1 ||
            teams.indexOf(game.visiting_team_short) != -1)) {
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
          //build game status.
          if (league != "MLB" &&
            game.period_status.indexOf("End of") == -1 &&
            game.period_status.indexOf("Half") == -1 ) {
  
            status.push(game.clock);          

          }
          status.push(self.formatStatus(game.period_status));

          break;
        case 2:
          status.push("Final" + self.getFinalOT(league, game));
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

  formatStatus: function(s) {
    s = s.replace("End of", "END");
    s = s.replace("Top ", "TOP ");
    s = s.replace("Bot ", "BOT ");
    s = s.replace("1st", "1<sup>ST</sup>");
    s = s.replace("2nd", "2<sup>ND</sup>");
    s = s.replace("3rd", "3<sup>RD</sup>");
    s = s.replace("4th", "4<sup>TH</sup>");
    s = s.replace("5th", "5<sup>TH</sup>");
    s = s.replace("6th", "6<sup>TH</sup>");
    s = s.replace("7th", "7<sup>TH</sup>");
    s = s.replace("8th", "8<sup>TH</sup>");
    s = s.replace("9th", "9<sup>TH</sup>");
    s = s.replace("10th", "10<sup>TH</sup>");
    s = s.replace("11th", "11<sup>TH</sup>");
    s = s.replace("12th", "12<sup>TH</sup>");
    s = s.replace("13th", "13<sup>TH</sup>");
    s = s.replace("14th", "14<sup>TH</sup>");
    s = s.replace("15th", "15<sup>TH</sup>");
    s = s.replace("16th", "16<sup>TH</sup>");
    s = s.replace("17th", "17<sup>TH</sup>");
    s = s.replace("18th", "18<sup>TH</sup>");
    s = s.replace("19th", "19<sup>TH</sup>");
    s = s.replace("20th", "20<sup>TH</sup>");
    return s;
  },

  getFinalOT: function(league, game) {
    switch (league) {
      case "NHL":
        if (game.formatted_status && game.formatted_status == "F(OT)") {
          return " (OT)";
        } else if (game.formatted_status && game.formatted_status == "F(SO)") {
          return " (SO)";
        }  else if (game.period == 4) {
          return " (OT)";
        } else if (game.period > 4) {
          return " (" + (game.period - 3) + "OT)";
        }
        break;
      case "MLB":
        if (game.period > 9) {
          return " (" + game.period + ")";
        }
        break;
      case "NFL":
      case "CFL":
      case "NBA":
        if (game.period > 4) {
          return " (OT)";
        } 
        break;
    } 
    return "";
  }

};