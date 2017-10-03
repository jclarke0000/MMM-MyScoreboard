/*

  -------------------------------------
    Provider for Sportsnet Scoreboard
  -------------------------------------

  Provides scores for
    NHL (National Hockey League)
    NFL (National Football League)
    NBA (National Basketball Association)
    CFL (Canadian Football League)
    MLS (Major League Soccer)
    MLB (Major League Baseball)

  Data feed also provides data for other
  leagues, not currently supported:
    EPL (European Premier League Soccer)
    CHLG (European Champion's League Soccer)


  All sports are provided in a single feed at
  http://www.sportsnet.ca/wp-content/uploads/scoreboard.json

  The feed takes no parameters. It returns all of today's games,
  yesterday's finals up until noon Eastern time, and upcoming
  games 1-2 days into the future.

  Sportsnet's Scoreboard feed is free and clear, so please
  do not modify this to hammer the API with a flood of calls.
  Doing so may trigger Sportsnet to lock down the API.

  Since this feed gets all the sports at once, the data
  feed works independent of the front end's poll for
  score updates.  Polling for scores is kicked off the
  first time the front end asks for data, but after that,
  this module will keep a local data object up to date.
  Subsequent requests from the front end will be queried
  against this data object.

*/

const request = require("request");
const moment = require("moment-timezone");
const parseJSON = require("json-parse-async");

