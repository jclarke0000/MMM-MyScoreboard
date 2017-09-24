// Module for NHL scores
const moment = require('moment-timezone');

module.exports = 
{

  name: "NHL",

  /*
    This is populated by the configure() function
  */
  teamsIdsToFollow : [],


  configure: function(config) {

    var self = this;
    this.teamsIdsToFollow = new Array();

    config.teams.forEach( function(team) {
      self.teams.find(function(el) {
        if (el.shortCode == team)  {
          self.teamsIdsToFollow.push(el.id);
        }
      });
    });

  },

  /*
    Returns the built JSON service url.

      @param date
        Moment.js object representing the date for which scores are to be retrieved

  */
  getUrl: function(date) {
    var url = "https://statsapi.web.nhl.com/api/v1/schedule?" +
      "startDate=" + moment(date).format("YYYY-MM-DD") +
      "&endDate=" + moment(date).format("YYYY-MM-DD") +
      "&expand=schedule.linescore";

    return url;
  },
  
  /*
    Processes the sport-specific data.  

    Returns an array of objects in the following standardized format:

      {
        gameMode: number,
        hTeam: string,
        vTeam: string,
        hScore: number,
        vScore: number,
        status: string
      }

    where:

      gameMode can be one of the following:
        0 - Game not yet started
        1 - Game in progress
        2 - Game is complete, score is final

      hTeam and vTeam are the 3-letter shortcodes for home team and visting team respectively

      hScore and vScore are the scores for the home team and visting team respectively

      status: game status, depends on gameMode:
        0 - Start time (e.g.: "7:00 pm")
        1 - Period and game clock (e.g.: "3rd 2:03")
        2 - Final text (e.g.: "Final", "Final OT", etc)

  */
  processData: function(data) {

    //expects JSON
    data = JSON.parse(data);

    var self = this;
    var formattedGamesList = new Array();

    if (data.dates.length > 0 && data.dates[0].games) {

      data.dates[0].games.forEach( function(game) {

        if (self.teamsIdsToFollow.indexOf(game.teams.away.team.id) != -1 ||
            self.teamsIdsToFollow.indexOf(game.teams.home.team.id) != -1 ) {      

              var status = [];
              var classes = [];

              var gameState = self.gameStates[game.status.codedGameState];
              switch (gameState) {
                case 0:
                  //set status to start time, present in local time zone
                  var localTZ = moment.tz.guess();
                  //NHL provides game time in Zulu time (i.e. no time offset).  So we can convert in one shot.
                  status.push(moment.tz(game.gameDate, localTZ).format("h:mm a"));
                  break;
                case 1:
                  //set status to period and game clock

                  var periodTxt = game.linescore.currentPeriodOrdinal;
                  periodTxt = periodTxt.replace("2nd OT", "2OT");
                  periodTxt = periodTxt.replace("3rd OT", "3OT");
                  periodTxt = periodTxt.replace("4th OT", "4OT");
                  periodTxt = periodTxt.replace("5th OT", "5OT");
                  periodTxt = periodTxt.replace("1st", "1<sup>ST</sup>");
                  periodTxt = periodTxt.replace("2nd", "2<sup>ND</sup>");
                  periodTxt = periodTxt.replace("3rd", "3<sup>RD</sup>");

                  var timeRemaining = game.linescore.currentPeriodTimeRemaining;
                  if (timeRemaining.substring(0,1) == "0") {
                    timeRemaining = timeRemaining.substring(1); //hide first zero when time is less tha  10 minutes
                  } 

                  if (periodTxt != "SO") {
                    status.push(timeRemaining);                  
                  }
                  status.push(periodTxt);

                  break;
                case 2:
                  //set status to final
                  status.push(game.status.detailedState);
                  if (game.linescore.currentPeriodOrdinal.indexOf("OT") != -1 || game.linescore.currentPeriodOrdinal.indexOf("SO") != -1) {
                    status.push("(" + game.linescore.currentPeriodOrdinal + ")");
                  }
                  break;
              }

              formattedGamesList.push({
                gameMode: gameState,
                classes: classes,
                hTeam: self.getTeamShortCode(game.teams.home.team.id),
                vTeam: self.getTeamShortCode(game.teams.away.team.id),
                hTeamLong: self.getTeamName(game.teams.home.team.id),
                vTeamLong: self.getTeamName(game.teams.away.team.id),
                hScore: game.teams.home.score,
                vScore: game.teams.away.score,
                status: status
              });
        } 

      });

    }

    return formattedGamesList;

  },

  /*
    Game state codes changed in the 2017/18 season.
    The following maps the feed's codedGameState value
    with this module's native 0 (scheduled / future),
    1 (in-progress), and 2 (post-game / final) states.
  */
  gameStates: {
    "1": 0, //Scheduled
    "2": 0, //Pre-Game
    "3": 1, //In Progress
    "4": 1, //In Progress - Critical
    "5": 1, //???
    "6": 2, //Final
    "7": 2  //Final, Post season ???
  },

  /* 
    NHL API uses numeric IDs for the teams, not the short codes.
    So this is used to map the short codes to their respective IDs
  */
  teams: [
    {
      id: 1,
      shortCode: "NJD",
      name: "Devils"
    },
    {
      id: 2,
      shortCode: "NYI",
      name: "Islanders"
    },
    {
      id: 3,
      shortCode: "NYR",
      name: "Rangers"
    },
    {
      id: 4,
      shortCode: "PHI",
      name: "Flyers"
    },
    {
      id: 5,
      shortCode: "PIT",
      name: "Penguins"
    },
    {
      id: 6,
      shortCode: "BOS",
      name: "Bruins"
    },
    {
      id: 7,
      shortCode: "BUF",
      name: "Sabres"
    },
    {
      id: 8,
      shortCode: "MTL",
      name: "Canadiens"
    },
    {
      id: 9,
      shortCode: "OTT",
      name: "Senators"
    },
    {
      id: 10,
      shortCode: "TOR",
      name: "Maple Leafs"
    },
    {
      id: 12,
      shortCode: "CAR",
      name: "Hurricanes"
    },
    {
      id: 13,
      shortCode: "FLA",
      name: "Panthers"
    },
    {
      id: 14,
      shortCode: "TBL",
      name: "Lightning"
    },
    {
      id: 15,
      shortCode: "WSH",
      name: "Capitals"
    },
    {
      id: 16,
      shortCode: "CHI",
      name: "Black Hawks"
    },
    {
      id: 17,
      shortCode: "DET",
      name: "Red Wings"
    },
    {
      id: 18,
      shortCode: "NSH",
      name: "Predators"
    },
    {
      id: 19,
      shortCode: "STL",
      name: "Blues"
    },
    {
      id: 20,
      shortCode: "CGY",
      name: "Flames"
    },
    {
      id: 21,
      shortCode: "COL",
      name: "Avalanche"
    },
    {
      id: 22,
      shortCode: "EDM",
      name: "Oilers"
    },
    {
      id: 23,
      shortCode: "VAN",
      name: "Canucks"
    },
    {
      id: 24,
      shortCode: "ANA",
      name: "Ducks"
    },
    {
      id: 25,
      shortCode: "DAL",
      name: "Stars"
    },
    {
      id: 26,
      shortCode: "LAK",
      name: "Kings"
    },
    {
      id: 28,
      shortCode: "SJS",
      name: "Sharks"
    },
    {
      id: 29,
      shortCode: "CBJ",
      name: "Blue Jackets"
    },
    {
      id: 30,
      shortCode: "MIN",
      name: "Wild"
    },
    {
      id: 52,
      shortCode: "WPG",
      name: "Jets"
    },
    {
      id: 53,
      shortCode: "ARI",
      name: "Coyotes"
    },
    {
      id: 54,
      shortCode: "VGK",
      name: "Golden Knights"
    }
  ],

  getTeamShortCode: function(id) {
    var shortCode = ''
    this.teams.find( function(el) {
      if (el.id == id) {
        shortCode = el.shortCode;
      }
    });
    return shortCode;
  },

  getTeamName: function(id) {
    var name = ''
    this.teams.find( function(el) {
      if (el.id == id) {
        name = el.name;
      }
    });
    return name;
  }


}