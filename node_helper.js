const NodeHelper = require("node_helper");
const dirTree = require("directory-tree");
const Log = require('../../js/logger.js');

module.exports = NodeHelper.create({

  providers: {},

  start: function() {
    Log.log("Starting node_helper for module [" + this.name + "]");

    this.providers.SNET = require("./providers/SNET.js");
    this.providers.ESPN = require("./providers/ESPN.js");
    this.localLogos = {};

    const fsTree = dirTree("./modules/MMM-MyScoreboard/logos", {
      extensions: /\.(svg|png)$/
    });
    fsTree.children.forEach( league => {
      if (league.children) {
        var logoFiles = [];
        league.children.forEach( logo => {
          logoFiles.push(logo.name);
        });
        this.localLogos[league.name] = logoFiles;
      } 
    });

  },

  socketNotificationReceived: function(notification, payload) {
    Log.log('[MMM-MyScoreboard] ' + payload.instanceId + ' - socketNotificationReceived: ' + notification);
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

      provider.getScores(payload.league, payload.teams, payload.gameDate, function(scores) {
        self.sendSocketNotification("MMM-MYSCOREBOARD-SCORE-UPDATE", {instanceId: payload.instanceId, index: payload.index, scores: scores});
      });


    } else if (notification == "MMM-MYSCOREBOARD-GET-LOCAL-LOGOS") {
      this.sendSocketNotification("MMM-MYSCOREBOARD-LOCAL-LOGO-LIST", {instanceId: payload.instanceId, index: payload.index, logos: this.localLogos});

    }

  },


});