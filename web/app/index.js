var dom    = require('domquery'),
    io     = require('simple.io')(),
    runner = require('./runner');

io.onOpen(function(){
  dom('.container').addClass('connected');
});

io.onClose(function(){
  dom('.container').removeClass('connected');
});

io.sub(function(msg){
  if (msg.update) {
    runner.run();
  }
});

runner.onError(function(error){
  try {
    document.title = 'Tests failed, try again.';

    dom('.errors').html('');
    dom('.container').removeClass('passed').addClass('failed');
    dom('<li><h3>{title}</h3><pre>{stack}</pre></li>', {
      title: error.test || error.title,
      stack: error.stack && error.stack.join('\n')
    }).insert('.errors');

    io.publish({
      error: true,
      env: navigator.userAgent,
      name: error.test || error.title,
      message: error.stack.slice(0, 1)[0],
      stack: error.stack.slice(1).join('\n')
    });
  } catch (err) {
    console.error('Fox Runtime Error', err);
  }
});

runner.onFinish(function(passed){
  io.publish({ finish: true, passed: passed, env: navigator.userAgent });
  dom('.container').addClass('passed').removeClass('failed');
  dom('.ok').html('<h1>OK, passed {passed} tests.</h1>', { passed: passed });
  document.title = 'OK, passed ' + passed + ' tests.';
});

runner.onStart(function(){
  io.pub({ start: true, env: navigator.userAgent });
});

dom('.show-iframe').on('click', showIframe);
dom('.hide-iframe').on('click', hideIframe);

function hideIframe(){
  delete localStorage['foxShowIframe'];
  dom('.container').addClass('hidden-iframe').removeClass('open-iframe');
}

function showIframe(){
  localStorage['foxShowIframe'] = 't';
  dom('.container').addClass('open-iframe').removeClass('hidden-iframe');
}

if(localStorage['foxShowIframe']){
  showIframe();
}
