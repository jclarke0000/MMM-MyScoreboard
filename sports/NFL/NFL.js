// Module for NFL scores

/*

  NFL has several endpoints for all of the current week's games. We only need the date
  to determine if we're in post season, which uses a different feed URL (I have no
  freaking clue as to why...).

  http://www.nfl.com/liveupdate/scorestrip/ss.xml
  http://www.nfl.com/liveupdate/scorestrip/postseason/ss.xml

  Because I would rather work with JSON, I poked around and found a JSON version at
  http://www.nfl.com/liveupdate/scorestrip/ss.json but seemingly no equivalent for
  post season.  Maybe separate feed URLs are only an XML requirement?  Also, it appears
  the JSON feed does not have a game clock (GRRRR!!!)

  There are also these JSON feeds:
  
  http://www.nfl.com/liveupdate/scores/scores.json
  
  This one doesn't have start times for games that aren't yet in progress (WTF?),
  and I'm not sure if there is a post season equivalent.

  http://www.nfl.com/liveupdate/scorestrip/scorestrip.json
  http://www.nfl.com/liveupdate/scorestrip/postseason/scorestrip.json
  
  These ones have data in unkeyed arrays, the order of which is different between
  regular vs. post season.  Also, team nick names aren't included in this feed, so
  we'd have to keep a local assocation list

  Sigh.  Why does the NFL have so many different data feeds? And why is it that not a
  single one of which can be used as the best all-around choice that will work for
  both regular season and playoffs?  None of the other sports work this way.

  How do we figure out if we're in the playoffs? There doesn't seem to be a definitive
  indicator in the feed, so we could make some assumptions.

  Return the Postseason URL if:

   - Today's date is after the last game date for week 17's games (are there any wild
     card games or tie breakers that constitute regular seaon?)

   - Today's date is before April 1 (arbitrary off-season date, that should be well after
     the Superbowl and well before the start of the new season)

  Otherwise return the regular season URL.

  I could make a call to the regular season data feed, do a whole lot of parsing to try
  and figure this out reliably, but this seems like a lot of work for a hobbyist
  application such as this.  I'm also concerend about querying the data API too frequently.
  So instead I looked back at the start date for NFL playoffs as far as 2000, and the
  earliest the playoffs have started was Jan 3, except for in 2000 when they started on
  Dec 30.  Also, since 2000, the regular season has usually ended by the end of December, 
  and only twice has it ended as late as Jan 3 (Except in 2001 due to 9/11, which caused
  some games to be rescheduled). So I'm going to use Jan 3 as my arbitrary start of
  postseason, and April 1 as my arbitrary end.  There might be once or twice per decade
  where this turns out to not be correct, and as a result there will be one week where
  games won't be displayed.  I can live with that.  Hopefully NFL consolidates their data
  feeds before this mismatch happens.
  
*/



const moment = require("moment-timezone");
const parseStringSync = require("xml2js-parser").parseStringSync;

module.exports = 
{

  name: "NFL",

  teamsToFollow:[],

  configure: function(config) {
    this.teamsToFollow = config.teams;
  },

  getUrl: function(date) {

    this.gameDate = moment(date);

    /*
      Determine if today's date is between Jan 3 and April 1.  If
      so, return the postseason data URL.  Otherwise return the
      regular season URL.  Does this seem arbitrary to you? That's
      because it is.  See the long winded explanation above.
    */

    var thisYear = String(moment(date).year());
    var playoffsStart = moment(thisYear + "0103", "YYYYMMDD").startOf("day");
    var playoffsEnd = moment(thisYear + "0401", "YYYYMMDD").startOf("day");

    if (this.gameDate.isSameOrAfter(playoffsStart) && this.gameDate.isBefore(playoffsEnd)) {
      return "http://www.nfl.com/liveupdate/scorestrip/postseason/ss.xml";    
    } else {
      return "http://www.nfl.com/liveupdate/scorestrip/ss.xml";    
    }

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

  toTitleCase: function(string) {

    var strPieces = string.toLowerCase().split(" ");

    for (var i = 0; i < strPieces.length; i++) {
      strPieces[i] = strPieces[i].charAt(0).toUpperCase() + strPieces[i].slice(1);
    }

    return strPieces.join(" ");
  },

  formatGameClock: function(clock) {
    var clockPieces = clock.split(":");

    clockPieces[0] = parseInt(clockPieces[0]).toString();

    return clockPieces.join(":");
  },

  processData: function(data) {

    /*
      I figured out some of the stuff from the MMM-NFL module,
      which uses the XML version of the feed, and this post:
      http://cgit.drupalcode.org/sports_scores/tree/nfl.com_json_notes.txt
    */

    var self = this;
    var localTZ = moment.tz.guess();

    // console.log("data = " + data);

    // console.log("about to convert to JSON");
    var gameJSON = parseStringSync(data); //I hate working with XML...
    // console.log("converted.");

    // console.log("filtering...");
    var gamesToFollow = gameJSON.ss.gms[0].g.filter( function(game) {
      return String(game.$.eid).substring(0,8) == self.gameDate.format("YYYYMMDD") &&
        (self.teamsToFollow.indexOf(game.$.v) != -1 || self.teamsToFollow.indexOf(game.$.h) != -1);
    });
    // console.log("filtered...");

    var formattedGamesArray = [];
    gamesToFollow.forEach( function(game) {

      var gameMode;
      var status = [];
      var classes = [];

      switch (game.$.q) {
        case "P":
          gameMode = 0;
          status.push(moment.tz(game.$.t + "PM", "h:mmA", "America/New_York").tz(localTZ).format("h:mm a"));
          break;
        case "F":
        case "T":
          gameMode = 2;
          status.push("Final");
          break;
        case "FO":
        case "FOT":
          status.push("Final OT");
          gameMode = 2;
          break;
        default:
          gameMode = 1;
          if (game.$.k && game.$.q != "H") {          
            status.push(self.formatGameClock(game.$.k));
          }
          status.push(self.formatQuarter(game.$.q));
      }

      formattedGamesArray.push({
        gameMode: gameMode,
        classes: classes,
        hTeam: game.$.h,
        vTeam: game.$.v,
        hTeamLong: self.toTitleCase(game.$.hnn),
        vTeamLong: self.toTitleCase(game.$.vnn),
        hScore: game.$.hs,
        vScore: game.$.vs,
        status: status
      });

    });

    return formattedGamesArray;


  }

};
