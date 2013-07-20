var dom             = require('domquery'),
    chai            = require('chai'),
    EngineIO        = require('engine.io-client'),
    suites          = require("./lib/suites"),
    bdd             = require('./lib/bdd'),
    cleanStackTrace = require('./lib/clean-stack-trace'),
    socket          = new EngineIO;

socket.onopen = onOpen;

chai.Assertion.includeStack = true;
suites.onError(onError);
suites.onFinish(onFinish);

window.assert     = chai.assert;
window.expect     = chai.expect;
window.after      = bdd.after;
window.afterEach  = bdd.afterEach;
window.before     = bdd.before;
window.beforeEach = bdd.beforeEach;
window.describe   = bdd.describe;
window.it         = bdd.it;

window.onerror = function(error){
  message('error', {
    name: error.title,
    stack: error.stack
  });
};

start();

function message(type, content){
  var msg = {
    content: content
  };

  msg[type] = true;

  console.log('message =>', type, content);

  /*request
    .post('/message')
    .send(msg);*/
}

function onError(updates){
  updates.forEach(function(el){
    var error = el.params[0],
        test  = el.params[1],
        stack = cleanStackTrace(error.stack).split('\n');

    dom([
        '<li>',
        '<h3>',
        test.title,
        '</h3>',
        '<pre>',
        stack,
        '</pre>',
        '</li>'
      ].join('')).insert('#result');

    message('error', {
      test: test.title,
      error: stack.slice(0, 1)[0],
      stack: stack.slice(1).join('\n')
    });

  });
}

function onFinish(result){
  if ( !result.passed ) return;

  message('passed', result.passed);
  dom('<h1>OK, passed ' + result.passed + ' tests.</h1>').insert('body');
}

function onOpen(){
  console.log('on open');
}


function start(){
  console.log('==> start');
  /*request.get('/modules', function(modulePaths){
    message('start', navigator.userAgent);
    modulePaths.forEach(require);
    suites.run();
  });*/
}
