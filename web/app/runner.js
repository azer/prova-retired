var io              = require("simple.io")(),
    pubsub          = require('pubsub'),
    cleanStackTrace = require('../../lib/clean-stack-trace'),
    onError         = pubsub(),
    onFinish        = pubsub();

module.exports = {
  onError: onError,
  onFinish: onFinish
};

window.onerror = function(error){
  onError.publish({
    title: error.title,
    stack: error.stack
  });
};

suites.onError(function(updates){
  updates.forEach(function(el){
    var error = el.params[0],
        test  = el.params[1],
        stack = cleanStackTrace(error.stack).split('\n');

    onError.publish({
      error: true,
      test: test.title,
      stack: stack
    });
  });
});

suites.onFinish(function(result){
  if ( !result.passed ) return;

  io.publish({ finish: true, passed: result.passed });
  onFinish.publish(result.passed);
});

setTimeout(suites.run, 0);
