var on                 = require('ada-on'),
    pubsub             = require('ada-pubsub'),

    globals            = require("./globals"),

    suites             = [],

    onError            = pubsub(),
    onFinish           = pubsub(),
    onRun              = pubsub(),

    onErrorController  = on(onError.publish),
    onRunController    = on(onRun.publish);

module.exports = {
  add      : add,
  onError  : onError,
  onFinish : onFinish,
  onRun    : onRun,
  run      : run
};

function add(suite){
  suites.push(suite);

  onErrorController.subscribeTo(suite.onError);
  onRunController.subscribeTo(suite.onRun);
}

function iter(i){
  if( i >= suites.length ) {
    globals.after(function(){
      onFinish.publish();
    });
    return;
  }

  suites[i].runAll(function(){
    iter(i+1);
  });
};

function run(){
  globals.before(function(){
    iter(0);
  });
}
