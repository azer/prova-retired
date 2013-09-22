var pubsub = require('pubsub'),
    attr = require('attr'),
    cleanStackTrace = require('../../lib/clean-stack-trace'),
    frame = require('./frame'),
    io = require('./io'),
    onRun = pubsub(),
    onError = pubsub(),
    onFinish = pubsub(),
    ranTests = [],
    timeout;

io.sub(function(msg){
  if (msg.update) {
    run();
  }
});

ranTests.onUpdate = pubsub();

setTimeout(frame.run, 0);

window.onerror = function(error){
  onError.publish({
    title: error.title,
    stack: error.stack
  });
};

frame.onError(function(updates){
  updates.forEach(function(el){
    var error = el.params[0],
        test  = el.params[1],
        stack = error.stack && cleanStackTrace(error.stack).split('\n');

    onError.publish({
      error: true,
      test: test.title,
      stack: stack ? stack : [error.message]
    });
  });
});

frame.onFinish(function(result){
  if ( !result.hasOwnProperty('passed') ) return;
  onFinish.publish(result);
});

frame.onRun(function(tests){
  tests.forEach(function(test){
    ranTests.push({ title: test.params[0].title, error: test.params[1] });
  });

  ranTests.onUpdate.publish();
});

module.exports = {
  run: run,
  onStart: frame.onStart,
  onError: onError,
  onFinish: onFinish,
  ranTests: ranTests
};

function run () {
  ranTests.splice(0);
  ranTests.onUpdate.publish();
  frame.run();
}
