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
    it              = bdd.it;

chai.Assertion.includeStack = true;

function start(){
  $.getJSON('/modules', function(modulePaths) {
    modulePaths.forEach(require);
    suites.run();
  });
}

suites.onError(function(updates){

  updates.forEach(function(el){

    var error = el.params[0],
        test  = el.params[1];

      $("#result").append([
        '<li>',
        '<h3>',
        test.title,
        '</h3>',
        '<pre>',
        cleanStackTrace(error.stack),
        '</pre>',
        '</li>'
      ].join(''));

  });

});

suites.onFinish(function(result){
  result.passed && $('body').append('<h1>OK, passed ' + result.passed + ' tests.</h1>');
});

$(document).ready(start);
