var betterError = require('../../error');
var errors = [];

exports.run = function(){};

exports.start = function(){};

exports.error = function(test, error){
  process.stderr.write(JSON.stringify({
    test: test,
    error: betterError(error)
  }) + '\n');
};

exports.end = function(result){
  if (result.passed) process.stdout.write(JSON.stringify({ passed: result.passed }));
}
