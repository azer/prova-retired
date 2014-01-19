exports.suites = require("./suites");
exports.bdd = require('./bdd');
exports.expect = require('chai').expect;

var key;
for (key in exports.bdd) {
  exports[key] = exports.bdd[key];
}
