# MMM-MyScoreboard

This a module for <strong>MagicMirror</strong><br>
https://magicmirror.builders/<br>
https://github.com/MichMich/MagicMirror

This module display's today's scores for your favourite teams across a number of different
leagues, including NHL, NBA, NFL, MLB, MLS, CFL and NCAAF (FBS Division).

![Screen Shot](/../screenshots/MMM-MyScoreboard-screenshot.png?raw=true "Screen Shot")


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
      <td><code>viewStyle</code></td>
      <td>One of the following: <code>largeLogos</code>, <code>mediumLogos</code>, <code>smallLogos</code>, <code>oneLine</code>, <code>oneLineWithLogos</code>, <code>stacked</code> or <code>stackedWithLogos</code>.<br><br><strong>Type</strong> <code>String</code><br>Defaults to <code>largeLogos</code><br />See below for examples of the view styles.</td>
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
* **NFL** - National Football League
* **MLS** - Major League Soccer
* **CFL** - Canadian Football League (requires an API key from http://api.cfl.ca/key-request)
* **NCAAF** - NCAA College Football (FBS Division only)

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
    <tr>
      <td><code>apiKey</code></td>
      <td><strong>REQUIRED FOR CFL</strong> You need to request an API key from CFL tech support here:<br>http://api.cfl.ca/key-request</td>
    </tr>
  </tbody>
</table>


## Example configuration

```
{
  module: "MMM-MyScoreboard",
  position: "top_right",
  classes: "default everyone",
  header: "My Scoreboard",
  config: {
    showLeagueSeparators: true,
    colored: true,
    viewStyle: "mediumLogos",
    sports: [
      {
        league: "NHL",
        teams: ["TOR", "PIT"]
      },
      {
        league: "NBA",
        teams: ["TOR"]
      },
      {
        league: "MLB",
        teams: ["TOR", "CHW", "NYY"]
      },
      {
        league: "NFL",
        teams: ["BUF", "NYJ", "NYG"]
      },
      {
        league: "CFL",
        teams: ["TOR", "MTL", "OTT"],
        apiKey: "your_secret_API_key"
      }
    ]

  }
},

```

## View Styles

Examples of the available view styles you can specify with the `viewStyle` parameter.

![View Styles](/../screenshots/viewStyles.jpg?raw=true "View Styles")

`smallLogos`<br />
![View Styles](/../screenshots/viewStyle_smallLogos.png?raw=true "smallLogos")


## Leagues and Team Shortcodes

### NHL

```
ANA   Anaheim Ducks
ARI   Arizona Coyotes
BOS   Boton Bruins
BUF   Buffalo Sabres
CAR   Carolina Hurricanes
CLB   Columbus Blue Jackets
CGY   Calgary Flames
CHI   Chicago Black Hawks
COL   Colorado Avalanche
DAL   Dallas Stars
DET   Detroit Red Wings
EDM   Edmonton Oilers
FLA   Florida Panthers
LA    Los Angeles Kings
MIN   Minnesota Wild
MTL   Montreal Canadiens
NJD   New Jersey Devils
NSH   Nashville Predators
NYI   New York Islanders
NYR   New York Rangers
OTT   Ottawa Senators
PHI   Philadelphia Flyers
PIT   Pittsburgh Penguins
SJS   San Jose Sharks
STL   St. Louis Blues
TB    Tamba Bay Lightning
TOR   Toronto Maple Leafs
VAN   Vanvouver Canucks
VGK   Vegas Golden Knights
WPG   Winnipeg Jets
WSH   Washington Capitals
```

### MLB

```
ARI   Arizona Diamondbacks
ATL   Atlanta Braves
BAL   Baltimore Orioles
BOS   Boston Red Sox
CHC   Chicago Cubs
CIN   Cincinnati reds
CLE   Cleveland Indians
COL   Colorado Rockies
CWS   Chicago White Sox
DET   Detroit Tigers
HOU   Houston Astros
KC    Kansas City Royals
LAA   Los Angeles Angels
LAD   Los Angeles Dodgers
MIA   Miami Marlins
MIL   Milwaukee Brewers
MIN   Minnesota Twons
NYM   New York Mets
NYY   New York Yankees
OAK   Oakland Athletics
PHI   Philadelphia Phillies
PIT   Pittsburgh Pirates
SD    San Diego Padres
SEA   Seattle Mariners
SF    San Francisco Giants
STL   St. Louis Cardinals
TB    Tampa Bay Rays
TEX   Texas Rangers
TOR   Toronto Blue Jays
WAS   Washington Nationals
```

### NBA

```
ATL   Atlanta Hawks
BKN   Brooklyn Nets
BOS   Boston Celtics
CHA   Charlotte Hornets
CHI   Chicago Bulls
CLE   Cleveland Cavaliers
DAL   Dallas Mavericks
DEN   Denver Nuggets
DET   Detroit Pistons
GSW   Golden State Warriors
HOU   Houston Rockets
IND   Indiana Pacers
LAC   Los Angeles Clippers
LAL   Los Angeles Lakers
MEM   Memphis Grizzlies
MIA   Miami Heat
MIL   Milwaukee Bucks
MIN   Minnesota Timberwolves
NOP   New Orleans Pelicans
NYK   New York Knicks
OKC   Oklahoma City Thunder
ORL   Orlando Magic
PHI   Philadelphia 76ers
PHX   Phoenix Suns
POR   Portland Trail Blazers
SAC   Sacramento Kings
SAS   San Antonio Spurs
TOR   Toronto Raptors
UTA   Utah Jazz
WAS   Washington Wizards
```

### NFL
```
ARI   Arizona Cardinals
ATL   Atlanta Falcons
BAL   Baltimore Ravens
BUF   Buffalo Bills
CAR   Carolina Panthers
CHI   Chicago Bears
CIN   Cincinati Bengals
CLE   Cleveland Browns
DAL   Dallas Cowboys
DEN   Denver Broncos
DET   Detroit Lions
GB    Green Bay Packers
HOU   Houston Texans
IND   Indianapolis Colts
JAX   Jacksonville Jaguars
KC    Kansas City Chiefs
LA    Los Angeles Rams
LAC   Los Angeles Chargers
MIA   Miami Dolphins
MIN   Minnesota Vikings
NE    New England Patriots
NO    New Orleans Saints
NYG   New York Giants
NYJ   New York Jets
OAK   Oakland Raiders
PHI   Philadelphia Eagles
PIT   Pittsburgh Steelers
SEA   Seattle Seahawks
SF    San Francisco 49ers
TB    Tampa Bay Buccaneers
TEN   Tennessee Titans
WAS   Washington Redskins
```

### MLS
```
ATL   Atlanta United FC
CHI   Chicago Fire
CLB   Columbus Crew SC
COL   Colorado Rapids
DAL   FC Dallas
DCU   DC United
HOU   Houston Dynamo
LAG   LA Galaxy
MNU   Minnesota United FC
MTL   Montreal Impact
NWE   New England Revolution
NWY   New York Red Bulls
NYC   New York City FC
ORL   Orlando City FC
PHI   Philadelphia Union
POR   Portland Timbers
RSL   Real Salt Lake
SAN   San Jose Earthquakes
SEA   Seattle Sounders FC
SKC   Sporting Kansas City
TOR   Toronto FC
VAN   Vancouver Whitecaps
```

### CFL
```
BC    B.C. Lions
CGY   Calgary Stampeders
EDM   Edmonton Eskimos
HAM   Hamilton Tiger-Cats
MTL   Montreal Alouetts
OTT   Ottawa Redblacks
SSK   Saskatchewan Roughriders
TOR   Toronto Argonauts
WPG   Winnipeg Blue Bombers
```

### NCAAF (FBS Division)
```
AFA   Air Force Falcons
AKR   Akron Zips
ALA   Alabama Crimson Tide
APP   Appalachian State Mountaineers
ARIZ  Arizona Wildcats
ARK   Arkansas Razorbacks
ARMY  Army West Point Black Knights
ARST  Arkansas State Red Wolves
ASU   Arizona State Devils
AUB   Auburn Tigers
BALL  Ball State Cardinals
BAY   Baylor Bears
BC    Boston College Eagles
BGSU  Bowling Green Falcons
BSU   Boise State Broncos
BUFF  Buffalo Bills
BYU   BYU Cougars
CAL   California Golden Bears
CCU   Coastal Carolina Chanticleers
CHAR  Charlotte 49ers
CIN   Cincinnati Bearcats
CLEM  Clemson Tigers
CMU   Central Michigan Chippewas
COLO  Colorado Buffalos
CONN  Connecticut Juskies
CSU   Colorado State Rams
DUKE  Duke Blue Devils
ECU   East Carolina Pirates
EMU   Eastern Michigan Eagles
FAU   Florida Atlantic Owls
FIU   Florida International Golden Panthers
FLA   Florida Gators
FRES  Fresno State Bulldogs
FSU   Florida State Seminoles
GASO  Georgia Southern Eagles
GAST  Georgia State Panthers
GT    Georgia Tech Yellow Jackets
HAW   Hawaii Rainbow Warriors
HOU   Houston Cougars
IDHO  Idaho Vandals
ILL   Illinois Fighting Illini
IND   Indiana Hoosiers
IOWA  Iowa Hawkeyes
ISU   Iowa State Cyclones
KENT  Kent State Golden Flashes
KSU   Kansas State Wildcats
KU    Kansas Jayhawks
LOU   Louisville Cardinals
LSU   LSU Tigers
LT    Louisianna Tech Bulldogs
M-OH  Miami (OH) Redhawks
MD    Maryland Terrapins
MEM   Memphis Tigers
MIAMI Miami Hurricanes
MICH  Michigan Wolverines
MINN  Minnesota Golden Gophers
MISS  Ole Miss Rebels
MIZ   Missouri Tigers
MRSH  Marshall Thundering Herd
MSST  Mississippi State Bulldogs
MSU   Michigan State Spartans
MTSU  Middle Tennessee Blue Raiders
NAVY  Navy Midshipmen
NCST  North Carolina State Wolfpack
ND    Notre Dame Fighting Irish
NEB   Nebraska Cornhuskers
NEV   Nevada Wolf Pack
NIU   Northern Illinois Huskies
NMSU  New Mexico State Aggies
NW    Northwestern Wildcats
ODU   Old Dominion Monarchs
OHIO  Ohio Bobcats
OKLA  Oklahoma Sooners
OKST  Oklahoma State Cowboys
ORE   Oregon Ducks
ORST  Oregon State Beavers
OSU   Ohio State Buckeyes
PITT  Pittsburgh Panthers
PSU   Penn State Nittany Lions
PUR   Purdue Boilermakers
RICE  Rice Owls
RUTG  Rutgers Scarlet Knights
SC    South Carolina Gamecocks
SDSU  San Diego State Aztecs
SJSU  San Jose State Spartans
SMU   SMU Mustangs
STAN  Stanford Cardinal
SYR   Syracuse Orange
TA&M  Texas A&M Aggies
TCU   TCU Horned Frogs
TEM   Temple Owls
TENN  Tennessee Volunteers
TEX   Texas Long Horns
TLSA  Tulsa Golden Hurricane
TOL   Toledo Rockets
TROY  Troy Trojans
TTU   Texas Tech Red Raiders
TULN  Tulane Green Wave
TXST  Texas State Bobcats
UAB   UAB Blazers
UCF   UCF Knights
UCLA  UCLA Bruins
UGA   Georgia Bulldogs
UK    Kentucky Wildcats
ULL   Louisianna-Lafayette Ragin' Cajuns
ULM   Louisianna-Monroe Warhawks
UMASS Massachusetts Minutemen
UNC   North Carolina Tar Heels
UNLV  UNLV Rebels
UNM   New Mexico Lobos
UNT   North Texas Mean Green
USA   South Alabama Jaguars
USC   USC Trojans
USF   South Florida Bulls
USM   Southern Mississippi Golden Eagles
USU   Utah State Aggies
UTAH  Utah Utes
UTEP  UTEP Miners
UTSA  UT San Antonio Roadrunners
UVA   Virginia Cavaliers
VAN   Vanderbilt Commodores
VT    Virginia Tech Hokies
WAKE  Wake Forest Demon Deacons
WASH  Washington Huskies
WIS   Wisconsin Badgers
WKU   Western Kentucky Hilltoppers
WMU   Western MNichigan Broncos
WSU   Washington State Cougars
WVU   West Virginia Mountaineers
WYO   Wyoming Cowboys
```