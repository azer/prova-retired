var expect     = bundle.require('chai').expect,
    fox        = bundle.require('fox'),

    after      = fox.bdd.after,
    afterEach  = fox.bdd.afterEach,
    before     = fox.bdd.before,
    beforeEach = fox.bdd.beforeEach,
    describe   = fox.bdd.describe,
    it         = fox.bdd.it;

bundle.require('chai').Assertion.includeStack = true;

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

    fox.suites.run();

  });

}

fox.suites.onError(function(updates){

  updates.forEach(function(el){

    var error = el.params[0],
        test  = el.params[1];

      $("#result").append([
        '<li>',
        '<h3>',
        test.title,
        '</h3>',
        '<pre>',
        error.stack,
        '</pre>',
        '</li>'
      ].join(''));

  });

});

fox.suites.onFinish(function(result){
  result.passed && $('body').append('<h1>OK, passed ' + result.passed + ' tests.</h1>');
});

$(document).ready(start);