module.exports = {

  PROVIDER_NAME: "SNET",

  /*
    Please don't make this any more frequent.  If you have a
    browser open to Sportsnet.ca, this feed gets pinged every
    10 seconds.  Keeping ours to every minute should keep us
    under the radar, but will still give us timely information.
    In any case, the front end asks for data every 2 minutes,
    so making this any more frequent doesn't change anything.
  */
  POLL_FREQUENCY: 60 * 1000, //every minute.

  scoresObj: null,
  dataPollStarted: false,

  getScores: function(league, teams, gameDate, callback) {
    
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

          callback(self.getLeague(league, teams, gameDate));
        }
      }, 1000);

    } else {
      callback(self.getLeague(league, teams, gameDate));
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
            console.log( "[MMM-MyScoreboard] " + moment().format("D-MMM-YY HH:mm") + " ** ERROR ** Couldn't parse data for provider SNET: " + p_err );       
          } else if (content.data) {
            self.scoresObj = content;
          }
        });

      } else {
        console.log( "[MMM-MyScoreboard] " + moment().format("D-MMM-YY HH:mm") + " ** ERROR ** Couldn't retrieve data for provider SNET: " + r_err );       
      }

    });
  },

  filterGames: function(obj, leagueData, addToArray, teams, gameDate) {

    if (leagueData[obj]) {
      leagueData[obj].forEach(function(game) {
        if ( moment(game.date, "ddd MMM D").isSame(gameDate, "day") && 
          (teams == null || teams.indexOf(game.home_team_short) != -1 ||
            teams.indexOf(game.visiting_team_short) != -1)) {
          addToArray.push(game);
        }
      });
    }

  },

  getLeague: function(league, teams, gameDate) {

    var self = this;
    var d = moment(gameDate);

    // In case the front end requests scores for a supported league currently out of season
    if (!this.scoresObj.data[league.toLowerCase()]) {
      return [];
    }

    /*
      Sportsnet's feed is subdivided by league and then further subdivided
      into a number of different arrays

      So we'll build one array that has games from each if they match
      the game date and the teams array if present
    */
    var leagueData = this.scoresObj.data[league.toLowerCase()];

    var snetGameObjects = [
      "Pre-Game",
      "In-Progress",
      "Half-Over",
      "Final",
      "Delayed"
    ];

    var filteredGames = [];

    snetGameObjects.forEach(function(obj) {
      self.filterGames(obj, leagueData, filteredGames, teams, d);
    });


    /*
      now sort the array by start time so that the games always appear
      in the same order regardless of status.  Sort it first by start
      time, then by visting team short code.
    */

    filteredGames.sort(function(a,b) {
      var aTime = moment(a.time, "hh:mm a zz");
      var bTime = moment(b.time, "hh:mm a zz");

      //first sort by start time
      if (aTime.isBefore(bTime)) {
        return -1;
      }
      if (aTime.isAfter(bTime)) {
        return 1;
      }

      //start times are the same.  Now sort by team short codes
      if (a.visiting_team_short < b.visiting_team_short) {
        return -1;
      }
      if (a.visiting_team_short > b.visiting_team_short) {
        return 1;
      }

      return 0;

    });

    var formattedGames = [];

    filteredGames.forEach(function(game) {


      var gameState;
      var status = [];
      var classes = [];
      var localTZ = moment.tz.guess();

      switch(game.game_status) {

        case "Pre-Game":
          gameState = 0; //not started
          status.push(moment(game.time, "hh:mm a zz").tz(localTZ).format("h:mm a"));
          break;

        case "In-Progress":
          gameState = 1; //in-progress

          /*
            You'd think that since Sportsnet's feed returns all
            sports at once that we could handle every sport the
            same way.  Alas, there are too many small differences
            between the sports, even though they don't need to
            be there.  So it's easier to handle each league
            piecemeal instead of having a sea of IF...THEN blocks.
          */
          switch (league) {

            case "NHL":
              /*
                We can use game.period_status to handle a
                couple of special cases.  Otherwise we
                display game.clock and feed game.period
                into the getPeriod() routine.
              */
              if (game.period_status.indexOf("End ") != -1) {
                status.push("END");
                status.push(self.getPeriod(league, game.period));
              } else if (game.period_status == "SO") {
                status.push("SHOOTOUT");
              } else {
                status.push(game.clock);          
                status.push(self.getPeriod(league, game.period));
              }
              break;

            case "MLB":
              /*
                game.period_status property will say "TOP 1st"
                or "BOT 3rd" etc.  Break out "TOP" or "BOT", and
                then feed game.period into the getPeriod() routine
                to format ordinals with the <sup> wrapper.
              */
              status.push(game.period_status.split(" ")[0]);
              status.push(self.getPeriod(league, game.period));
              break;

            case "MLS":
              /*
                Games at the half get put in the "Half-Over",
                array. So we don't need to handle it here.
                To Do: Extra Time and Penalty Kicks
              */
              status.push(game.clock);
              status.push(self.getPeriod(league, game.period));
              break;

            case "NFL":
            case "CFL":
            case "NBA":
              /*
                Sigh.  You'd think Sportnet would reuse the
                "Half-Over" array for games at halftime.  But
                for some weird reason it only uses it for
                soccer.  Also, the feed doesn't provide a
                period-status property, so we need to rely
                on the clock and period properties to build
                the status.

                Luckily, NFL, CFL, and NBA can all be handled
                the same way.  No need to break them out into
                their own special cases.
              */
              if (game.clock == "0:00" && game.period == 2) {
                status.push("HALFTIME");
              } else if (game.clock == "0:00") {
                status.push("END");
                status.push(self.getPeriod(league, game.period));
              } else {
                status.push(game.clock);
                status.push(self.getPeriod(league, game.period));             
              }
              break;

          }

          break;

        case "Half-Over":
          gameState = 1; //in-progress
          status.push("HALFTIME");
          break;

        case "Delayed":
          gameState = 1; //in-progress
          classes.push("delay");
          status.push("Delay");
          break;

        case "Final":
          gameState = 2; //final
          status.push("Final" + self.getFinalOT(league, game));
          break;

        default:
          gameState = 0;
          status.push(moment(game.time, "hh:mm a zz").tz(localTZ).format("h:mm a"));
          break;
      }

      var formattedGame = {
        classes: classes,
        gameMode: gameState,
        hTeam: game.home_team_short,
        vTeam: game.visiting_team_short,
        hTeamLong: self.titleCase(game.home_team),
        vTeamLong: self.titleCase(game.visiting_team),
        hScore: game.home_score,
        vScore: game.visiting_score,
        status: status
      };

      formattedGames.push(formattedGame);
    });


    return formattedGames;


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
      case "MLS":
        if (game.period > 2) {
          return " (OT)";
        } 
        break;
    } 
    return "";
  },

  getOrdinal: function(p) {

    var mod10 = p % 10;
    var mod100 = p % 100;

    if (mod10 == 1 && mod100 != 11) {
      return p + "<sup>ST</sup>";
    }
    if (mod10 == 2 && mod100 != 12) {
      return p + "<sup>ND</sup>";
    }
    if (mod10 == 3 && mod100 != 13) {
      return p + "<sup>RD</sup>";
    }

    return p + "<sup>TH</sup>";

  },

  getPeriod: function(league, p) {

    //check for overtime, otherwise return ordinal
    switch (league) {
      case "NFL":
      case "NBA":
      case "CFL":
        if (p == 5) {
          return ("OT");
        } else if (p > 5) {
          return (p - 4) + "OT";
        }
        break;
      case "NHL":
        if (p == 4) {
          return ("OT");
        } else if (p > 4) {
          return (p - 3) + "OT";
        }
        break;
    }
    return this.getOrdinal(p);
  },

  titleCase: function(str) {
    var splitStr = str.toLowerCase().split(" ");
    for (var i = 0; i < splitStr.length; i++) {
      // two-letter portions are all upper case (e.g.: the "FC" in Toronto FC)
      if (splitStr[i].length <= 2) {
        splitStr[i] = splitStr[i].toUpperCase();
      } else {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);           
      }
    }
    // Directly return the joined string
    return splitStr.join(" "); 
  }


};