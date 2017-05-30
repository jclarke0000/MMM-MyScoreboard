// Module for NHL scores
const moment = require('moment-timezone');

module.exports = 
{

  /*
    For identification purposes.  Useful for debugging
  */
  name: "NHL",

  /*
    This is populated by the configure() function
  */
  teamsIdsToFollow : [],


  /*
    Configures the module with the teams for which games and scores are to be retrieved

      @param teams 
        Array of three-letter team shortcodes in string format
  */
  configure: function(teams) {

    var self = this;
    this.teamsIdsToFollow = new Array();

    teams.forEach( function(team) {
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

    var self = this;
    var formattedGamesList = new Array();

    if (data.dates.length > 0 && data.dates[0].games) {

      data.dates[0].games.forEach( function(game) {

        if (self.teamsIdsToFollow.indexOf(game.teams.away.team.id) != -1 ||
            self.teamsIdsToFollow.indexOf(game.teams.home.team.id) != -1 ) {      

              var status = '';
              var gameState = self.gameStates[game.status.codedGameState];
              switch (gameState) {
                case 0:
                  //set status to start time, present in local time zone
                  var localTZ = moment.tz.guess();
                  //NHL provides game time in Zulu time (i.e. no time offset).  So we can convert in one shot.
                  status = moment.tz(game.gameDate, localTZ).format("h:mm a");
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

                  status = '<span class="period">' +
                    periodTxt +
                    '</span><span class="game-clock">' +
                    game.linescore.currentPeriodTimeRemaining +
                    '</span>';

                  break;
                case 2:
                  //set status to final
                  status = game.status.detailedState + 
                    (game.linescore.currentPeriodOrdinal.indexOf("OT") != -1 ? " (" + game.linescore.currentPeriodOrdinal + ")" : "");

                  break;
              }

              formattedGamesList.push({
                gameMode: gameState,
                hTeam: self.getTeamShortCode(game.teams.home.team.id),
                vTeam: self.getTeamShortCode(game.teams.away.team.id),
                hScore: game.teams.home.score,
                vScore: game.teams.away.score,
                status: status
              });
        } 

      });

    }

    return formattedGamesList;

  },

  gameStates: {
    "1": 0,
    "2": 0,
    "3": 1,
    "4": 1,
    "5": 1,
    "6": 1,
    "7": 2
  },

  /* 
    NHL API uses numeric IDs for the teams, not the short codes.
    So this is used to map the short codes to their respective IDs
  */
  teams: [
    {
      id: 1,
      shortCode: "NJD"
    },
    {
      id: 2,
      shortCode: "NYI"
    },
    {
      id: 3,
      shortCode: "NYR"
    },
    {
      id: 4,
      shortCode: "PHI"
    },
    {
      id: 5,
      shortCode: "PIT"
    },
    {
      id: 6,
      shortCode: "BOS"
    },
    {
      id: 7,
      shortCode: "BUF"
    },
    {
      id: 8,
      shortCode: "MTL"
    },
    {
      id: 9,
      shortCode: "OTT"
    },
    {
      id: 10,
      shortCode: "TOR"
    },
    {
      id: 12,
      shortCode: "CAR"
    },
    {
      id: 13,
      shortCode: "FLA"
    },
    {
      id: 14,
      shortCode: "TBL"
    },
    {
      id: 15,
      shortCode: "WSH"
    },
    {
      id: 16,
      shortCode: "CHI"
    },
    {
      id: 17,
      shortCode: "DET"
    },
    {
      id: 18,
      shortCode: "NSH"
    },
    {
      id: 19,
      shortCode: "STL"
    },
    {
      id: 20,
      shortCode: "CGY"
    },
    {
      id: 21,
      shortCode: "COL"
    },
    {
      id: 22,
      shortCode: "EDM"
    },
    {
      id: 23,
      shortCode: "VAN"
    },
    {
      id: 24,
      shortCode: "ANA"
    },
    {
      id: 25,
      shortCode: "DAL"
    },
    {
      id: 26,
      shortCode: "LAK"
    },
    {
      id: 28,
      shortCode: "SJS"
    },
    {
      id: 29,
      shortCode: "CBJ"
    },
    {
      id: 30,
      shortCode: "MIN"
    },
    {
      id: 52,
      shortCode: "WPG"
    },
    {
      id: 53,
      shortCode: "ARI"
    },
  ],

  getTeamShortCode: function(id) {
    var shortCode = ''
    this.teams.find( function(el) {
      if (el.id == id) {
        shortCode = el.shortCode;
      }
    });
    return shortCode;
  }

}