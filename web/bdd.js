var suites     = bundle.require('./suites'),
    expect     = bundle.require('chai').expect,
    bdd        = bundle.require('./bdd'),

    after      = bdd.after,
    afterEach  = bdd.afterEach,
    before     = bdd.before,
    beforeEach = bdd.beforeEach,
    describe   = bdd.describe,
    it         = bdd.it;

function start(){

  $.getJSON('/modules', function(modulePaths) {

    try {

      modulePaths.map(bundle.require);

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
        error.stack,
        '</pre>',
        '</li>'
      ].join(''));

  });

});

suites.onFinish(function(result){
  result.passed && $('#result').append('<li>OK, passed ' + result.passed + ' tests.</li>');
});


/*
function iter(i){
  if( i >= suites.length ) {
    return;
  }

  var suite = suites[i];

  suite.runAll(function(){

    suite.errors.forEach(function(el){
      console.log('error', el.test.title);



    });

    iter(i+1);
  });

};

$(document).ready(function(){
  iter(0);
});
*/

$(document).ready(start);
