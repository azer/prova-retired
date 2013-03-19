var expect          = fox.require('chai').expect,
    bdd             = fox().bdd,
    suites          = fox().suites,

    cleanStackTrace = fox.require('./clean-stack-trace'),

    after           = bdd.after,
    afterEach       = bdd.afterEach,
    before          = bdd.before,
    beforeEach      = bdd.beforeEach,
    describe        = bdd.describe,
    it              = bdd.it;

fox.require('chai').Assertion.includeStack = true;

function start(){

  $.getJSON('/modules', function(modulePaths) {

    try {

      modulePaths
        .map(function(el){
          return !/^\./.test(el) ? './' + el : el;
        })
        .map(bundle.require);

    } catch(requireError){

      modulePaths
        .map(function(el){
          return '../' + el;
        })
        .map(bundle.require);

    }

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
