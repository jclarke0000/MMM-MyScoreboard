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
    dataPollInterval: 5 * 60 * 1000, //update every 5 minutes
    showLeagueSeparators: true,
    colored: true,
    rolloverHours: 3, //hours past midnight to show the pervious day's scores
    viewStyle: "largeLogos",
    sports: [
      {
        league: 'NHL',
        teams: ['TOR','MTL','OTT','WPG','CGY','EDM','VAN']
      },
      {
        league: 'NBA',
        teams: ['TOR']
      },
      {
        league: 'MLB',
        teams: ['TOR']
      },
    ]
  },

  // Define required styles.
  getStyles: function () {
    return ["MMM-MyScoreboard.css"];
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
      case 'largeLogos':
      case 'mediumLogos':
      case 'smallLogos':
      case 'oneLineWithLogos':
      case 'stackedWithLogos':
        return true;
        break;
      default:
        return false;
        break;
    }
  },

  viewStyleHasShortcodes: function(v) {
    switch(v) {
      case 'oneLine':
      case 'oneLineWithLogos':
        return true;
        break;
      default:
        return false;
        break;
    }
  },

  viewStyleHasLongNames: function(v) {
    switch(v) {
      case 'stacked':
      case 'stackedWithLogos':
        return true;
        break;
      default:
        return false;
        break;
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

    var viewStyle = this.config.viewStyle

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
      var hTeamLogo = document.createElement("img");
      hTeamLogo.classList.add("logo", "home");
      hTeamLogo.src = this.file("sports/" + league + "/logos/" + gameObj.hTeam + ".svg");
      hTeamLogo.setAttribute("alt", gameObj.hTeam);
      boxScore.appendChild(hTeamLogo);

      var vTeamLogo = document.createElement("img");
      vTeamLogo.classList.add("logo", "visitor");
      vTeamLogo.src = this.file("sports/" + league + "/logos/" + gameObj.vTeam + ".svg");
      vTeamLogo.setAttribute("alt", gameObj.vTeam);
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
      (viewStyle == 'oneLine' || viewStyle == 'oneLineWithLogos')) {
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

    return boxScore;
  },

  // Override dom generator.
  getDom: function() {
    var wrapper = document.createElement("div");
    wrapper.classList.add("wrapper");
    if (this.config.colored) {
      wrapper.classList.add("colored");
    }

    if (!this.loaded) {
      var loadingText = document.createElement("div");
        loadingText.innerHTML = this.translate('LOADING');
        loadingText.className = "dimmed light small";
      wrapper.appendChild(loadingText);
      return wrapper;
    }

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
        };
        self.sportsData[index].forEach(function(game) {
          wrapper.appendChild(self.boxScoreFactory(sport.league, game));          
        });
      }
    });

    // console.log("anyGames = " + anyGames);
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
    if ( notification === 'MMM-MYSCOREBOARD-DATA') {
      this.loaded = true;
      this.sportsData[payload.index] = payload.data;
      this.updateDom();
    }
  },

  start: function() {
    Log.info("Starting module: " + this.name);
    this.loaded = false;
    this.sportsData = new Array();

    if (this.viewStyles.indexOf(this.config.viewStyle) == -1) {
      this.config.viewStyle = "largeLogos"
    } 
    this.sendSocketNotification("MMM-MYSCOREBOARD-START", this.config);
  },


});