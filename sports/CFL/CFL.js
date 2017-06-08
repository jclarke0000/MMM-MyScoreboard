// CFL Module
const moment = require('moment-timezone');

module.exports = 
{
  name: "CFL",

  /*
    This is populated by the configure() function
  */
  teamsIdsToFollow : [],
  apiKey : "",  

  configure: function(config) {
    this.teamsIdsToFollow = config.teams;
    this.apiKey = config.apiKey;
  },

  getUrl: function(date) {
    
    var d = moment(date);
    var tomorrow = moment(date).add(1, 'day');

    var builtURL = 'http://api.cfl.ca/v1/games/' + d.format('YYYY') + 
      '?key=' + this.apiKey +
      '&filter[team][in]=' + this.teamsIdsToFollow.join(",") +
      '&filter[date_start][ge]=' + d.format('YYYY-MM-DD') + 'T00:00:00+00:00' + 
      '&filter[date_start][lt]=' + tomorrow.format('YYYY-MM-DD') + 'T00:00:00+00:00';

    console.log("CFL URL: " + builtURL);

    return '';
  },

  processData: function(data) {
    return [];
  },

}