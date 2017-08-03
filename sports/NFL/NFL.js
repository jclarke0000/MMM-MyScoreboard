// Module for NFL scores
const moment = require("moment-timezone");

module.exports = 
{

  name: "NFL",

  teamsToFollow:[],

  configure: function(config) {
    this.teamsToFollow = config.teams;
  },

  getUrl: function(date) {
    /*
      NFL has an endpoint for all of the current week's games. We only need the date to
      determine if we're in post season, which uses a different feed URL.

      http://www.nfl.com/liveupdate/scorestrip/ss.xml
      http://www.nfl.com/liveupdate/scorestrip/postseason/ss.xml

      Because I would rather work with JSON, I poked around and found a JSON version at
      http://www.nfl.com/liveupdate/scorestrip/ss.json but seemingly no equivalent for
      post season.  Maybe separate feed URLs are only an XML requirement?

      For now we'll use the regular season JSON feed and hope for the best!
    */

    this.gameDate = moment(date).format("YYYYMMDD");
    return "http://www.nfl.com/liveupdate/scorestrip/ss.json";
  },

  formatQuarter: function(q) {
    switch (q) {
      case "1":
        return q + "<sup>ST</sup>";
      case "2":
        return q + "<sup>ND</sup>";
      case "H":
        return "HALFTIME";
      case "3":
        return q + "<sup>RD</sup>";
      case "4":
        return q + "<sup>TH</sup>";
      case "5":
      case "OT":
        return "OT";
      default:
        return q;
    }
  },  

  processData: function(data) {

    /*
      I figured out some of the stuff from the MMM-NFL module,
      which uses the XML version of the feed, and this post:
      http://cgit.drupalcode.org/sports_scores/tree/nfl.com_json_notes.txt
    */

    var self = this;
    var gameJSON = JSON.parse(data);
    var localTZ = moment.tz.guess();

    var gamesToFollow = gameJSON.gms.filter( function(game) {
      return String(game.eid).substring(0,8) == self.gameDate &&
        (self.teamsToFollow.indexOf(game.v) != -1 || self.teamsToFollow.indexOf(game.h) != -1);
    });

    var formattedGamesArray = [];
    gamesToFollow.forEach( function(game) {

      var gameMode;
      var status = [];
      var classes = [];

      switch (game.q) {
        case "P":
          gameMode = 0;
          status.push(moment.tz(game.t + "PM", "h:mmA", "America/New_York").tz(localTZ).format("h:mm a"));
          break;
        case "F":
        case "T":
          gameMode = 2;
          status.push("Final");
          break;
        case "FOT":
          status.push("Final OT");
          gameMode = 2;
          break;
        default:
          gameMode = 1;
          status.push(game.k); //game clock
          status.push(self.formatQuarter(game.q));
      }

      formattedGamesArray.push({
        gameMode: gameMode,
        classes: classes,
        hTeam: game.h,
        vTeam: game.v,
        hTeamLong: game.hnn,
        vTeamLong: game.vnn,
        hScore: game.hs,
        vScore: game.vs,
        status: status
      });

    });

    return formattedGamesArray;


  }

};
