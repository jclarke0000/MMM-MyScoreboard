# MMM-MyScoreboard

This a module for <strong>MagicMirror</strong><br>
https://magicmirror.builders/<br>
https://github.com/MichMich/MagicMirror

This module display's today's scores for your favourite teams across a number of different
leagues, including:

* NHL Hockey
* NBA Basketball
* MLB Baseball
* NFL Footabll
* CFL Footabll (Canadian Footbal League)
* MLS Soccer
* NCAA College Football (FBS Division)
* NCAA College Basketball (Division I and March Madness)
* Over 100 soccer leagues including:
  * English Premier League
  * UEFA Champions League
  * UEFA Europa League
  * UEFA Nations League
  * FIFA World Cup
  * Brazilian Serie A
  * Bundesliga German League
  * French Ligue 1
  * CONMEBOL Libertadores
  * Italian Serie A
  * Spanish La Liga
  * Mexican Liga BBVA Bancomer


![Screenshot](/../screenshots/MMM-MyScoreboard-screenshot.png?raw=true "Screenshot")


## Installation

1. Navigate into your MagicMirror `modules` folder and execute<br>
`git clone https://github.com/jclarke0000/MMM-MyScoreboard`.
2. Enter the new `MMM-MyScoreboard` directory and execute `npm install`.


## Notice to anyone updating from previous versions

1. Run `git pull` in the `MMM-MyScoreboard` directory to get the latest source code. If you are not seeing the latest update, then try deleting your `MMM-MyScoreboard` directory and reclone it as per the initial installation instructions above.
2. Still in the `MMM-MyScoreboard` directory, run `npm install`.
3. (Optional) Run `npm prune` to remove some packages that are no longer needed.
4. As the providers have changed for most sports, some of the team shortcodes are different. If you're not seeing your team show up even though you know a game is scheduled, check your config against the list of team shortcodes below.


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
      <td><code>shadeRows</code></td>
      <td>Whether to shade alternate rows.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>false</code></td>
    </tr>
    <tr>
      <td><code>highlightWinners</code></td>
      <td>For games that are final, the winning team / score is highlighted.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>showRankings</code></td>
      <td>For the NCAAF and NCAAM, whether to show the rankings for the top 25 teams.<br><br><strong>Type</strong> <code>Boolean</code><br>Defaults to <code>true</code></td>
    </tr>
    <tr>
      <td><code>sports</code></td>
      <td><strong>REQUIRED</strong> An array of leagues and teams you wish to follow.<br><br><strong>Type</strong> <code>Array</code><br>See below for instructions to configure your <code>sports</code> list.</td>
    </tr>
  </tbody>
</table>



## Configuring your sports list

Each entry in your `sports` array is an object with the following properties:

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
      <td><strong>REQUIRED</strong> e.g.: <code>"NHL"</code>. Use any of the bold, uppercase league labaels from the list bleow.<br><br><strong>Type</strong> <code>String</code></td>
    </tr>
    <tr>
      <td><code>label</code></td>
      <td>If <code>showLeagueSeparators</code> is set to <code>true</code>, you can optionally set a custom label for the separator. Useful in particular to show something other than <code>"NCAAM_MM"</code> for the March Madness tournament.<br><br><strong>Type</strong> <code>String</code><br />Defaults to the value for <code>league</code>.</td>
    </tr>
    <tr>
      <td><code>teams</code></td>
      <td>An array of teams for which you want to see scores.  Specify teams using their shortcodes (e.g.: <code>"TOR"</code> for Toronto Maple Leafs.<br><br><strong>Type</strong> <code>Array</code><br>See below for a full listing of teams and their short codes<br><br><strong>UPDATE v2.0:</strong> This is no longer required.</td>
    </tr>
    <tr>
      <td><code>groups</code></td>
      <td>In addition to specifying individual teams, you may also specify groups.  Generally these groups correspond to the league's respective conferences and divisions.  See below for a full listing of groups available for each league. (e.g.: <code>["Atlantic", "Metropolitain"]</code> for teams in the Atlantic and Metropolitain divisions.<br><br><strong>Type</strong> <code>Array</code></td>
    </tr>
  </tbody>
</table>

It should be noted that if you specify arrays for both <code>teams</code> and <code>groups</code> they will be added together.  So it's possible to make a team list out of a division and a few other specific teams.  If you omit both parameters, then all games for the particular league will be shown.


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
        groups: ["Atlantic"]
      },
      {
        league: "NBA",
        teams: ["TOR"],
        groups: ["Pacific", "Central"]
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
        teams: ["TOR", "MTL", "OTT"]
      },
      {
        league: "NCAAM_MM",
        label: "March Madness"
      }
    ]

  }
},

