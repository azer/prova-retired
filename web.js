exports.chai            = require('chai');
exports.suites          = require("./lib/suites");
exports.bdd             = require('./lib/bdd');
exports.cleanStackTrace = require('./lib/clean-stack-trace');

if(typeof window != 'undefined'){
  window.fox = exports;
}
