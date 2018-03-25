/*

  -------------------------------------
    Provider for ESPN Scoreboard Data
  -------------------------------------

  Provides scores for
    NCAAF (College Football, FBS Division)
    NCAAM (College Basketball. Division I)
    MCAAM_M (College Basketball, March Madness Torunament)
    NBA (National Basketball Association)
    EPL (English Premier League Football)
    BRAS (Brazilian League 1 Football)

  Data API also provides scoreboard data for MANY other
  leagues, not currently supported.

  You can get an idea of what sports and leagues are
  supported here:
  http://www.espn.com/static/apis/devcenter/io-docs.html

  Documentation for the feed can be found here:
  http://www.espn.com/static/apis/devcenter/docs/scores.html#parameters

  ESPN has several different APIs for various sports data,
  most of which need an API key.  ESPN no longer gives out
  public API keys.  The good news is the Scoreboard API does
  not require an API key. It's free and clear.  Let's not
  abuse this.  Please do not modify this to hammer the API
  with a flood of calls, otherwise it might cause ESPN to
  lock this it down.

  Data is polled on demand per league configured in the
  front end. Each time the front end makes a request for a
  particular league a request for JSON is made to ESPN's
  servers.  The front end polls every two miuntes.

*/

const request = require("request");
const moment = require("moment-timezone");
const parseJSON = require("json-parse-async");

