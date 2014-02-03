var attrs = require("attr").attrs;

module.exports = attrs({
  port: 7559,
  timeout: 2000,
  disableVM: false,
  keepStack: false
});
