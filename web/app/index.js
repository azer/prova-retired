var dom    = require('domquery'),
    io     = require('simple.io')(),
    grep   = require('./grep'),
    runner = require('./runner');

io.onOpen(function(){
  dom('.buttons').addClass('connected');
});

io.onClose(function(){
  dom('.buttons').removeClass('connected');
});

io.sub(function(msg){
  if (msg.update) {
    runner.run();
  }
});

dom(window).on('hashchange', function(){
  runner.run();
});

dom('.run-again').click(runner.run);

runner.ranTests.onUpdate(function(){
  dom('.ran-tests')
    .html(runner.ranTests.map(function(test){
      return "<li class='" + (test.error ? "error" : "") + "'><span>" + ( test.error ? '✖' : '✓' ) + '</span>' + test.title + "</li>";
    }).join('\n'));
});

runner.onError(function(error){
  try {
    document.title = 'Tests failed, try again.';

    dom('.container').removeClass('passed').addClass('failed').removeClass('notfound');
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

runner.onFinish(function(result){
  var passed = result.passed;

  if (passed == 0) {
    io.publish({ finish: true, passed: passed, env: navigator.userAgent });
    dom('.container').addClass('notfound').removeClass('failed').removeClass('passed');
    dom('.notfound .grep').html(result.grep);
    document.title = 'Couldn\'t find any tests matching "' + result.grep + '"...';
    return;
  }

  io.publish({ finish: true, passed: passed, env: navigator.userAgent });
  dom('.container').addClass('passed').removeClass('failed').removeClass('notfound');
  dom('.ok').html('<h1>OK, passed {passed} tests.</h1>', { passed: passed });
  document.title = 'OK, passed ' + passed + ' tests.';
});

runner.onStart(function(){
  io.pub({ start: true, env: navigator.userAgent });
  dom('.errors').html('');
});

dom('.show-iframe').on('click', showIframe);
dom('.hide-iframe').on('click', hideIframe);

function hideIframe(){
  delete localStorage['foxShowIframe'];
  dom('body').addClass('hidden-iframe').removeClass('open-iframe');
}

function showIframe(){
  localStorage['foxShowIframe'] = 't';
  dom('body').addClass('open-iframe').removeClass('hidden-iframe');
}

if(localStorage['foxShowIframe']){
  showIframe();
}
