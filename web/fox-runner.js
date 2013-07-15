var chai            = fox.chai,
    assert          = chai.assert,
    expect          = chai.expect,

    bdd             = fox.bdd,
    suites          = fox.suites,
    cleanStackTrace = fox.cleanStackTrace,

    after           = bdd.after,
    afterEach       = bdd.afterEach,
    before          = bdd.before,
    beforeEach      = bdd.beforeEach,
    describe        = bdd.describe,
    it              = bdd.it,

    errors          = [];

chai.Assertion.includeStack = true;

suites.onError(function(updates){

  updates.forEach(function(el){

    var error = el.params[0],
        test  = el.params[1],
        stack = cleanStackTrace(error.stack).split('\n');

    message('o', '==>' + navigator.userAgent + '\n' + error.stack);

      $("#result").append([
        '<li>',
        '<h3>',
        test.title,
        '</h3>',
        '<pre>',
        stack,
        '</pre>',
        '</li>'
      ].join(''));

    message('error', {
      test: test.title,
      error: stack.slice(0, 1)[0],
      stack: stack.slice(1).join('\n')
    });

  });

});

suites.onFinish(function(result){

  if ( !result.passed ) return;

  message('passed', result.passed);
  $('body').append('<h1>OK, passed ' + result.passed + ' tests.</h1>');

});

start();

function message(type, content){
  var msg = {
    content: content
  };

  msg[type] = true;

  $.post('/message', msg, function(){}, 'json');
}

function start(){
  $.getJSON('/modules', function(modulePaths) {
    message('start', 'Running tests on ' + navigator.userAgent);
    modulePaths.forEach(require);
    suites.run();
  });
}
