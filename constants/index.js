module.exports = {
  UTILS: require('./utils/index'),
  RESPONSE: require('./utils/response'),
  CODES: require('./codes'),
  MESSAGES: require('./messages'),
  MAIL: require('./mailer/mailer'),
  REGEX: {
      EMAIL: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      PHONE: /^[0-9]+$/,
      MOBILE: /^\+\d{1,3}\d{9,11}$/,
      COUNTRY_CODE: /^[0-9,+]+$/,
      PASSWORD: /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? " + "])[a - zA - Z0 - 9!#$ %&?]{ 8, 20 } $ /
  },
}
