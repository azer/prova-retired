var paths      = require('./paths'),
    loadModule = require('./load-module'),
    suites     = require('./suites'),
    reporter   = require('./reporters/cli');

suites.onError(onError);
suites.onFinish(onFinish);
suites.onRun(onRun);

module.exports = cli;

process.on('uncaughtException', function(error){
  reporter.error(undefined, error);
});

function cli(args){
  paths(args._, function(error, paths){

    if(error) throw error;

    reporter.start();

    paths.forEach(loadModule);

    suites.run();
  });
}

function onError(updates){
  updates.forEach(function(el){
    var error = el.params[0],
        test  = el.params[1];

    reporter.error(test, error);
  });
}

function onFinish(updates){
  reporter.end();
}

function onRun(updates){
  updates.forEach(function(el){
    var test  = el.params[0],
        error = el.params[1];

    reporter.run(test, error);
   });
}
