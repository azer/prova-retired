var subscribe         = require('subscribe'),
    pubsub            = require('new-pubsub'),

    globals           = require("./globals"),

    suites            = [],

    onError           = pubsub(),
    onFinish          = pubsub(),
    onRun             = pubsub(),

    onErrorController = subscribe(onError.publish),
    onRunController   = subscribe(onRun.publish),

    passed            = true,
    count             = 0;

module.exports = {
  add      : add,
  content  : suites,
  onError  : onError,
  onFinish : onFinish,
  onRun    : onRun,
  run      : run
};

function add(suite){
  suites.push(suite);

  onErrorController.add(suite.onError);
  onRunController.add(suite.onRun);
}

function iter(i){
  if( i >= suites.length ) {
    globals.after(function(){
      onFinish.publish(passed ? { passed : count } : {});
    });
    return;
  }

  count += suites[i].tests.length;

  suites[i].runAll(function(){

    suites[i].errors.length && ( passed = false );

    iter(i+1);
  });
};

function run(){
  globals.before(function(){
    iter(0);
  });
}
