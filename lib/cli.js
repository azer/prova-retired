var runParalelly = require("run-paralelly");
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

    if (command.cp) {
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

  runParalelly(commands, function (errors, stdouts, stderrs) {
    if (errors) return errors.forEach(function (fail) {
      throw fail.error;
    });

    var passed = 0;
    var failed;
    var parsed;

    stdouts.forEach(function (stdout) {
      if (!stdout) return;
      parsed = JSON.parse(stdout);
      passed += parsed.passed;
    });

    stderrs.forEach(function (stderr) {
      if (!stderr) return;
      failed = true;

      var errors = [];

      stderr.split('\n').forEach(function (el) {
        if (!el) return;
        parsed = JSON.parse(el);
        reporter.error(parsed.test, parsed.error);
      });
    });

    if (failed) return;

    reporter.end({ passed: passed });
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
