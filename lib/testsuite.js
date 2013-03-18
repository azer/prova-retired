var pubsub  = require('ada-pubsub'),
    globals = require('./globals'),
    suites  = require('./suites');

module.exports = TestSuite;

Error.stackTraceLimit = Infinity;

function TestSuite(title){
  this.title    = title;
  this.tests    = [];
  this.errors   = [];

  this.onError  = pubsub();
  this.onFinish = pubsub();
  this.onRun    = pubsub();

  suites.add(this);
}

TestSuite.prototype.step = function(name, skipGlobal){
  var self = this;

  function global(cb){
    globals[name](cb);

    if(globals[name].length == 0)
      cb();
  }

  function local(cb){
    return function(){
      if(!self[name]) return cb();

      self[name](cb);

      if(self[name].length == 0)
        cb();
    }
  }

  return function(done){
    if(skipGlobal)
      local(done)();
    else
      global(local(done));
  };
};

TestSuite.prototype.test = function(title, fn){
  this.tests.push({
    title: this.title + ' ' + title,
    fn: fn
  });
};

TestSuite.prototype.run = function(test, callback){
  var self = this;

  function done(error){
    self.onRun.publish(test, error);
    callback();
  }

  try {

    if(!test.ran){
      test.ran = true;
      test.fn(done);
    }

    if(test.fn.length == 0){
      done();
    }

  } catch(error){
    setTimeout(function(){
      self.errors.push({ test: test, error: error });
      self.onError.publish(error, test);
    });
    done(error);
  }
};

TestSuite.prototype.runAll = function(callback, undefined){

  var self       = this,
      before     = this.step('before', true),
      beforeEach = this.step('beforeEach'),
      after      = this.step('after', true),
      afterEach  = this.step('afterEach');

  function iter(i){

    if(i >= self.tests.length){
      after(callback);
      return;
    }

    var test = self.tests[i],
        next = iter.bind(undefined, i+1);

    beforeEach(function(){
      self.run(test, function(){
        afterEach(next);
      });
    });
  };

  before(function(){
    iter(0);
  });

};
