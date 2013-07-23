var dom    = require('domquery'),
    io     = require('simple.io')(),
    runner = require('./runner');

io.sub(function(msg){
  if (msg.update) {
    runner.run();
  }
});

runner.onError(function(error){
  try {
    dom('.errors').html('');
    dom('.container').removeClass('passed').addClass('failed');
    dom('<li><h3>{title}</h3><pre>{stack}</pre></li>', {
      title: error.test || error.title,
      stack: error.stack && error.stack.join('\n')
    }).insert('.errors');

    io.publish({
      error: true,
      name: error.test || error.title,
      message: error.stack.slice(0, 1)[0],
      stack: error.stack.slice(1).join('\n')
    });
  } catch (err) {
    console.error('Fox Runtime Error', err);
  }
});

runner.onFinish(function(passed){
  dom('.container').addClass('passed').removeClass('failed');
  dom('.ok').html('<h1>OK, passed {passed} tests.</h1>', { passed: passed });
  document.title = 'OK, passed ' + passed + ' tests.';
});

runner.onStart(function(){
  io.pub({ start: true, env: navigator.userAgent });
});