module.exports = {

  PROVIDER_NAME: "ESPN",

  getLeaguePath: function(league) {
    switch (league) {
      case "NCAAF":
        return "football/college-football";
      case "NBA":
        return "basketball/nba";
      case "NCAAM":
      case "NCAAM_MM":
        return "basketball/mens-college-basketball";
      case "EPL":     //added English Premier League
        return "soccer/eng.1";
      case "BRAS":     //added Brazilian League 1
        return "soccer/bra.1";
      default:
        return null;
    }
  },

  getScores: function(league, teams, gameDate, callback) {

    var self = this;

    var url = "http://site.api.espn.com/apis/site/v2/sports/" +
      this.getLeaguePath(league) +
      "/scoreboard?dates=" +
      moment(gameDate).format("YYYYMMDD") + "&limit=200";


    ///temporary link to have Soccer Games ShowingUp  ** Use this to have the API point to a date
    // var url = "http://site.api.espn.com/apis/site/v2/sports/" +
    //     this.getLeaguePath(league) +
    //     "/scoreboard?dates=20180317" +
    //     "&limit=200";



    /*
      by default, ESPN returns only the Top 25 ranked teams for NCAAF
      and NCAAM. By appending the group parameter (80 for NCAAF and 50
      for NCAAM, found in the URL of their respective scoreboard pages
      on ESPN.com) we'll get the entire game list.

      March Madness is grouped separately in ESPN's feed. The way I
      currently have things set up, I need to treat it like a different
      league.
    */
    if (league == "NCAAF") {
      url = url + "&groups=80";
    } else if (league == "NCAAM") {
      url = url + "&groups=50";
    } else if (league == "NCAAM_MM") {
      url = url + "&groups=100";
    }

    request({url: url, method: "GET"}, function(r_err, response, body) {

      if(!r_err && response.statusCode == 200) {

        parseJSON(body, function(p_err, content) {
          if (p_err) {
            console.log( "[MMM-MyScoreboard] " + moment().format("D-MMM-YY HH:mm") + " ** ERROR ** Couldn't parse " + league + " data for provider ESPN: " + p_err );
          } else {
            callback(self.formatScores(league, content, teams));
          }
        });

      } else {
        console.log( "[MMM-MyScoreboard] " + moment().format("D-MMM-YY HH:mm") + " ** ERROR ** Couldn't retrieve " + league + " data for provider ESPN: " + r_err );
        console.log( "[MMM-MyScoreboard] " + url );

      }

    });


  },

  formatScores: function(league, data, teams) {

    var self = this;
    var formattedGamesList = new Array();
    var localTZ = moment.tz.guess();

    var filteredGamesList;
    if (teams != null) { //filter to teams list

      filteredGamesList = data.events.filter(function(game) {

        //if "@T25" is in the teams list, it indicates to include teams ranked in the top 25
        if (teams.indexOf("@T25") != -1 &&
            ( (game.competitions[0].competitors[0].curatedRank.current >= 1 &&
                game.competitions[0].competitors[0].curatedRank.current <= 25) ||
                (game.competitions[0].competitors[1].curatedRank.current >= 1 &&
                    game.competitions[0].competitors[1].curatedRank.current <= 25) )) {
          return true;
        }

        return teams.indexOf(game.competitions[0].competitors[0].team.abbreviation) != -1 ||
            teams.indexOf(game.competitions[0].competitors[1].team.abbreviation) != -1;
      });

    } else { //return all games
      filteredGamesList = data.events;
    }

    //sort by start time, then by away team shortcode.
    filteredGamesList.sort(function(a,b) {
      var aTime = moment(a.competitions[0].date);
      var bTime = moment(b.competitions[0].date);

      //first sort by start time
      if (aTime.isBefore(bTime)) {
        return -1;
      }
      if (aTime.isAfter(bTime)) {
        return 1;
      }

      //start times are the same.  Now sort by away team short codes
      var aTteam = (a.competitions[0].competitors[0].homeAway == "away" ?
          a.competitions[0].competitors[0].team.abbreviation :
          a.competitions[0].competitors[1].team.abbreviation);

      var bTteam = (b.competitions[0].competitors[0].homeAway == "away" ?
          b.competitions[0].competitors[0].team.abbreviation :
          b.competitions[0].competitors[1].team.abbreviation);


      if (aTteam < bTteam) {
        return -1;
      }
      if (aTteam > bTteam) {
        return 1;
      }

      return 0;

    });


    //iterate through games and construct formattedGamesList
    filteredGamesList.forEach(function(game) {

      var status = [];
      var classes = [];

      var gameState = 0;

      /*
        Not all of ESPN's status.type.id's are supported here.
        Some are for sports that this provider doesn't yet
        support, and some are so rare that we'll likely never
        see it.  These cases are handled in the 'default' block.
      */
      switch (game.status.type.id) {
        case "0" : //TBD
          gameState = 0;
          status.push("TBD");
          break;
        case "1": //scheduled
          gameState = 0;
          status.push(moment(game.competitions[0].date).tz(localTZ).format("h:mm a"));
          break;
        case "2": //in-progress
        case "21": //beginning of period
        case "24": //overtime
          gameState = 1;
          status.push(game.status.displayClock);
          status.push(self.getPeriod(league, game.status.period));
          break;
        case "3": //final
          gameState = 2;
          status.push("Final" + self.getFinalOT(league, game.status.period));
          break;
        case "4": //forfeit
        case "9": //forfeit of home team
        case "10": //forfeit of away team
          gameState = 0;
          status.push("Forfeit");
          break;
        case "5": //cancelled
          gameState = 0;
          status.push("Cancelled");
          break;
        case "6": //postponed
          gameState = 0;
          status.push("Postponed");
          break;
        case "7":  //delayed
        case "17": //rain delay
          gameState = 1;
          classes.push["delay"];
          status.push("Delay");
          break;
        case "8": //suspended
          gameState = 0;
          status.push("Suspended");
          break;
        case "22": //end period
          gameState = 1;
          status.push("END");
          status.push(self.getPeriod(league, game.status.period));
          break;
        case "23": //halftime
          gameState = 1;
          status.push("HALFTIME");
          break;
        case "28": //SOCCER
          gameState = 2;
          status.push("Final" + self.getFinalOT(league, game.status.period));
          break;
        default: //Anything else, treat like a game that hasn't started yet
          gameState = 0;
          status.push(moment(game.competitions[0].date).tz(localTZ).format("h:mm a"));
          break;

      }


      var hTeamData = game.competitions[0].competitors[0];
      var vTeamData = game.competitions[0].competitors[1];

      /*
        Looks like the home team is always the first in the feed, but it also specified,
        so we can be sure.
      */

      if (hTeamData.homeAway == "away") {
        hTeamData = game.competitions[0].competitors[1];
        vTeamData = game.competitions[0].competitors[0];
      }

      //Soccer is the opposite, Home team comes first. To avoid major code changes on MyScoreboard.js it's easier to swap them here
      if (league == "EPL" || league == "BRAS"){
        hTeamData = game.competitions[0].competitors[1];
        vTeamData = game.competitions[0].competitors[0];

        if (hTeamData.homeAway == "away") {          
          hTeamData = game.competitions[0].competitors[0];
          vTeamData = game.competitions[0].competitors[1];
        }
      }

      /*
        WTF...
        for NCAAF, sometimes FCS teams (I-AA) play FBS (I-A) teams.  These are known as money
        games. As such, the logos directory contains images for all of the FCS teams as well
        as the FBS teams.  Wouldn't you know it but there is a SDSU in both divisions --
        totally different schools!!!
        So we'll deal with it here.  There is an SDSU logo file with a space at the end of
        its name (e.g.: "SDSU .png" that is for the FCS team.  We'll use that abbreviation
        which will load a different logo file, but the extra space will collapse in HTML
        when the short code is displayed).

        The big irony here is that the SAME school as the FCS SDSU has a different ESPN short
        code for basketball: SDST.
      */

      if (league == "NCAAF" && hTeamData.team.abbreviation == "SDSU" && hTeamData.team.location.indexOf("South Dakota State") != -1) {
        hTeamData.team.abbreviation = "SDSU ";
      } else if (league == "NCAAF" && vTeamData.team.abbreviation == "SDSU" && vTeamData.team.location.indexOf("South Dakota State") != -1) {
        vTeamData.team.abbreviation = "SDSU ";
      }

      //determine which display name to use
      var hTeamLong = "";
      var vTeamLong = "";
      //For college sports, use the displayName property
      if (league == "NCAAF" || league == "NCAAM") {
        hTeamLong = (hTeamData.team.abbreviation == undefined ? "" : hTeamData.team.abbreviation + " ") + hTeamData.team.name;
        vTeamLong = (vTeamData.team.abbreviation == undefined ? "" : vTeamData.team.abbreviation + " ") + vTeamData.team.name;
      } else { //use the shortDisplayName property
        hTeamLong = hTeamData.team.shortDisplayName;
        vTeamLong = vTeamData.team.shortDisplayName;
      }


      formattedGamesList.push({
        classes: classes,
        gameMode: gameState,
        hTeam: hTeamData.team.abbreviation == undefined ? hTeamData.team.name.substring(0,4).toUpperCase() + " " : hTeamData.team.abbreviation,
        vTeam: vTeamData.team.abbreviation == undefined ? vTeamData.team.name.substring(0,4).toUpperCase() + " " : vTeamData.team.abbreviation,
        hTeamLong: hTeamLong,
        vTeamLong: vTeamLong,
        hTeamRanking: (league == "NCAAF" || league == "NCAAM") ? self.formatT25Ranking(hTeamData.curatedRank.current) : null,
        vTeamRanking: (league == "NCAAF" || league == "NCAAM") ? self.formatT25Ranking(vTeamData.curatedRank.current) : null,
        hScore: parseInt(hTeamData.score),
        vScore: parseInt(vTeamData.score),
        status: status,
        usePngLogos: true,
        hTeamLogo: hTeamData.team.logo,
        vTeamLogo: vTeamData.team.logo
      });

    });

    return formattedGamesList;



  },

  formatT25Ranking: function(rank) {
    if (rank >= 1 && rank <= 25) {
      return rank;
    }
    return null;
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
      case "NCAAF":
      case "NCAAM":
      case "NCAAM_MM":
      case "NBA":
        if (p == 5) {
          return "OT";
        } else if (p > 5) {
          return (p - 4) + "OT";
        }
        break;
    }
    return this.getOrdinal(p);
  },

  getFinalOT: function(league, p) {
    switch (league) {
      case "NCAAF":
      case "NCAAM":
      case "NCAAM_MM":
      case "NBA":
        if (p == 5) {
          return " (OT)";
        } else if (p > 5) {
          return " (" + (p - 4) + "OT)";
        }
        break;
    }
    return "";
  }




};