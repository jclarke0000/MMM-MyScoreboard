# MMM-MyTTC

This a module for [MagicMirror](https://github.com/MichMich/MagicMirror/tree/develop).

This module display's today's scores for your favourite across a number of different sports.


## Installation

1. Navigate into your MagicMirror `modules` folder and execute<br>
`git clone https://github.com/jclarke0000/MMM-MyScoreboard`.
2. Enter the new `MMM-MyScoreboard` directory and execute `npm install`.


## Configuration

<table>
  <thead>
    <tr>
      <th>Option</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>showHeader</code></td>
      <td>Whether to show the module header.<br><br><strong>Type</strong> <code>Boolean</code><br />Defaults to <code>true</code>.</td>
    </tr>
    <tr>
      <td><code>headerText</code></td>
      <td>Text to display on the module header.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>"My Scoreboard"</code></td>
    </tr>
    <tr>
      <td><code>dataPollInterval</code></td>
      <td>How frequently to poll for data in milliseconds.<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>300000</code> (i.e.: every 5 minutes)</td>
    </tr>
    <tr>
      <td><code>showLeagueSeparators</code></td>
      <td>Whether to show separators between different leagues.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>colored</code></td>
      <td>Whether to present module in colour or black-and-white.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>rolloverHours</code></td>
      <td>How many hours past midnight to continue to show the previous day's games.<br><br><strong>Type</strong> <code>Number</code><br>Defaults to <code>3</code> (i.e.: continue to show yesterday's games until 3:00 AM)</td>
    </tr>
    <tr>
      <td><code>sports</code></td>
      <td><strong>REQUIRED</strong> An array of leagues and teams you wish to follow.<br><br><strong>Type</strong> <code>Array</code><br>See below for instructions to configure your <code>sports</code> list.</td>
    </tr>
  </tbody>
</table>


## Configuring your sports list

Currently this module supports the following leagues:

* **NHL** - National Hockey League
* **NBA** - National Basketball Association
* **MLB** - Major League Baseball

Each entry in your `sports` array is an object with two properties:

<table>
  <thead>
    <tr>
      <th>Property</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>league</code></td>
      <td><strong>REQUIRED</strong> e.g.: <code>"NHL"</code>.<br><br><strong>Type</strong> <code>String</code></td>
    </tr>
    <tr>
      <td><code>teams</code></td>
      <td><strong>REQUIRED</strong> an array of teams for which you want to see scores.  Specify teams using their shortcodes (e.g.: <code>"TOR"</code> for Toronto Maple Leafs.<br><br><strong>Type</strong> <code>Array</code><br>See below for a full listing of teams and their short codes</td>
    </tr>
  </tbody>
</table>


## Example configuration

```
{
  module: "MMM-MyScoreboard",
  position: "top_right",
  classes: "default everyone",
  config: {
    showHeader: true,
    headerText: "Today's Scores",
    showLeagueSeparators: true,
    colored: true,
    sports: [
      {
        league: 'NHL',
        teams: ['TOR','NYY']
      },
      {
        league: 'NBA',
        teams: ['TOR']
      },
      {
        league: 'MLB',
        teams: ['TOR', 'WSH', 'CLE']
      },
    ]

  }
},

```

## Leagues and Team Shortcodes

to do.
