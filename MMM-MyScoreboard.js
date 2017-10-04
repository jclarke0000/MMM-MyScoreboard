/*********************************

  Magic Mirror Module: 
  MMM-MyScoreboard
  https://github.com/jclarke0000/MMM-MyScoreboard

  By Jeff Clarke
  MIT Licensed
 
*********************************/

Module.register("MMM-MyScoreboard",{

  // Default module config.
  defaults: {
    showLeagueSeparators: true,
    colored: true,
    rolloverHours: 3, //hours past midnight to show the pervious day's scores
    shadeRows: false,
    highlightWinners: true,
    viewStyle: "largeLogos",
    sports: [
      {
        league: "NHL",
        teams: ["TOR"]
      },
      {
        league: "NBA",
        teams: ["TOR"]
      },
      {
        league: "MLB",
        teams: ["TOR"]
      },
      {
        league: "CFL",
        teams: ["TOR"]
      }
    ]
  },

  supportedLeagues: {
    "NBA" : {
      provider: "ESPN",
      logoFormat: "svg"
    },
    "NHL" : {
      provider: "SNET",
      logoFormat: "svg"
    },
    "NFL" : {
      provider: "SNET",
      logoFormat: "svg"
    },
    "CFL" : {
      provider: "SNET",
      logoFormat: "svg"
    },
    "MLB" : {
      provider: "SNET",
      logoFormat: "svg"
    },
    "MLS" : {
      provider: "SNET",
      logoFormat: "svg"
    },
    "NCAAF" : {
      provider: "ESPN",
      logoFormat: "png"
    }
  },

  // Define required styles.
  getStyles: function () {
    return ["MMM-MyScoreboard.css"];
  },

  // Define required scripts.
  getScripts: function() {
    return ["moment.js"];
  },

  gameModes: {
    FUTURE: 0,
    IN_PROGRESS: 1,
    FINAL: 2
  },

  viewStyles: [
    "largeLogos",
    "mediumLogos",
    "smallLogos",
    "oneLine",
    "oneLineWithLogos",
    "stacked",
    "stackedWithLogos"
  ],

  viewStyleHasLogos: function(v) {
    switch(v) {
      case "largeLogos":
      case "mediumLogos":
      case "smallLogos":
      case "oneLineWithLogos":
      case "stackedWithLogos":
        return true;
      default:
        return false;
    }
  },

  viewStyleHasShortcodes: function(v) {
    switch(v) {
      case "oneLine":
      case "oneLineWithLogos":
        return true;
      default:
        return false;
    }
  },

  viewStyleHasLongNames: function(v) {
    switch(v) {
      case "stacked":
      case "stackedWithLogos":
        return true;
      default:
        return false;
    }
  },


  /******************************************************************

    Function boxScoreFactory()
    
    Parameters:
      gameObj: Object of a single game's data

    Generates an HTML snippet representing one game in the list.
    Scores are ommitted if gameObj.gameMode == FUTURE

    <div class='box-score league [extra classes]'>
      <img class='logo home' src='logos/league/hTeamShortcode.svg' alt='hTeam' />
      <img class='logo visitor' src='logos/league/vTeamShortcode.svg' alt='vTeam' />
      <span class="team-shortcode home">XXX</span>
      <span class="team-shortcode visitor">XXX</span>
      <span class='status'>
        <span>status1</span>
        <span>status2</span>
      </span>
      <span class='score home'>hScore</span>
      <span class='score visitor'>vScore</span>
    </div>
  ******************************************************************/
  boxScoreFactory: function(league, gameObj) {

    var viewStyle = this.config.viewStyle;

    var boxScore = document.createElement("div");
    boxScore.classList.add("box-score", league);
    boxScore.classList.add(viewStyle);
    if (gameObj.gameMode == this.gameModes.IN_PROGRESS) {
      boxScore.classList.add("in-progress");
    }
    if (gameObj.classes) {
      gameObj.classes.forEach( function(c) {
        boxScore.classList.add(c);
      });      
    }

    //add team logos if applicable
    if (this.viewStyleHasLogos(viewStyle)) {      

      var hTeamLogo = document.createElement("span");
      hTeamLogo.classList.add("logo", "home");

      var hTeamLogoImg = document.createElement("img");
      hTeamLogoImg.src = this.file("logos/" + league + "/" + gameObj.hTeam + "." + this.supportedLeagues[league].logoFormat );
      hTeamLogoImg.setAttribute("data-abbr", gameObj.hTeam);

      hTeamLogo.appendChild(hTeamLogoImg);
      boxScore.appendChild(hTeamLogo);



      var vTeamLogo = document.createElement("span");
      vTeamLogo.classList.add("logo", "visitor");

      var vTeamLogoImg = document.createElement("img");      
      vTeamLogoImg.src = this.file("logos/" + league + "/" + gameObj.vTeam + "." + this.supportedLeagues[league].logoFormat );
      vTeamLogoImg.setAttribute("data-abbr", gameObj.vTeam);
      
      vTeamLogo.appendChild(vTeamLogoImg);
      boxScore.appendChild(vTeamLogo);
    }

    //add team shortcodes if applicable
    if (this.viewStyleHasShortcodes(viewStyle)) {
      var hTeamSC = document.createElement("span");
      hTeamSC.classList.add("team-short-code", "home");
      hTeamSC.innerHTML = gameObj.hTeam;
      boxScore.appendChild(hTeamSC);

      var vTeamSC = document.createElement("span");
      vTeamSC.classList.add("team-short-code", "visitor");
      vTeamSC.innerHTML = gameObj.vTeam;
      boxScore.appendChild(vTeamSC);
    }

    //add team names if applicable
    if (this.viewStyleHasLongNames(viewStyle)) {
      var hTeamName = document.createElement("span");
      hTeamName.classList.add("team-name", "home");
      hTeamName.innerHTML = gameObj.hTeamLong;
      boxScore.appendChild(hTeamName);

      var vTeamName = document.createElement("span");
      vTeamName.classList.add("team-name", "visitor");
      vTeamName.innerHTML = gameObj.vTeamLong;
      boxScore.appendChild(vTeamName);
    }


    //add "@" for games not yet started for the oneLine
    //and oneLineWithLogos view styles
    if (gameObj.gameMode == this.gameModes.FUTURE && 
      (viewStyle == "oneLine" || viewStyle == "oneLineWithLogos")) {
      var vsSymbol = document.createElement("span");
      vsSymbol.classList.add("vs-symbol");
      vsSymbol.innerHTML = "@";
      boxScore.appendChild(vsSymbol);
    }

    //add game status
    var status = document.createElement("div");
    status.classList.add("status");
    gameObj.status.forEach(function(s) {
      var statusPart = document.createElement("span");
      statusPart.innerHTML = s;
      status.appendChild(statusPart);
    });
    boxScore.appendChild(status);

    //add scores if game in progress or finished
    if (gameObj.gameMode != this.gameModes.FUTURE) {

      var hTeamScore = document.createElement("span");
      hTeamScore.classList.add("score", "home");
      hTeamScore.innerHTML = (gameObj.hScore);
      boxScore.appendChild(hTeamScore);

      var vTeamScore = document.createElement("span");
      vTeamScore.classList.add("score", "visitor");
      vTeamScore.innerHTML = (gameObj.vScore);
      boxScore.appendChild(vTeamScore);

    }

    //add classes to final games
    if (gameObj.gameMode == this.gameModes.FINAL) {
      boxScore.classList.add("final");
      if (gameObj.hScore > gameObj.vScore) {
        boxScore.classList.add("winner-h");
      } else if (gameObj.vScore > gameObj.hScore) {
        boxScore.classList.add("winner-v");
      } else {
        boxScore.classList.add("tie");
      }
    }

    return boxScore;
  },

  // Override dom generator.
  getDom: function() {

    var wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");

    /*
      Set up basic classes
    */
    if (this.config.colored) {
      wrapper.classList.add("colored");
    }
    if (this.config.shadeRows) {
      wrapper.classList.add("shade-rows");
    }
    if (!this.config.showLeagueSeparators) {
      wrapper.classList.add("no-league-separators");
    } 
    if (this.config.highlightWinners) {
      wrapper.classList.add("highlight-winners");
    }

    /*
      Show "Loading" when there's no data initially.
    */
    if (!this.loaded) {
      var loadingText = document.createElement("div");
      loadingText.innerHTML = this.translate("LOADING");
      loadingText.className = "dimmed light small";
      wrapper.appendChild(loadingText);
      return wrapper;
    }


    /*
      Run through the leagues and generate box score displays for
      each game.
    */
    var anyGames = false;
    var self = this;
    this.config.sports.forEach(function(sport, index) {
      if (self.sportsData[index] != null && self.sportsData[index].length > 0) {
        anyGames = true;
        if (self.config.showLeagueSeparators) {
          var leagueSeparator = document.createElement("div");
          leagueSeparator.classList.add("league-separator");
          leagueSeparator.innerHTML = "<span>" + sport.league + "</span>";
          wrapper.appendChild(leagueSeparator);
        }
        self.sportsData[index].forEach(function(game, gidx) {
          var boxScore = self.boxScoreFactory(sport.league, game);
          boxScore.classList.add(gidx % 2 == 0 ? "odd" : "even") ;
          wrapper.appendChild(boxScore);     
        });
      }
    });

    /*
      We're using the lockString parameter to play nicely with
      other modules that attempt to show or hide this module,
      e.g.: MMM-Facial-Recognition.  When both use a lockString,
      the module will only be visible when both agree that it
      should be visible.
    */
    if (!anyGames) {
      this.hide(1000, {lockString: this.identifier});
    } else {
      this.show(1000, {lockString: this.identifier});
    }

    return wrapper;
  },

  socketNotificationReceived: function(notification, payload) {
    if ( notification === "MMM-MYSCOREBOARD-SCORE-UPDATE" && payload.instanceId == this.identifier) {
      console.log("[MMM-MyScoreboard] Updating Scores");
      this.loaded = true;
      this.sportsData[payload.index] = payload.scores;
      this.updateDom();
    }
  },

  start: function() {
    Log.info("Starting module: " + this.name);

    /*
      scrub the config to ensure only supported leagues are included
    */
    var scrubbedSports = [];
    var self = this;

    this.config.sports.forEach(function(sport) {
      if (self.supportedLeagues[sport.league]) {
        scrubbedSports.push(sport);
      }
    });
    this.config.sports = scrubbedSports;

    /*
      initialize variables
    */

    this.loaded = false;
    this.sportsData = new Array();

    if (this.viewStyles.indexOf(this.config.viewStyle) == -1) {
      this.config.viewStyle = "largeLogos";
    }

    /*
      get scores and set up polling
    */

    this.getScores();

    /*
      As of v2.0, poll interval is no longer configurable.
      Providers manage their own data pull schedule in some
      cases (e.g. SNET.js), while others will poll on demand
      when this timer fires. In an effort to keep the APIs
      free and clear, please do not modify this to hammer
      the APIs with a flood of calls.  Doing so may cause the
      respective feed owners to lock down the APIs. Updating
      every two minutes should be more than fine for our purposes.
    */
    setInterval(function() {
      self.getScores();
    }, 2 * 60 * 1000);

  },

  getScores: function() {

    var gameDate = moment(); //get today's date

    if (gameDate.hour() < this.config.rolloverHours) {
      /*
        it's past midnight local time, but within the
        rollover window.  Query for yesterday's games,
        not today's
      */
      gameDate.subtract(1, "day");
    }

    var self = this;
    this.config.sports.forEach( function(sport, index) {

      var payload = {
        instanceId: self.identifier,
        index: index,
        league: sport.league,
        teams: (sport.teams ? sport.teams : null),
        provider: self.supportedLeagues[sport.league].provider,
        gameDate: gameDate
      };

      self.sendSocketNotification("MMM-MYSCOREBOARD-GET-SCORES", payload);


    });



  }

});