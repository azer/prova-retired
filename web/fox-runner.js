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

suites.onError(onError);

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
    message('start', navigator.userAgent);
    modulePaths.forEach(require);
    suites.run();
  });
}
