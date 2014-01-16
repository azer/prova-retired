exports.suites = require("./suites");
exports.bdd = require('./bdd');

var key;
for (key in exports.bdd) {
  exports[key] = exports.bdd[key];
}