```

## Supported Leagues

Currently this module supports the following leagues.  Use the bold uppercase shortcodes in your config above. Please note that while this module supports well over 100 leagues, please do not abuse this.  We're lucky to be able to use the sports API's free and clear, but there's no telling what might happen if we all configure our modules to get scores for every league.  Please just use configure the leagues you are most interested in.

### Canadian and American Leagues

* **NHL** - National Hockey League
* **NBA** - National Basketball Association
* **MLB** - Major League Baseball
* **NFL** - National Football League
* **CFL** - Canadian Football League
* **MLS** - Major League Soccer
* **NCAAF** - NCAA College Football (FBS Division only)
* **NCAAM** - NCAA College Basketball (Division I)
* **NCAAM_MM** - NCAA College Basketball (March Madness Tournament)


### Soccer Leagues & Competitions

#### Most Popular
* **ENG_PREMIERE_LEAGUE** - English Premier League
* **UEFA_CHAMPIONS** - UEFA Champions League
* **UEFA_EUROPA** - UEFA Europa League
* **UEFA_NATIONS** - UEFA Nations League
* **FIFA_WORLD_CUP** - FIFA World Cup
* **BRA_SERIE_A** - Brazilian Serie A
* **GER_BUNDESLIGA** - German Bundesliga
* **FRA_LIGUE_1** - French Ligue 1
* **CONMEBOL_COPA_LIBERTADORES** - CONMEBOL Copa Libertadores
* **ITA_SERIE_A** - Italian Serie A
* **ESP_LALIGA** - Spanish La Liga
* **MEX_LIGA_BANCOMER** - Mexican Liga BBVA Bancomer

#### International
* **AFC_ASIAN_CUP** - AFC Asian Cup
* **AFC_ASIAN_CUP_Q** - AFC Asian Cup Qualifying
* **AFF_CUP** - AFF Cup
* **AFR_NATIONS_CUP** - African Nations Cup
* **AFR_NATIONS_CUP_Q** - African Nations Cup Qualifying
* **CONCACAF_GOLD_CUP** - CONCACAF Gold Cup
* **CONCACAF_NATIONS_Q** - CONCACAF Nations League Qualifying
* **CONCACAF_WOMENS_CHAMPIONSHIP** CONCACAF Women's Championship
* **CONMEBOL_COPA_AMERICA** - CONMEBOL Copa America
* **FIFA_CLUB_WORLD_CUP** - FIFA Club World Cup
* **FIFA_CONFEDERATIONS_CUP** - FIFA Confederations Cup
* **FIFA_MENS_FRIENDLIES** - FIFA Men's Friendlies
* **FIFA_MENS_OLYMPICS** - FIFA Men's Olympic Games
* **FIFA_WOMENS_FRIENDLIES** - FIFA Women's Friendlies
* **FIFA_WOMENS_OLYMPICS** - FIFA Women's Olympic Games
* **FIFA_WOMENS_WORLD_CUP** - FIFA Women's World Cup
* **FIFA_WORLD_CUP** - FIFA World Cup
* **FIFA_WORLD_CUP_Q_AFC** - FIFA World Cup Qualifying: AFC
* **FIFA_WORLD_CUP_Q_CAF** - FIFA World Cup Qualifying: CAF
* **FIFA_WORLD_CUP_Q_CONCACAF** - FIFA World Cup Qualifying: CONCACAF
* **FIFA_WORLD_CUP_Q_CONMEBOL** - FIFA World Cup Qualifying: CONMEBOL
* **FIFA_WORLD_CUP_Q_OFC** - FIFA World Cup Qualifying: Oceana
* **FIFA_WORLD_CUP_Q_UEFA** - FIFA World Cup Qualifying: UEFA
* **FIFA_WORLD_U17** - FIFA Under-17 World Cup
* **FIFA_WORLD_U20** - FIFA Under-20 World Cup
* **UEFA_CHAMPIONS** - UEFA Champions League
* **UEFA_EUROPEAN_CHAMPIONSHIP** - UEFA European Championship
* **UEFA_EUROPEAN_CHAMPIONSHIP_Q** - UEFA European Championship Qualifying
* **UEFA_EUROPEAN_CHAMPIONSHIP_U19** - UEFA Under-19 Championship
* **UEFA_EUROPEAN_CHAMPIONSHIP_U21** - UEFA Under-21 Championship
* **UEFA_EUROPA** - UEFA Europa League
* **UEFA_NATIONS** - UEFA Nations League
* **SAFF_CHAMPIONSHIP** - SAFF Championship
* **WOMENS_EUROPEAN_CHAMPIONSHIP** - Women's European Championship

#### UK / Ireland
* **ENG_CARABAO_CUP** - English Carabao Cup
* **ENG_CHAMPIONSHIP** - English Championship
* **ENG_EFL** - English EFL Trophy
* **ENG_FA_CUP** - English FA Cup
* **ENG_LEAGUE_1** - English League One
* **ENG_LEAGUE_2** - English League Two
* **ENG_NATIONAL** - English National League
* **ENG_PREMIERE_LEAGUE** - English Premier League
* **IRL_PREM** - League of Ireland Premier Divison
* **NIR_PREM** - Northern Irish Premier League
* **SCO_CHALLENGE_CUP** - Scottish League Challenge Cup
* **SCO_CHAMPIONSHIP** - Scottish Championship
* **SCO_CIS** - Scottish Communities League Cup
* **SCO_CUP** - Scottish Cup
* **SCO_LEAGUE_1** - Scottish League One
* **SCO_LEAGUE_2** - Scottish League Two
* **SCO_PREM** - Scottish Premiership
* **WAL_PREM** - Welsh Premier League

#### Europe
* **AUT_BUNDESLIGA** - Austrian Bundesliga
* **BEL_DIV_A** - Belgian First Division A
* **DEN_SAS_LIGAEN** - Danish SAS-Ligaen
* **ESP_COPA_DEL_REY** - Spanish Copa del Rey
* **ESP_LALIGA** - Spanish La Liga
* **ESP_SEGUNDA_DIV** - Spanish Segunda Division
* **FRA_COUPE_DE_FRANCE** - French Coupe de France
* **FRA_COUPE_DE_LA_LIGUE** - French Coupe de la Ligue
* **FRA_LIGUE_1** - French Ligue 1
* **FRA_LIGUE_2** - French Ligue 2
* **GER_2_BUNDESLIGA** - German 2. Bundesliga
* **GER_BUNDESLIGA** - German Bundesliga
* **GER_DFB_POKAL** - German DFB Pokal
* **GRE_SUPER_LEAGUE** - Greek Super League
* **ISR_PREMIER_LEAGUE** - Israeli Premier League
* **MLT_PREMIER_LEAGUE** - Maltese Premier League
* **ITA_COPPA_ITALIA** - Italian Coppa Italia
* **ITA_SERIE_A** - Italian Serie A
* **ITA_SERIE_B** - Italian Serie B
* **NED_EERSTE_DIVISIE** - Dutch Eerste Divisie
* **NED_EREDIVISIE** - Dutch Eredivisie
* **NED_KNVB_BEKER** - Dutch KNVB Beker
* **NOR_ELITESERIEN** - Norwegian Eliteserien
* **POR_LIGA** - Portuguese Liga
* **ROU_FIRST_DIV** - Romanian First Divison
* **RUS_PREMIER_LEAGUE** - Russian Premier League
* **SUI_SUPER_LEAGUE** - Swiss Super League
* **SWE_ALLSVENSKANLIGA** - Swedish Allsvenskanliga
* **TUR_SUPER_LIG** - Turkish Super Lig

#### South America
* **ARG_COPA** - Copa Argentina
* **ARG_NACIONAL_B** - Argentine Nacional B
* **ARG_PRIMERA_DIV_B** - Argentine Primera Division B
* **ARG_PRIMERA_DIV_C** - Argentine Primera Division C
* **ARG_PRIMERA_DIV_D** - Argentine Primera Division D
* **ARG_SUPERLIGA** - Argentine Superliga
* **BOL_LIGA_PRO** - Bolivian Liga Profesional
* **BRA_CAMP_CARIOCA** - Brazilian Campeonato Carioca
* **BRA_CAMP_GAUCHO** - Brazilian Campeonato Gaucho
* **BRA_CAMP_MINEIRO** - Brazilian Campeonato Mineiro
* **BRA_CAMP_PAULISTA** - Brazilian Campeonato Paulista
* **BRA_COPA** - Copa Do Brazil
* **BRA_SERIE_A** - Brazilian Serie A
* **BRA_SERIE_B** - Brazilian Serie B
* **BRA_SERIE_C** - Brazilian Serie C
* **CHI_COPA** - Copa Chile
* **CHI_PRIMERA_DIV** - Chilean Primera Division
* **COL_COPA** - Copa Colombia
* **COL_PRIMERA_A** - Colombian Primera A
* **COL_PRIMERA_B** - Colombian Primera B
* **CONMEBOL_COPA_LIBERTADORES** - CONMEBOL Copa Libertadores
* **CONMEBOL_COPA_SUDAMERICANA** - CONMEBOL Copa Sudamericana
* **ECU_PRIMERA_A** - Ecuadoran Primera A
* **PAR_PRIMERA_DIV** - Paraguayan Primera Division
* **PER_PRIMERA_PRO** - Peruvian Primera Profesional
* **URU_PRIMERA_DIV** - Uruguayan Primera Division
* **VEN_PRIMERA_PRO** - Venezuelan Primera Profesional

#### North America
* **CONCACAF_CHAMPIONS** - CONCACAF Champions League
* **CONCACAF_LEAGUE** - CONCACAF League
* **CRC_PRIMERA_DIV** - Costa Rican Primera Division
* **GUA_LIGA_NACIONAL** - Guatemalan Liga Nacional
* **HON_PRIMERA_DIV** - Honduran Primera Division
* **JAM_PREMIER_LEAGUE** - Jamaican Premier League
* **MEX_ASCENSO_MX** - Mexican Ascenso MX
* **MEX_COPA_MX** - Mexican Copa MX
* **MEX_LIGA_BANCOMER** - Mexican Liga BBVA Bancomer
* **SLV_PRIMERA_DIV** - Salvadoran Primera Division
* **USA_MLS** - Major League Soccer
* **USA_NCAA_SL_M** - United States NCAA Men's 1
* **USA_NCAA_SL_W** - United States NCAA Women's 1
* **USA_NASL** - United States North American Soccer League
* **USA_NWSL** - United States NWSL Women's League
* **USA_OPEN** - United States Open Cup 
* **USA_USL** - United States USL Championship

#### Asia
* **AFC_CHAMPIONS** - AFC Champions League
* **AUS_A_LEAGUE** - Australian A-League
* **CHN_SUPER_LEAGUE** - Chinese Super League
* **IDN_SUPER_LEAGUE** - Indonesian Super League
* **IND_I_LEAGUE** - Indian I-League
* **IND_SUPER_LEAGUE** - Indian Super League
* **JPN_J_LEAGUE** - Japanese J League
* **MYS_SUPER_LEAGUE** - Malaysian Super League
* **SGP_PREMIER_LEAGUE** - Singaporean S-League 
* **THA_PREMIER_LEAGUE** - Thai Premier League

#### Africa
* **CAF_CHAMPIONS** - CAF Champions League
* **CAF_CONFED_CUP** - CAF Confederation Cup
* **GHA_PREMIERE_LEAGUE** - Ghanaian Premier League
* **KEN_PREMIERE_LEAGUE** - Kenyan Premier League
* **NGA_PRO_LEAGUE** - Nigerian Professional League
* **RSA_FIRST_DIV** - South African First Division
* **RSA_NEDBANK_CUP** - South African Nedbank Cup
* **RSA_PREMIERSHIP** - South African Premiership
* **RSA_TELKOM_KNOCKOUT** - South African Telkom Knockout
* **UGA_SUPER_LEAGUE** - Ugandan Super League
* **ZAM_SUPER_LEAGUE** - Zambian Super League
* **ZIM_PREMIER_LEAGUE** - Zimbabwe Super League


## View Styles

Examples of the available view styles you can specify with the `viewStyle` parameter.

![View Styles](/../screenshots/viewStyles.jpg?raw=true "View Styles")

`smallLogos`<br />
![Small Logos](/../screenshots/viewStyle_smallLogos.png?raw=true "Small Logos")


## Team Shortcodes and Groups

**NOTE** For the soccer leagues, the list of teams changes every season as teams get relegated out, while other get promoted in.  Therefore, I won't be maintaining a team list here.  To follow a specific team, go to ESPN.com, view the table for the league your team plays in and resize your browser to mobile width.  You will see the team's shortcode there.

The following are shortcodes and groups for North American sports leagues.


### NHL

```
Teams:
---------------

