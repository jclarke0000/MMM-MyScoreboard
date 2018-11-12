## This app displays the Abbreviation and Name of all the teams in a League for making it easy to add new Leagues and
## update the README file for reference.
import json
import requests

##Change de URL (XXXXX) for the League you want to display the teams and abbreviations
r = requests.get('http://site.api.espn.com/apis/site/v2/sports/soccer/XXXXXX/teams')
data = r.json()
line = ""
for index in range(len(data['sports'][0]['leagues'][0]['teams'])):
    name = data['sports'][0]['leagues'][0]['teams'][index]['team']['name']
    abre = data['sports'][0]['leagues'][0]['teams'][index]['team']['abbreviation']
    print(abre + "   " + name)
    line +=  " \"" + abre + "\","
print("use this to help build a list of teams ")
print(line)