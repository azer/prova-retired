var pubsub = require('pubsub'),
    cleanStackTrace = require('../../lib/clean-stack-trace'),
    frame = require('./frame'),
    onError = pubsub(),
    onFinish = pubsub();

setTimeout(frame.run, 0);

module.exports = {
  run: frame.run,
  onStart: frame.onStart,
  onError: onError,
  onFinish: onFinish
};

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
  if ( !result.passed ) return;
  onFinish.publish(result.passed);
});
