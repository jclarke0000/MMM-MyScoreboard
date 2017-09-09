const request = require("request");
const moment = require("moment-timezone");
const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

  today: null,
  gamesList: [],
  sportsList : [],
  dataPollStarted: false,
  errorCount : [],

  supportedLeagues: ["MLB", "NBA", "NHL", "CFL", "NFL", "MLS", "NCAAF"],

  start: function() {
    console.log("Starting node_helper for module [" + this.name + "]");

  },

  socketNotificationReceived: function(notification, payload) {
    
    if (notification == "MMM-MYSCOREBOARD-START") {

      //payload contains module config.
      this.config = payload;
      this.sportsList = new Array();

      for (var i = 0; i < this.config.sports.length; i++) {

        var sport = this.config.sports[i];
        if (this.supportedLeagues.indexOf(sport.league) != -1) {
          
          var sObj = require("./sports/" + sport.league + "/" + sport.league + ".js");
          sObj.configure(sport);

          this.sportsList.push(sObj); 
          this.errorCount[i] = 0;
        }
      }

      this.getScores();

      // set up recurring poll
      if (!this.dataPollStarted) {
        this.dataPollStarted = true;

        var self = this;
        setInterval(function() {
          self.getScores();
        }, this.config.dataPollInterval);
      }

    }

  },

  getScores: function() {

    // console.log("getting scores...");

    var today = moment();

    if (today.hour() < this.config.rolloverHours) {
      //it's past midnight local time, but within the
      //rollover window.  Show yesterday's games, not today's
      today.subtract(1, "day");
    }

    var self = this;
    this.sportsList.forEach( function(league, index) {


      var serviceURL = league.getUrl(today);
      // console.log(serviceURL);

      request({url: serviceURL, method: "GET"}, function(error, response, body) {

        if(!error && response.statusCode == 200) {
          //good response.  Process data.

          var formattedGamesArray;
          try {
            formattedGamesArray = league.processData(body);

            //all good.  reset error count and return the games list.
            self.errorCount[index] = 0;
            self.sendSocketNotification("MMM-MYSCOREBOARD-DATA", {index: index, data: formattedGamesArray});

          } catch (e) {
            /*
              In case the data feed changes, or there is otherwise some kind of unexpected
              structure of the JSON, we won't be able to process it.  But sometimes the feed
              just errors out unexpectedly.  We'll keep track of errors, and after 3 consecutive
              errors, we'll return an empty array for the particular sport.  That sport won't
              display, but it won't stall execution.  The other sports should display just fine.
            */

            self.errorCount[index] += 1;
            console.log( "[" + self.name + "] ** ERROR ** Couldn't process " + league.name + " data: " + e.message + ". Error count: " + self.errorCount[index] );
            if (self.errorCount[index] >= 3) {
              self.errorCount[index] = 0;
              console.log( "[" + self.name + "] 3 consecutive errors for " + league.name + ". Returning an empty games array" );
              self.sendSocketNotification("MMM-MYSCOREBOARD-DATA", {index: index, data: []});
            }
          }
        } else {
          //error retrieving data.  retrun empty array
          self.errorCount[index] += 1;
          console.log( "[" + self.name + "] **  ERROR ** Couldn't retrieve scores for " + league.name + ": " + error + ". Error count: " + self.errorCount[index] );
          if (self.errorCount[index] >= 3) {
            self.errorCount[index] = 0;
            console.log( "[" + self.name + "] 3 consecutive errors for " + league.name + ". Returning an empty games array" );
            self.sendSocketNotification("MMM-MYSCOREBOARD-DATA", {index: index, data: []});
          }
        }



      });



    });

  }




});