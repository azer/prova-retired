var io = require("./io");
var params = require("./params");
var run = require("./runner").run;

params.onChange(run);

io.sub(function(msg){
  if (msg.timeout) {
    params('timeout', msg.timeout);
  }
});

module.exports = function (key, value) {
  if (arguments.length == 2) return params('timeout', value);
  return params(key);
};
