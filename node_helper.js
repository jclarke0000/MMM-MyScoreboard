const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({

  providers: {},

  start: function() {
    console.log("Starting node_helper for module [" + this.name + "]");

    this.providers.SNET = require("./providers/SNET.js");
    this.providers.ESPN = require("./providers/ESPN.js");
  },

  socketNotificationReceived: function(notification, payload) {
    
    if (notification == "MMM-MYSCOREBOARD-GET-SCORES") {

      /*
        payload contains:
          provider to get data from
          game date for which to retrive scores,
          league
          teams
          module instance identifier
          sport's index from the config's order
      */

      var self = this;
      var provider = this.providers[payload.provider];

      provider.getScores(payload.league, payload.teams, payload.gameDate, payload.language, function(scores) {
        self.sendSocketNotification("MMM-MYSCOREBOARD-SCORE-UPDATE", {instanceId: payload.instanceId, index: payload.index, scores: scores});
      });


    }

  },




});