ANA   Anaheim Ducks
ARI   Arizona Coyotes
BOS   Boston Bruins
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
NJ    New Jersey Devils
NSH   Nashville Predators
NYI   New York Islanders
NYR   New York Rangers
OTT   Ottawa Senators
PHI   Philadelphia Flyers
PIT   Pittsburgh Penguins
SJ    San Jose Sharks
STL   St. Louis Blues
TB    Tamba Bay Lightning
TOR   Toronto Maple Leafs
VAN   Vanvouver Canucks
VGK   Vegas Golden Knights
WPG   Winnipeg Jets
WSH   Washington Capitals

Groups:
---------------
Atlantic
Metropolitain
Central
Pacific
East
West
Canadian (group that includes all seven Canadian teams)
```




### MLB

```
Teams:
---------------

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

Groups:
---------------
AL East
AL Central
AL West
NL East
NL Central
NL West
American League
National League
```

### NBA

```
Teams:
---------------

ATL   Atlanta Hawks
BKN   Brooklyn Nets
BOS   Boston Celtics
CHA   Charlotte Hornets
CHI   Chicago Bulls
CLE   Cleveland Cavaliers
DAL   Dallas Mavericks
DEN   Denver Nuggets
DET   Detroit Pistons
GS    Golden State Warriors
HOU   Houston Rockets
IND   Indiana Pacers
LAC   Los Angeles Clippers
LAL   Los Angeles Lakers
MEM   Memphis Grizzlies
MIA   Miami Heat
MIL   Milwaukee Bucks
MIN   Minnesota Timberwolves
NO    New Orleans Pelicans
NY    New York Knicks
OKC   Oklahoma City Thunder
ORL   Orlando Magic
PHI   Philadelphia 76ers
PHX   Phoenix Suns
POR   Portland Trail Blazers
SAC   Sacramento Kings
SA    San Antonio Spurs
TOR   Toronto Raptors
UTAH  Utah Jazz
WSH   Washington Wizards

