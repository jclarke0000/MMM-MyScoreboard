const request = require("request");
const moment = require("moment-timezone");
const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

  today: null,
  gamesList: [],
  sportsList : [],
  dataPollStarted: false,

  supportedLeagues: ["MLB", "NBA", "NHL", "CFL", "NFL"],

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
          } catch (e) {
            /*
              In case the data feed changes, or there is otherwise some kind of unexpected
              structure of the JSON, we won't be able to process it.  So this will prepare
              an empty array for the sport.  It won't display, but it won't stall execution.
              The other sports should display just fine.
            */
            console.log( "[" + self.name + "] ** ERROR ** Couldn't process " + league.name + " data: " + e.message );
            formattedGamesArray = []; 
          }
          self.sendSocketNotification("MMM-MYSCOREBOARD-DATA", {index: index, data: formattedGamesArray});
        } else {
          //error retrieving data.  retrun empty array
          console.log( "[" + self.name + "] **  ERROR ** Couldn't retrieve scores for " + league.name + ": " + error );
          self.sendSocketNotification("MMM-MYSCOREBOARD-DATA", {index: index, data: []});
        }



      });



    });

  }




});