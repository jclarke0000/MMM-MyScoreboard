const fs = require('fs')
const path = require('path')
const environment = process.env;
const userLocale = environment.LC_ALL || environment.LC_MESSAGES || environment.LANG || environment.LANGUAGE || environment.LC_NAME

module.exports = {
    getMomentLocale: function() {
        return userLocale.split('.')[0].replace('_', '-').toLowerCase();
    },
    loadTranslations: function(language) {
        const path = './modules/MMM-MyScoreboard/translations/' + language + '.json'
        if (fs.existsSync(path)) {
            return require('./translations/' + language + '.json');
        } else {
            return require('./translations/en.json');
        }
    }
}