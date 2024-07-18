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
    WBC (World Baseball Classic)

  All sports are provided in a single feed at
  https://mobile-statsv2.sportsnet.ca/ticker

  Updated to get current scores
  https://forum.magicmirror.builders/post/118572
  https://stats-api.sportsnet.ca/ticker


  The feed takes one parameter:

    day - YYYY-MM-DD (e.g. 2018-11-20)

  It's also possible to request individual leagues with the
  "league" parameter, but for some sports, more than one day's
  worth of games are returned (e.g. CFL, NFL).  This becomes
  tricky when time zones come into effect, since the date stamps
  are provided in UTC, and would report the next day's
  games for anything 7:00 PM ET or later.  It was easier
  to continue to use the independent poll that was used with the
  old feed.

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

const axios = require("axios");
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
  POLL_FREQUENCY: 60 * 1000, //every 30 seconds.

  scoresObj: null,
  dataPollStarted: false,
  gameDate: null,

  getScores: function(league, teams, gameDate, callback) {
    console.log( "[MMM-MyScoreboard] " + moment().format("D-MMM-YY HH:mm") + " getScores: " + gameDate + ", " + league + ", " + teams );
    var self = this;
    this.gameDate = moment(gameDate);

    if (this.scoresObj == null) {

      //start the data poll.  Set a timer to check every second to see if the scoresObj gets populated.
      if (!this.dataPollStarted) {
        this.startDataPoll();
      }
      
      var waitForDataTimer = setInterval(function() {
        if (self.scoresObj != null) {

          clearInterval(waitForDataTimer);
          waitForDataTimer = null;

          callback(self.getLeague(league, teams));
        }
      }, 1000);

    } else {
      callback(self.getLeague(league, teams));
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

    var url = "https://stats-api.sportsnet.ca/ticker?day=" + this.gameDate.format("YYYY-MM-DD");


    axios.get(url)
      .then( function(response) {
        if(response.data.data) {
          console.log( "[MMM-MyScoreboard] " + moment().format("D-MMM-YY HH:mm") + " getData: got good reponse" );
          self.scoresObj = response.data;
        }
        else {
          console.log( "[MMM-MyScoreboard] " + moment().format("D-MMM-YY HH:mm") + " getData: no data?" );
        }
      })
      .catch( function(r_err) {
         console.log( "[MMM-MyScoreboard] " + moment().format("D-MMM-YY HH:mm") + " ** ERROR ** Couldn't retrieve data for provider SNET: " + r_err );       
      })
  },


  getLeague: function(league, teams) {
    console.log( "[MMM-MyScoreboard] " + moment().format("D-MMM-YY HH:mm") + " getLeague: " + league + ", " + teams );  
    var self = this;
    
    var filteredGames = [];
    if(this.scoresObj.data.games) {
      filteredGames = this.scoresObj.data.games.filter(function(game) {
        return(game.league.toUpperCase() == league.toUpperCase() &&
          (teams == null || teams.indexOf(game.home_team.short_name.toUpperCase()) != -1 ||
            teams.indexOf(game.visiting_team.short_name.toUpperCase()) != -1) );
      });
    }
    else {
      console.log( "[MMM-MyScoreboard] " + moment().format("D-MMM-YY HH:mm") + " getLeague: no games today"); 
    }


    /*
      now sort the array by start time so that the games always appear
      in the same order regardless of status.  Sort it first by start
      time, then by visting team short code.
    */


    filteredGames.sort(function(a,b) {
      var aTime = moment(a.timestamp * 1000);
      var bTime = moment(b.timestamp * 1000);

      //first sort by start time
      if (aTime.isBefore(bTime)) {
        return -1;
      }
      if (aTime.isAfter(bTime)) {
        return 1;
      }

      //start times are the same.  Now sort by team short codes
      if (a.visiting_team.short_name < b.visiting_team.short_name) {
        return -1;
      }
      if (a.visiting_team.short_name > b.visiting_team.short_name) {
        return 1;
      }

      return 0;

    });

    var formattedGames = [];
    var localTZ = moment.tz.guess();

    filteredGames.forEach(function(game) {


      var gameState;
      var status = [];
      var classes = [];

      switch(game.game_status) {

        case "Pre-Game":
          gameState = 0; //not started
          //Feed provides all game times in Eastern Time
          status.push(moment(game.timestamp * 1000).tz(localTZ).format("h:mm a"));
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
              if (game.shootout == true) {
                status.push("SHOOTOUT");
              } else if (game.overtime == true) {
                status.push(game.clock);          
                status.push("OT");
              } else if (game.clock == "0:00") {
                status.push("END");
                status.push(self.getPeriod(league, game.period));
              } else {
                status.push(game.clock);          
                status.push(self.getPeriod(league, game.period));
              }
              break;

            case "MLB":
            case "WBC":
              /*
                game.period_status property will say "TOP 1st"
                or "BOT 3rd" etc.  Break out "TOP" or "BOT", and
                then feed game.period into the getPeriod() routine
                to format ordinals with the <sup> wrapper.
              */
              status.push(game.period_status && game.period_status.split(" ")[0]);
              status.push(self.getPeriod(league, game.period));
              break;

            case "MLS":
              if (game.clock == "Half") {
                status.push("HALFTIME");
              } else {
                status.push(game.clock);                
              }
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

        case "Postponed":
          gameState = 0;
          status.push("Postponed");
          break;

        case "Final":
          gameState = 2; //final
          status.push("Final" + self.getFinalOT(league, game));
          break;

        default:
          gameState = 0;
          status.push(moment(game.timestamp * 1000).tz(localTZ).format("h:mm a"));
          break;
      }

      /*
        URLs to logo images are available in the feed, but they are a bit too low
        quaity for some of the templates. However, logos are available at higher
        resolution if we replace "59x59" with "200x200" in the path.
      */

      var formattedGame = {
        classes: classes,
        gameMode: gameState,
        hTeam: game.home_team.short_name.toUpperCase(),
        vTeam: game.visiting_team.short_name.toUpperCase(),
        hTeamLong: game.home_team.short_name == "TBD" ? "TBD" : self.titleCase(game.home_team.name),
        vTeamLong: game.visiting_team.short_name == "TBD" ? "TBD" : self.titleCase(game.visiting_team.name),
        hTeamLogoUrl: game.home_team.img_url_90,
        vTeamLogoUrl: game.visiting_team.img_url_90,
        hScore: game.home_team.score,
        vScore: game.visiting_team.score,
        status: status
      };

      formattedGames.push(formattedGame);
    });


    return formattedGames;


  },

  getFinalOT: function(league, game) {
    switch (league) {
      case "NHL":
        if (game.shootout == true) {
          return " (SO)";
        } else if (game.overtime == true) {
          return " (OT)";
        }  else if (game.period == 4) {
          return " (OT)";
        } else if (game.period > 4) {
          return " (" + (game.period - 3) + "OT)";
        }
        break;
      case "MLB":
      case "WBC":
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
          return " (ET)";
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
      case "MLS" :
        if (p > 2) {
          return ("ET");
        }
        break;
    }
    return this.getOrdinal(p);
  },

  titleCase: function(str) {

    if (str == null || str == undefined) {
      return "";
    } 

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