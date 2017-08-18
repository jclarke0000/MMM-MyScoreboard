# How To Add New Sports

Sports are modular.  There is a directory for each league under the `sports` directory.  Within each league directory, there is a directory named `logos` that contains all of the team logo files in SVG format, and a javascript file named for the league it represents (e.g.: `NHL.js`).

## Javascript file

The role of the javascript file is to abstract the data processing for the particular league.  It is a Node.js module, with the following minimum structure:


```
/*
  Moment.js is required to handle the date object
  provided to the configure function.  In addition you
  should plan on converting game start times to the
  user's local time zone.  Including Moment Timezone
  can be used for both of these.
*/
const moment = require('moment-timezone');

module.exports = 
{
  /*
    STRING - Name of the league.  Should match the
    directory name for this league (e.g.: "NHL").  Used
    for identification and debug purposes.  Either
    state it as a literal string, or populate it in the
    configure() function using the config.league
    property.
  */
  name: ...,


  /*
    Function configure()

    @param config - the JS Object section of the module's config 
      for this particular sport.

      At a minimum , it shall provide two properties:
        league: STRING (e.g.: "NHL")
        teams: ARRAY of team short codes (e.g.: ["TOR, "MTL"])
    
    Any additional configuration parameters specific to the data
    feed (e.g.: some feeds require an API key) should be provided
    here as well.

  */
  configure: function(config) {
    ...
  },

  /*
    Function getUrl()
      param date - Moment.js date object
      returns STRING - built URL used to retrieve game data

    This function accepts a Moment.js date object and returns
    a built URL String to retrieve data for this league.
  */
  getUrl: function(date) {
    ...
  },

  /*
    Function processData()
      param data - raw data
      returns ARRAY of game objects

    This function will receive the raw data retrieved by a
    GET request to the URL provided by the getURL() function.
    You will need to take care of parsing it into whatever
    format you need to work with (e.g.: JSON, XML Document, etc).

    It returns an array of formatted game objects filtered to
    the teams provided to the configure() function with the
    following properties:

    [
      {
        gameMode: 
        classes: 
        hTeam: 
        vTeam:
        hTeamLong:
        vTeamLong:
        hScore:
        vScore:
        status:
        usePngLogos:
      },
      {
        ...
      }
    ]

    Where:

      gameMode
        NUMBER - 0, 1 or 2 for Not started, In Progress, or Game Over respectively

      classes:
        ARRAY of STRINGS - any additional CSS classes you wish to add to this game.
          Useful for rendering any special cases (e.g.: rain delay for baseball).

      hTeam:
        STRING - Home team's short code

      vTeam:
        STRING - Visiting team's short code

      hTeamLong:
        STRING - Home team's name.  Omit the city (e.g.: "Penguins" instead of 
          "Pittsburgh Penguins")

      vTeamLong:
        STRING - Visiting team's name.  As above, omit the city.

      hScore:
        NUMBER - Home team's score

      vScore:
        NUMBER - Visiting team's score

      status:
        ARRAY of STRINGS - game status is made up of one or more strings.  Split
          the complete status into logical pieces:

          e.g.: ["8:00 pm"] or ["10:53","3rd"]
          
          Each piece will be rendered in its own non-breaking <span> element  This
          is to control where line breaks occur.  If the first example above "8:00 pm"
          will render on one line regardless of available space instead of possibly
          breaking between "8:00" and "pm", while in the second there may be a line
          break between "10:53" and "3rd" depending on available space.

      usePngLogos:
        BOOLEAN (Optional)
        Use this to specify whether to use PNG images for the logos.  If omitted,
        SVG is assumed.

  */
  processData: function(data) {
    ...
  }

}
```

## Logos

Logos are in SVG format and are named with the team's short code.  For example, the short code
for Toronto Maple Leafs is `TOR`, so the logo file would be named `TOR.svg`.  The native size
of the SVG should be greater than the largest size in the CSS (currently 60px in either dimension),
otherwise the logo may render smaller than expected.  Place all logos in a subdirectory named `logos`.


## Example `sports` directory structure

```
sports
    NHL
        logos
            ARI.svg
            ANA.svg
            ...
            WSH.svg
        NHL.js
    NBA
        logos
            ATL.svg
            BOS.svg
            ...
            WAS.svg
        NBA.js
```