// Provider ESPN
const request = require("request");
const moment = require("moment-timezone");
const parseJSON = require("json-parse-async");

module.exports = {

  PROVIDER_NAME: "ESPN",

  getUrl: function(league) {
    switch (league) {
      case "NCAAF":
        return "http://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard";
      default:
        return null;
    }
  },

  getScores: function(sport, teams, gameDate, callback) {

    var self = this;

    var url = this.getUrl(sport) + "?dates=" + 
      moment(gameDate).format("YYYYMMDD") + "&limit=100";

    request({url: url, method: "GET"}, function(r_err, response, body) {

      if(!r_err && response.statusCode == 200) {
        
        parseJSON(body, function(p_err, content) {
          if (p_err) {
            console.log( "[MMM-MyScoreboard] **  ERROR ** Couldn't parse " + sport + " data for provider ESPN: " + p_err );       
          } else {

            callback(self.formatScores(content, teams));

          }
        });

      } else {
        console.log( "[MMM-MyScoreboard] **  ERROR ** Couldn't retrieve " + sport + " data for provider ESPN: " + r_err );       
      }

    });


  },

  formatScores: function(data, teams) {

    var self = this;
    var formattedGamesList = new Array();
    var localTZ = moment.tz.guess();

    var filteredGamesList;
    if (teams != null) { //filter to teams list

      filteredGamesList = data.events.filter(function(game) {
        return self.teamsToFollow.indexOf(game.competitions[0].competitors[0].team.abbreviation) != -1 || self.teamsToFollow.indexOf(game.competitions[0].competitors[1].team.abbreviation) != -1;
      });

    } else { //return all games
      filteredGamesList = data.events;
    }

    //iterate through games and construct formattedGamesList
    filteredGamesList.forEach(function(game) {

      var status = [];
      var classes = [];

      var gameState = 0;

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
          gameState = 1;
          status.push(game.status.displayClock);
          status.push(game.status.type.detail);
          break;
        case "3": //final
          gameState = 2;
          status.push("Final"); //to do, determine if final because of OT
          break;
        case "4": //forfeit
        case "9": //forfeit of home team
        case "10": //forfeit of away team
          gameState = 0;
          status.push("Forfeit");
          break;
        case "5": //cancelled
          gameState = 0;
          status.push("Canceled");
          break;
        case "6": //postponed
          gameState = 0;
          status.push("Postponed");
          break;          
        case "7":  //delay
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
          status.push(game.status.type.detail);
          break;
        case "23": //halftime
          gameState = 1;
          status.push("HALFTIME");
          break;
        case "24": //overtime
          status.push(game.status.displayClock);
          status.push(game.status.type.detail);
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

      /*
        WTF... 
        for NCAAF, sometimes FCS teams (I-AA) play FBS (I-A) teams.  These are known as money
        games. As such, the logos directory contains images for all of the FCS teams as well
        as the FBS teams.  Wouldn't you know it but there is a SDSU in both divisions --
        totally different schools!!!
        So we'll deal with it here.  There is an SDSU logo file with a space at the end of
        its name (e.g.: "SDSU .png" that is for the FCS team.  We'll use that abbreviation
        which will load a different logo file, but the extra space will collapse in HTML
        when the short code is displayed)
      */

      if (sport == "NCAAF" && hTeamData.team.abbreviation == "SDSU" && hTeamData.team.location.indexOf("South Dakota State") != -1) {
        hTeamData.team.abbreviation = "SDSU "; 
      } else if (sport == "NCAAF" && vTeamData.team.abbreviation == "SDSU" && vTeamData.team.location.indexOf("South Dakota State") != -1) {
        vTeamData.team.abbreviation = "SDSU ";
      }

      formattedGamesList.push({
        league: league,
        gameMode: gameState,
        classes: classes,
        hTeam: hTeamData.team.abbreviation,
        vTeam: vTeamData.team.abbreviation,
        /*
          For college sports, include the shortcode in the long team name
        */
        hTeamLong: (league == "NCAAF" ? hTeamData.team.abbreviation + " " : "") + hTeamData.team.shortDisplayName,
        vTeamLong: (league == "NCAAF" ? vTeamData.team.abbreviation + " " : "") + vTeamData.team.shortDisplayName,                    
        hScore: hTeamData.score,
        vScore: vTeamData.score,
        status: status,
        usePngLogos: true
      });

    });

    return formattedGamesList;



  },



};