Groups:
---------------
Atlantic
Central
Southeast
Northwest
Pacific
Southwest
East
West
```

### NFL
```
Teams:
---------------

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
LAR   Los Angeles Rams
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

Groups:
---------------
AFC East
AFC North
AFC South
AFC West
NFC East
NFC North
NFC South
NFC West
AFC
NFC
```

### CFL
```
Teams:
---------------

BC    B.C. Lions
CGY   Calgary Stampeders
EDM   Edmonton Eskimos
HAM   Hamilton Tiger-Cats
MTL   Montreal Alouetts
OTT   Ottawa Redblacks
SSK   Saskatchewan Roughriders
TOR   Toronto Argonauts
WPG   Winnipeg Blue Bombers

Groups:
---------------
East
West
```


### MLS
```
Teams:
---------------

ATL   Atlanta United FC
CHI   Chicago Fire
CLB   Columbus Crew SC
COL   Colorado Rapids
DAL   FC Dallas
DC    DC United
HOU   Houston Dynamo
LA    LA Galaxy
KC    Sporting Kansas City
MIN   Minnesota United FC
MTL   Montreal Impact
NE    New England Revolution
NY    New York Red Bulls
NYC   New York City FC
ORL   Orlando City FC
PHI   Philadelphia Union
POR   Portland Timbers
RSL   Real Salt Lake
SJ    San Jose Earthquakes
SEA   Seattle Sounders FC
TOR   Toronto FC
VAN   Vancouver Whitecaps

