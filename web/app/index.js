var dom    = require('domquery'),
    io     = require('simple.io')(),
    runner = require('./runner');

runner.onError(function(error){
  dom('<li><h3>{title}</h3><pre>{stack}</pre></li>', {
    title: error.test || error.title,
    stack: error.stack.join('\n')
  }).insert('#result');

  io.publish({
    error: true,
    name: error.test || error.title,
    message: error.stack.slice(0, 1)[0],
    stack: error.stack.slice(1).join('\n')
  });
});

runner.onFinish(function(passed){
  dom('<h1>OK, passed {passed} tests.</h1>', { passed: passed }).insert('body');
});
