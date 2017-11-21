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
    showRankings: true,
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
    },
    "NCAAM" : {
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

  viewStyleHasRankingOverlay: function(v) {
    switch (v) {      
      case "largeLogos":
      case "mediumLogos":
      case "smallLogos":
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

      if (this.config.showRankings && this.viewStyleHasRankingOverlay(viewStyle) && gameObj.hTeamRanking) {
        var hTeamRakingOverlay = document.createElement("span");
        hTeamRakingOverlay.classList.add("ranking");
        hTeamRakingOverlay.innerHTML = gameObj.hTeamRanking;
        hTeamLogo.appendChild(hTeamRakingOverlay);
      }
      boxScore.appendChild(hTeamLogo);



      var vTeamLogo = document.createElement("span");
      vTeamLogo.classList.add("logo", "visitor");

      var vTeamLogoImg = document.createElement("img");      
      vTeamLogoImg.src = this.file("logos/" + league + "/" + gameObj.vTeam + "." + this.supportedLeagues[league].logoFormat );
      vTeamLogoImg.setAttribute("data-abbr", gameObj.vTeam);
      
      vTeamLogo.appendChild(vTeamLogoImg);

      if (this.config.showRankings && this.viewStyleHasRankingOverlay(viewStyle) && gameObj.vTeamRanking) {
        var vTeamRakingOverlay = document.createElement("span");
        vTeamRakingOverlay.classList.add("ranking");
        vTeamRakingOverlay.innerHTML = gameObj.vTeamRanking;
        vTeamLogo.appendChild(vTeamRakingOverlay);
      }      
      boxScore.appendChild(vTeamLogo);
    }

    //add team shortcodes if applicable
    if (this.viewStyleHasShortcodes(viewStyle)) {
      var hTeamSC = document.createElement("span");
      hTeamSC.classList.add("team-short-code", "home");
      hTeamSC.innerHTML = (this.config.showRankings && gameObj.hTeamRanking ? "<span class=\"ranking\">" + gameObj.hTeamRanking + "</span>" : "") + gameObj.hTeam;
      boxScore.appendChild(hTeamSC);

      var vTeamSC = document.createElement("span");
      vTeamSC.classList.add("team-short-code", "visitor");
      vTeamSC.innerHTML = (this.config.showRankings && gameObj.vTeamRanking ? "<span class=\"ranking\">" + gameObj.vTeamRanking + "</span>" : "") + gameObj.vTeam;
      boxScore.appendChild(vTeamSC);
    }

    //add team names if applicable
    if (this.viewStyleHasLongNames(viewStyle)) {
      var hTeamName = document.createElement("span");
      hTeamName.classList.add("team-name", "home");
      hTeamName.innerHTML = (this.config.showRankings && gameObj.hTeamRanking ? "<span class=\"ranking\">" + gameObj.hTeamRanking + "</span>" : "") + gameObj.hTeamLong;
      boxScore.appendChild(hTeamName);

      var vTeamName = document.createElement("span");
      vTeamName.classList.add("team-name", "visitor");
      vTeamName.innerHTML = (this.config.showRankings && gameObj.vTeamRanking ? "<span class=\"ranking\">" + gameObj.vTeamRanking + "</span>" : "") + gameObj.vTeamLong;
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

  makeTeamList: function(inst, league, teams, groups) {

    var teamList = [];

    if (teams != null) {
      teamList = teams;
    }

    if (groups != null) {
      for (var i = 0; i < groups.length; i++) {
        var group = inst.groups[league][groups[i]];
        if (group != null) {
          group.forEach( function(team) {
            teamList.push(team);
          });
          
        } 
      }
    } 

    
    if (teamList.length == 0) {
      return null;
    }
    return teamList;

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
        teams: self.makeTeamList(self, sport.league, sport.teams, sport.groups),
        provider: self.supportedLeagues[sport.league].provider,
        gameDate: gameDate
      };

      self.sendSocketNotification("MMM-MYSCOREBOARD-GET-SCORES", payload);


    });



  },

  /*
    This section is for convenience when setting up your configuration.
    If you care only about a certain division in a particular sport,
    you can specify its group name as a shortcut rather than adding
    indiviual teams. This becomes espcially useful for leagues like
    NCAAF and NCAAM where there are hundreds of teams.
  */
  groups: {
    NHL : {

      //divisions
      "Atlantic": ["BOS", "BUF", "DET", "FLA", "MTL", "OTT", "TB", "TOR"],
      "Metropolitain": ["CAR", "CLB", "NJ", "NYI", "NYR", "PIT", "PHI", "WSH"],
      "Central": ["CHI", "COL", "DAL", "MIN", "NSH", "STL", "WPG"],
      "Pacific": ["ANA", "ARI", "CGY", "EDM", "LA", "SJ", "VAN", "VGK"],

      //conferences
      "East": ["BOS", "BUF", "CAR", "CLB", "DET", "FLA", "MTL", "NJ", "NYI", "NYR", "PIT", "PHI", "OTT", "TB", "TOR", "WSH"],
      "West": ["ANA", "ARI", "CGY", "CHI", "COL", "DAL", "EDM", "LA", "MIN", "NSH", "SJ", "STL", "VAN", "VGK", "WPG"],

      //all Canadian teams
      "Canadian": ["CGY", "EDM", "MTL", "OTT", "TOR", "VAN", "WPG"]
    },

    MLB : {

      //divisions
      "AL East": ["BAL", "BOS", "NYY", "TB", "TOR"],
      "AL Central": ["CLE", "CWS", "DET", "KC", "MIN"],
      "AL West": ["HOU", "LAA", "OAK", "SEA", "TEX"],
      "NL East": ["ATL", "MIA", "NYM", "PHI", "WAS"],
      "NL Central": ["CHC", "CIN", "MIL", "PIT", "STL"],
      "NL West": ["ARI", "COL", "LAD", "SD", "SF"],

      //leagues
      "American League": ["BAL", "BOS", "CLE", "CWS", "DET", "HOU", "LAA", "KC", "MIN", "NYY", "OAK", "SEA", "TB", "TEX", "TOR"],
      "National League": ["ARI", "ATL", "CHC", "CIN", "COL", "LAD", "MIA", "MIL", "NYM", "PHI", "PIT", "SD", "SF", "STL", "WAS"]

    },

    NBA : {

      //divisions
      "Atlantic": ["BKN", "BOS", "NY", "PHI", "TOR"],
      "Central": ["CHI", "CLE", "DET", "IND", "MIL"],
      "Southeast": ["ATL", "CHA", "MIA", "ORL", "WSH"],
      "Northwest": ["DEN", "MIN", "OKC", "POR", "UTAH"],
      "Pacific": ["GS", "LAC", "LAL", "PHX", "SAC"],
      "Southwest": ["DAL", "HOU", "MEM", "NO", "SA"],

      //conferences
      "East": ["ATL", "BKN", "BOS", "CHA", "CHI", "CLE", "DET", "IND", "MIA", "MIL", "NY", "ORL", "PHI", "TOR", "WSH"],
      "West": ["DAL", "DEN", "GS", "HOU", "LAC", "LAL", "MEM", "MIN", "NO", "OKC", "PHX", "POR", "SA", "SAC", "UTAH"]

    },

    NFL : {

      //divisions
      "AFC East" : ["NE", "BUF", "MIA", "NYJ"],
      "AFC North" : ["BAL", "CIN", "CLE", "PIT"],
      "AFC South" : ["JAX", "HOU", "IND", "TEN"],
      "AFC West" : ["DEN", "KC", "LAC", "OAK"],
      "NFC East" : ["DAL", "NYG", "PHI", "WAS"],
      "NFC North" : ["CHI", "DET", "GB", "MIN"],
      "NFC South" : ["ATL", "CAR", "NO", "TB"],
      "NFC West" : ["ARI", "LA", "SEA", "SF"],

      //conferences
      "AFC" : ["BAL", "BUF", "CIN", "CLE", "DEN", "HOU", "IND", "JAX", "KC", "LAC", "MIA", "NE", "NYJ", "OAK", "PIT", "TEN"],
      "NFC" : ["ARI", "ATL", "CAR", "CHI", "DAL", "DET", "GB", "LA", "MIN", "NO", "NYG", "PHI", "SEA", "SF", "TB", "WAS"]
    },

    MLS : {

      //conferences
      "East" : ["ATL", "CHI", "CLB", "DC", "MTL", "NY", "NYC", "NE", "ORL", "PHI", "TOR"],
      "West" : ["COL", "DAL", "HOU", "KC", "LA", "MIN", "POR", "RSL", "SEA", "SJ", "VAN"]

    },

    CFL : {

      //conferences
      "East" : ["HAM", "MTL", "OTT", "TOR"],
      "West" : ["BC", "CGY", "EDM", "SSK", "WPG"]

    },

    NCAAF : {

      //divisions
      "American Athletic" : ["CIN", "CONN", "ECU", "HOU", "MEM", "NAVY", "SMU", "TEM", "TULN", "TLSA", "UCF", "USF"],
      "ACC" : ["BC", "CLEM", "DUKE", "FSU", "GT", "LOU", "MIAMI", "NCST", "PITT", "SYR", "UNC", "UVA", "VT", "WAKE"],
      "Big 12" : ["BAY", "ISU", "KU", "KSU", "OKLA", "OKST", "TCU", "TEX", "TTU", "WVU"],
      "Big Ten" : ["ILL", "IND", "IOWA", "MD", "MICH", "MSU", "MINN", "NEB", "NW", "OSU", "PSU", "PUR", "RUTG", "WIS"],
      "Conference USA" : ["CHAR", "FAU", "FIU", "LT", "MRSH", "MTSU", "UNT", "ODU", "RICE", "UAB", "USM", "UTEP", "UTSA", "WKU"],
      "FBS Independents" : ["ARMY", "BYU", "ND", "UMASS"],
      "Mid-American" : ["AKR", "BALL", "BGSU", "BUFF", "CMU", "EMU", "KENT", "M-OH", "NIU", "OHIO", "TOL", "WMU"],
      "Mountain West" : ["AFA", "BSU", "CSU", "FRES", "HAW", "NEV", "SDSU", "SJSU", "UNLV", "UNM", "USU", "WYO"],
      "Pac-12" : ["ARIZ", "ASU", "CAL", "COLO", "ORE", "ORST", "STAN", "UCLA", "USC", "UTAH", "WASH", "WSU"],
      "SEC" : ["ALA", "ARK", "AUB", "FLA", "UGA", "UK", "LSU", "MISS", "MSST", "MIZ", "SC", "TENN", "TA&M", "VAN"],
      "Sun Belt" : ["APP", "ARST", "CCU", "GASO", "GAST", "IDHO", "ULL", "ULM", "NMSU", "USA", "TXST", "TROY"],
      "Top 25" : ["@T25"] //special indicator for Top 25 ranked teams

    },

    NCAAM : {

      //divisions
      "America East" : ["ALBY", "BING", "HART", "MAINE", "STON", "UML", "UMBC", "UNH", "UVM"],
      "American" : ["CIN", "CONN", "ECU", "HOU", "MEM", "SMU", "USF", "TEM", "TULN", "UCF", "WICH"],
      "Atlantic 10" : ["DAV", "DAY", "DUQ", "FOR", "GMU", "GW", "LAS", "RICH", "JOES", "SLU", "SBON", "UMASS", "URI", "VCU"],
      "ACC" : ["BC", "CLEM", "DUKE", "FSU", "GT", "LOU", "MIA", "NCST", "UNC", "ND", "PITT", "SYR", "UVA", "VT", "WAKE"],
      "Atlantic Sun" : ["FGCU", "JAC", "KENN", "LIP", "NJIT", "UNF", "UPST", "STET"],
      "Big 12" : ["BAY", "ISU", "KU", "KSU", "OKLA", "OKST", "TCU", "TEX", "TTU", "WVU"],
      "Big East" : ["BUT", "CREI", "DEP", "GTWN", "MARQ", "PROV", "HALL", "SJU", "VILL", "XAV"],
      "Big Sky" : ["EWU", "IDHO", "IDST", "MONT", "MTST", "NAU", "PRST", "SAC", "SUU", "UNCO", "UND", "WEB"],
      "Big South" : ["CAM", "CHSO", "WEBB", "HP", "LIB", "LONG", "PRE", "RAD", "UNCA", "WIN"],
      "Big Ten" : ["ILL", "IND", "IOWA", "MD", "MICH", "MSU", "MINN", "NEB", "NW", "OSU", "PSU", "PUR", "RUTG", "WIS"],
      "Big West" : ["CP", "CSF", "CSUN", "HAW", "LBSU", "UCD", "UCI", "UCRV", "UCSB"],
      "Colonial" : ["COFC", "DEL", "DREX", "ELON", "HOF", "JMU", "NE", "TOWS", "UNCW", "WM"],
      "Conference USA" : ["CHAR", "FAU", "FIU", "LT", "MRSH", "MTU", "ODU", "RICE", "UAB", "UNT", "USM", "UTSA", "UTEP", "WKU"],
      "Horizon" : ["CLEV", "DET", "GB", "IUPU", "MILW", "NKU", "OAK", "UIC", "WRST", "YSU"],
      "Ivy" : ["BRWN", "CLMB", "COR", "DART", "HARV", "PENN", "PRIN", "YALE"],
      "MAAC" : ["CAN", "FAIR", "IONA", "MAN", "MRST", "MONM", "NIAG", "QUIN", "RID", "SPU", "SIE"],
      "Mid-American" : ["AKR", "BALL", "BGSU", "BUFF", "CMU", "EMU", "KENT", "M-OH", "NIU", "OHIO", "TOL", "WMU"],
      "MEAC" : ["BCU", "COPP", "DSU", "FAMU", "HAMP", "HOW", "MORG", "NSU", "NCAT", "NCCU", "SAV", "SCST", "UMES"],
      "Missouri Valley" : ["BRAD", "DRKE", "EVAN", "ILST", "INST", "L-IL", "MOST", "UNI", "SIU", "VALP"],
      "Mountain West" : ["AFA", "BSU", "CSU", "FRES", "NEV", "UNM", "SDSU", "SJSU", "UNLV", "USU", "WYO"],
      "Northeast" : ["BRY", "CCSU", "FDU", "LIU", "MSM", "RMU", "SHU", "SFNY", "SFU", "WAG"],
      "Ohio Valley" : ["BEL", "EIU", "EKY", "JVST", "MORE", "MURR", "PEAY", "SEMO", "SIUE", "TNST", "TNTC", "UTM"],
      "Pac-12" : ["ARIZ", "ASU", "CAL", "COLO", "ORE", "ORST", "STAN", "UCLA", "USC", "UTAH", "WASH", "WSU"],
      "Patriot League" : ["AMER", "ARMY", "BU", "BUCK", "COLG", "HC", "LAF", "LEH", "L-MD", "NAVY"],
      "SEC" : ["ALA", "ARK", "AUB", "FLA", "LSU", "MSST", "MIZ", "MISS", "SC", "TENN", "TAMU", "UGA", "UK", "VAN"],
      "Southern" : ["CHAT", "ETSU", "FUR", "MER", "SAM", "CIT", "UNCG", "VMI", "WCU", "WOF"],
      "Southland" : ["ACU", "AMCC", "HBU", "IW", "LAM", "MCNS", "NICH", "NWST", "SHSU", "SELA", "SFA", "UCA", "UNO"],
      "SWAC" : ["AAMU", "ALST", "ALCN", "GRAM", "JKST", "MVSU", "PV", "SOU", "TXSO", "UAPB"],
      "Summit League" : ["DEN", "IPFW", "NDSU", "OMA", "ORU", "SDAK", "SDST", "WIU"],
      "Sun Belt" : ["APP", "ARST", "CCAR", "GASO", "GAST", "TXST", "TROY", "UALR", "ULL", "ULM", "USA", "UTA"],
      "West Coast" : ["BYU", "GONZ", "LMU", "PAC", "PEPP", "PORT", "SMC", "USD", "SF", "SCU"],
      "WAC" : ["CHS", "CSB", "GCU", "NMSU", "SEA", "TRGV", "UMKC", "UVU"],
      "Top 25" : ["@T25"] //special indicator for Top 25 ranked teams  

    }

  }

});