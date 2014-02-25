var runParalelly = require("run-paralelly");
var runSerially = require('run-serially');
var paths= require('./paths');
var loadModule = require('./load-module');
var suites = require('./suites');
var options = require('./options');
var reporter = require('./reporters/cli');

suites.onError(onError);
suites.onFinish(onFinish);
suites.onRun(onRun);

module.exports = cli;

process.on('uncaughtException', function(error){
  reporter.error(undefined, error);
});

function cli(command){
  if (command.json) {
    reporter = require('./reporters/json');
  }

  paths(command._, function(error, paths){
    if(error) throw error;

    if (command.cp || command.cs) {
      runAsCPs(command, paths);
      return;
    }

    reporter.start();
    paths.forEach(loadModule);
    suites.run();
  });
}

function runAsCPs (command, paths) {
  var commands = paths.map(function (el) {
    return process.argv[1] + ' ' + el + ' -j';
  });

  resultsOf(command, commands, function (errors, passed) {
    if (!errors) {
      reporter.end({ passed: passed });
      return;
    }

    errors.forEach(function (fail) {
      reporter.error(fail.test, fail.error);
    });
  });
}


function onError(updates){
  updates.forEach(function(el){
    var error = el.params[0],
        test  = el.params[1];

    reporter.error(test, error);
  });
}

function onFinish(suites){
  reporter.end(suites);
}

function onRun(updates){
  updates.forEach(function(el){
    var test  = el.params[0],
        error = el.params[1];

    reporter.run(test, error);
  });
}

function resultsOf (command, commands, callback) {
  var run = command.cs ? runSerially : runParalelly;

  run(commands, function (errors, stdouts, stderrors) {
    if (errors) return errors.forEach(function (fail) {
      throw fail.error;
    });

    var passed = 0;
    var results = readResults([stdouts, stderrors]);
    var fails;

    results.forEach(function (el) {
      if (el.passed) {
        passed += el.passed;
        return;
      }

      if (!fails) fails = [];

      fails.push(el);
    });

    return callback(fails, passed);
  });
}

function readResults (buffers) {
  var results = [];
  var lines;
  var parsed;

  buffers.forEach(function (outputs) {
    outputs.forEach(function (output) {
      lines = output.split('\n');

      lines = lines.map(function (line) {
        try {
          parsed = JSON.parse(line);
          return parsed['prova-result'];
        } catch (exc) {}
      });

      lines = lines.filter(function (el) { return el; });

      results = results.concat(lines);
    });
  });

  return results;
}
