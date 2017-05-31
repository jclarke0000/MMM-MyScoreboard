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
    showHeader: true,
    headerText: "My Scoreboard",
    dataPollInterval: 5 * 60 * 1000, //update every 5 minutes
    showLeagueSeparators: true,
    colored: true,
    rolloverHours: 3, //hours past midnight to show the pervious day's scores
    sports: [
      {
        league: 'NHL',
        teams: ['PIT','NSH']
      },
      {
        league: 'NBA',
        teams: ['CLE','GSW']
      },
      {
        league: 'MLB',
        teams: ['TOR', 'WSH', 'CLE']
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

  /******************************************************************

    Function boxScoreFactory()
    
    Parameters:
      gameObj: Object of a single game's data

    Generates an HTML snippet representing one game in the list.
    Scores are ommitted if gameObj.gameMode == FUTURE

    <div class='box-score league'>
      <img class='logo home' src='logos/league/hTeamShortcode.svg' alt='hTeam' />
      <img class='logo visitor' src='logos/league/vTeamShortcode.svg' alt='vTeam' />
      <span class='status'>status</span>
      <span class='score home'>hScore</span>
      <span class='score visitor'>vScore</span>
    </div>
  ******************************************************************/
  boxScoreFactory: function(league, gameObj) {

    var boxScore = document.createElement("div");
    boxScore.classList.add("box-score", league);
    if (gameObj.gameMode == this.gameModes.IN_PROGRESS) {
      boxScore.classList.add("in-progress");
    } 

    //add team logos
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

    //add game status
    var status = document.createElement("span");
    status.classList.add("status");
    status.innerHTML = gameObj.status;
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

    if (this.config.showHeader) {
      var header = document.createElement("header");
      header.classList.add("module-header");
      header.innerHTML = this.config.headerText;
      wrapper.appendChild(header);
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
          leagueSeparator.innerHTML = sport.league;
          wrapper.appendChild(leagueSeparator);
        };
        self.sportsData[index].forEach(function(game) {
          wrapper.appendChild(self.boxScoreFactory(sport.league, game));          
        });
      }
    });

    console.log("anyGames = " + anyGames);
    if (!anyGames) {
      this.hide(1000);
    } else {
      this.show(1000);
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
    this.sendSocketNotification("MMM-MYSCOREBOARD-START", this.config);
  },


});