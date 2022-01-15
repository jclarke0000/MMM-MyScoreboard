const momentTz = require('moment-timezone');
const moment = require("moment/min/moment-with-locales");

const chooseMomentLocale = (locale) => {
  // make the locale lower case 
  // will fix crashes caused by "en-GB" (instead of "en-gb") not being found
  locale = locale.toLowerCase();  
  if (moment.locales().includes(locale)) { // check if the locale is included in the array returned by `locales()` which (in this case) tells us which locales moment will support
    return locale;
  } else if (moment.locales().includes(locale.substring(0, 2))) { 
    // check if the first two letters of the locale are included in the array returned by `locales()` which (in this case) tells us which locales moment will support
    // will fixes crashes caused by "en-US" not being found, as we'll tell moment to load "en" instead
    return locale.substring(0, 2);
  }
    // use "en-gb" (the default language and locale for my app) as a fallback if we can't find any other locale
    return 'en-gb'; 
};

const environment = process.env;
const userLocale = environment.LC_ALL || environment.LC_MESSAGES || environment.LANG || environment.LANGUAGE || environment.LC_NAME
const momentLocale = userLocale.split('.')[0].replace('_', '-').toLowerCase()
const localeToImport = chooseMomentLocale(momentLocale)
momentTz.locale(localeToImport)

module.exports = momentTz