Groups:
---------------
East
West
```


### NCAAF (FBS Division)
```
Teams:
---------------

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
BUFF  Buffalo Bulls
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

Groups:
---------------
Top 25
American Athletic
ACC
Big 12
Big Ten
Conference USA
FBS Independents
Mid-American
Mountain West
Pac-12
SEC
Sun Belt
```

### NCAAM (Division I and March Madness)
```
Teams:
---------------

AAMU  Alabama A&M Bulldogs
ACU   Abilene Christian Wildcats
AFA   Air Force Falcons
AKR   Akron Zips
ALA   Alabama Crimson Tide
ALBY  Albany Great Danes
ALCN  Alcorn State Braves
ALST  Alabama State Hornets
AMCC  Texas A&M-CC Islanders
AMER  American Eagles
APP   Appalachian State Mountaineers
ARIZ  Arizona Wildcats
ARK   Arkansas Razorbacks
ARMY  Army Black Knights
ARST  Arkansas State Red Wolves
ASU   Arizona State Sun Devils
AUB   Auburn Tigers
BALL  Ball State Cardinals
BAY   Baylor Bears
BC    Boston College Eagles
BCU   Bethune-Cookman Wildcats
BEL   Belmont Bruins
BGSU  Bowling Green Falcons
BING  Binghamton Bearcats
BRAD  Bradley Braves
BRWN  Brown Bears
BRY   Bryant Bulldogs
BSU   Boise State Broncos
BU    Boston University Terriers
BUCK  Bucknell Bison
BUFF  Buffalo Bulls
BUT   Butler Bulldogs
BYU   BYU Cougars
CAL   California Golden Bears
CAM   Campbell Fighting Camels
CAN   Canisius Golden Griffins
CCAR  Coastal Carolina Chanticleers
CCSU  Central Connecticut Blue Devils
CHAR  Charlotte 49ers
CHAT  Chattanooga Mocs
CHS   Chicago State Cougars
CHSO  Charleston Southern Buccaneers
CIN   Cincinnati Bearcats
CIT   The Citadel Bulldogs
CLEM  Clemson Tigers
CLEV  Cleveland State Vikings
CLMB  Columbia Lions
CMU   Central Michigan Chippewas
COFC  Charleston Cougars
COLG  Colgate Raiders
COLO  Colorado Buffaloes
CONN  Connecticut Huskies
COPP  Coppin State Eagles
COR   Cornell Big Red
CP    Cal Poly Mustangs
CREI  Creighton Bluejays
CSB   CSU Bakersfield Roadrunners
CSF   CS Fullerton Titans
CSU   Colorado State Rams
CSUN  CSU Northridge Matadors
DART  Dartmouth Big Green
DAV   Davidson Wildcats
DAY   Dayton Flyers
DEL   Delaware Blue Hens
DEN   Denver Pioneers
DEP   DePaul Blue Demons
DET   Detroit Mercy Titans
DREX  Drexel Dragons
DRKE  Drake Bulldogs
DSU   Delaware State Hornets
DUKE  Duke Blue Devils
DUQ   Duquesne Dukes
ECU   East Carolina Pirates
EIU   Eastern Illinois Panthers
EKY   Eastern Kentucky Colonels
ELON  Elon Phoenix
EMU   Eastern Michigan Eagles
ETSU  East Tennessee State Buccaneers
EVAN  Evansville Purple Aces
EWU   Eastern Washington Eagles
FAIR  Fairfield Stags
FAMU  Florida A&M Rattlers
FAU   Florida Atlantic Owls
FDU   Fairleigh Dickinson Knights
FGCU  Florida Gulf Coast Eagles
FIU   Florida Intl Golden Panthers
FLA   Florida Gators
FOR   Fordham Rams
FRES  Fresno State Bulldogs
FSU   Florida State Seminoles
FUR   Furman Paladins
GASO  Georgia Southern Eagles
GAST  Georgia State Panthers
GB    Green Bay Phoenix
GCU   Grand Canyon Antelopes
GMU   George Mason Patriots
GONZ  Gonzaga Bulldogs
GRAM  Grambling Tigers
GT    Georgia Tech Yellow Jackets
GTWN  Georgetown Hoyas
GW    George Washington Colonials
HALL  Seton Hall Pirates
HAMP  Hampton Pirates
HART  Hartford Hawks
HARV  Harvard Crimson
HAW   Hawai'i Rainbow Warriors
HBU   Houston Baptist Huskies
HC    Holy Cross Crusaders
HOF   Hofstra Pride
HOU   Houston Cougars
HOW   Howard Bison
HP    High Point Panthers
IDHO  Idaho Vandals
IDST  Idaho State Bengals
ILL   Illinois Fighting Illini
ILST  Illinois State Redbirds
IND   Indiana Hoosiers
INST  Indiana State Sycamores
IONA  Iona Gaels
IOWA  Iowa Hawkeyes
IPFW  Fort Wayne Mastodons
ISU   Iowa State Cyclones
IUPU  IUPUI Jaguars
IW    Incarnate Word Cardinals
JAC   Jacksonville Dolphins
JKST  Jackson State Tigers
JMU   James Madison Dukes
JOES  Saint Joseph's Hawks
JVST  Jacksonville State Gamecocks
KENN  Kennesaw State Owls
KENT  Kent State Golden Flashes
KSU   Kansas State Wildcats
KU    Kansas Jayhawks
L-IL  Loyola-Chicago Ramblers
L-MD  Loyola (MD) Greyhounds
LAF   Lafayette Leopards
LAM   Lamar Cardinals
LAS   La Salle Explorers
LBSU  Long Beach State 49ers
LEH   Lehigh Mountain Hawks
LIB   Liberty Flames
LIP   Lipscomb Bisons
LIU   LIU Brooklyn Blackbirds
LMU   Loyola Marymount Lions
LONG  Longwood Lancers
LOU   Louisville Cardinals
LSU   LSU Tigers
LT    Louisiana Tech Bulldogs
M-OH  Miami (OH) RedHawks
MAINE Maine Black Bears
MAN   Manhattan Jaspers
MARQ  Marquette Golden Eagles
MCNS  McNeese Cowboys
MD    Maryland Terrapins
MEM   Memphis Tigers
MER   Mercer Bears
MIA   Miami Hurricanes
MICH  Michigan Wolverines
MILW  Milwaukee Panthers
MINN  Minnesota Golden Gophers
MISS  Ole Miss Rebels
MIZ   Missouri Tigers
MONM  Monmouth Hawks
MONT  Montana Grizzlies
MORE  Morehead State Eagles
MORG  Morgan State Bears
MOST  Missouri State Bears
MRSH  Marshall Thundering Herd
MRST  Marist Red Foxes
MSM   Mt. St. Mary's Mountaineers
MSST  Mississippi State Bulldogs
MSU   Michigan State Spartans
MTST  Montana State Bobcats
MTU   Middle Tennessee Blue Raiders
MURR  Murray State Racers
MVSU  Mississippi Valley State Delta Devils
NAU   Northern Arizona Lumberjacks
NAVY  Navy Midshipmen
NCAT  North Carolina A&T Aggies
NCCU  North Carolina Central Eagles
NCST  NC State Wolfpack
ND    Notre Dame Fighting Irish
NDSU  North Dakota St Bison
NE    Northeastern Huskies
NEB   Nebraska Cornhuskers
NEV   Nevada Wolf Pack
NIAG  Niagara Purple Eagles
NICH  Nicholls Colonels
NIU   Northern Illinois Huskies
NJIT  NJIT Highlanders
NKU   Northern Kentucky Norse
NMSU  New Mexico State Aggies
NSU   Norfolk State Spartans
NW    Northwestern Wildcats
NWST  Northwestern State Demons
OAK   Oakland Golden Grizzlies
ODU   Old Dominion Monarchs
OHIO  Ohio Bobcats
OKLA  Oklahoma Sooners
OKST  Oklahoma State Cowboys
OMA   Omaha Mavericks
ORE   Oregon Ducks
ORST  Oregon State Beavers
ORU   Oral Roberts Golden Eagles
OSU   Ohio State Buckeyes
PAC   Pacific Tigers
PEAY  Austin Peay Governors
PENN  Pennsylvania Quakers
PEPP  Pepperdine Waves
PITT  Pittsburgh Panthers
PORT  Portland Pilots
PRE   Presbyterian College Blue Hose
PRIN  Princeton Tigers
PROV  Providence Friars
PRST  Portland State Vikings
PSU   Penn State Nittany Lions
PUR   Purdue Boilermakers
PV    Prairie View A&M Panthers
QUIN  Quinnipiac Bobcats
RAD   Radford Highlanders
RICE  Rice Owls
RICH  Richmond Spiders
RID   Rider Broncs
RMU   Robert Morris Colonials
RUTG  Rutgers Scarlet Knights
SAC   Sacramento State Hornets
SAM   Samford Bulldogs
SAV   Savannah State Tigers
SBON  St. Bonaventure Bonnies
SC    South Carolina Gamecocks
SCST  South Carolina State Bulldogs
SCU   Santa Clara Broncos
SDAK  South Dakota Coyotes
SDST  South Dakota State Jackrabbits
SDSU  San Diego State Aztecs
SEA   Seattle Redhawks
SELA  SE Louisiana Lions
SEMO  Southeast Missouri State Redhawks
SF    San Francisco Dons
SFA   Stephen F. Austin Lumberjacks
SFNY  St. Francis (BKN) Terriers
SFU   St. Francis (PA) Red Flash
SHSU  Sam Houston State Bearkats
SHU   Sacred Heart Pioneers
SIE   Siena Saints
SIU   Southern Illinois Salukis
SIUE  SIU-Edwardsville Cougars
SJSU  San José State Spartans
SJU   St. John's Red Storm
SLU   Saint Louis Billikens
SMC   Saint Mary's Gaels
SMU   SMU Mustangs
SOU   Southern Jaguars
SPU   Saint Peter's Peacocks
STAN  Stanford Cardinal
STET  Stetson Hatters
STON  Stony Brook Seawolves
SUU   Southern Utah Thunderbirds
SYR   Syracuse Orange
TAMU  Texas A&M Aggies
TCU   TCU Horned Frogs
TEM   Temple Owls
TENN  Tennessee Volunteers
TEX   Texas Longhorns
TLSA  Tulsa Golden Hurricane
TNST  Tennessee State Tigers
TNTC  Tennessee Tech Golden Eagles
TOL   Toledo Rockets
TOWS  Towson Tigers
TRGV  UT Rio Grande Valley Vaqueros
TROY  Troy Trojans
TTU   Texas Tech Red Raiders
TULN  Tulane Green Wave
TXSO  Texas Southern Tigers
TXST  Texas State Bobcats
UAB   UAB Blazers
UALR  Little Rock Trojans
UAPB  Arkansas-Pine Bluff Golden Lions
UCA   Central Arkansas Bears
UCD   UC Davis Aggies
UCF   UCF Knights
UCI   UC Irvine Anteaters
UCLA  UCLA Bruins
UCRV  UC Riverside Highlanders
UCSB  UC Santa Barbara Gauchos
UGA   Georgia Bulldogs
UIC   UIC Flames
UK    Kentucky Wildcats
ULL   Louisiana Ragin' Cajuns
ULM   UL Monroe Warhawks
UMASS Massachusetts Minutemen
UMBC  UMBC Retrievers
UMES  Maryland-Eastern Shore Hawks
UMKC  UMKC Kangaroos
UML   UMass Lowell River Hawks
UNC   North Carolina Tar Heels
UNCA  UNC Asheville Bulldogs
UNCG  UNC Greensboro Spartans
UNCO  Northern Colorado Bears
UNCW  UNC Wilmington Seahawks
UND   North Dakota Fighting Hawks
UNF   North Florida Ospreys
UNH   New Hampshire Wildcats
UNI   Northern Iowa Panthers
UNLV  UNLV Rebels
UNM   New Mexico Lobos
UNO   New Orleans Privateers
UNT   North Texas Mean Green
UPST  South Carolina Upstate Spartans
URI   Rhode Island Rams
USA   South Alabama Jaguars
USC   USC Trojans
USD   San Diego Toreros
USF   South Florida Bulls
USM   Southern Miss Golden Eagles
USU   Utah State Aggies
UTA   UT Arlington Mavericks
UTAH  Utah Utes
UTEP  UTEP Miners
UTM   UT Martin Skyhawks
UTSA  UT San Antonio Roadrunners
UVA   Virginia Cavaliers
UVM   Vermont Catamounts
UVU   Utah Valley Wolverines
VALP  Valparaiso Crusaders
VAN   Vanderbilt Commodores
VCU   VCU Rams
VILL  Villanova Wildcats
VMI   VMI Keydets
VT    Virginia Tech Hokies
WAG   Wagner Seahawks
WAKE  Wake Forest Demon Deacons
WASH  Washington Huskies
WCU   Western Carolina Catamounts
WEB   Weber State Wildcats
WEBB  Gardner-Webb Bulldogs
WICH  Wichita State Shockers
WIN   Winthrop Eagles
WIS   Wisconsin Badgers
WIU   Western Illinois Leathernecks
WKU   Western Kentucky Hilltoppers
WM    William & Mary Tribe
WMU   Western Michigan Broncos
WOF   Wofford Terriers
WRST  Wright State Raiders
WSU   Washington State Cougars
WVU   West Virginia Mountaineers
WYO   Wyoming Cowboys
XAV   Xavier Musketeers
YALE  Yale Bulldogs
YSU   Youngstown State Penguins

Groups (Division I only.  No groups for March Madness):
---------------
Top 25
America East
American
Atlantic 10
ACC
Atlantic Sun
Big 12
Big East
Big Sky
Big South
Big Ten
Big West
Colonial
Conference USA
Horizon
Ivy
MAAC
Mid-American
MEAC
Missouri Valley
Mountain West
Northeast
Ohio Valley
Pac-12
Patriot League
SEC
Southern
Southland
SWAC
Summit League
Sun Belt
West Coast
WAC
```
