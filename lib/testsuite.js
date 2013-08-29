var pubsub  = require('pubsub'),
    globals = require('./globals'),
    suites  = require('./suites'),
    grep    = require('./grep'),
    timeout = require('./timeout');

module.exports = TestSuite;

Error.stackTraceLimit = Infinity;

function TestSuite(title){
  this.title = title;
  this.tests = [];
  this.errors = [];

  this.onError = pubsub();
  this.onFinish = pubsub();
  this.onRun = pubsub();

  suites.add(this);
}

TestSuite.prototype.error = function(error, test){
  var self = this;

  this.errors.push({ test: test, error: error });

  setTimeout(function(){
    self.onError.publish(error, test);
  });
};


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

TestSuite.prototype.run = function(test, next){
  var self = this;

  try {

    if(!test.ran){
      test.ran = true;

      checkTimeout();
      test.fn(done);
    }

    if(test.fn.length == 0){
      done();
    }

  } catch(error){
    done(error);
  }

  function checkTimeout(){
    checkTimeout.ref = setTimeout(function(){

      if(done.called) return;

      self.error(new Error('timeout of ' + timeout() + 'ms exceeded.'), test);

    }, timeout());
  }

  function done(error){

    if (error) {
      self.errors.push({ test: test, error: error });

      setTimeout(function(){
        self.onError.publish(error, test);
      }, 0);
    }

    if(checkTimeout.ref != undefined){
      clearTimeout(checkTimeout.ref);
      checkTimeout.ref = undefined;
    }

    if(done.called){
      error = new Error('done() called multiple times');

      self.errors.push({ test: test, error: error });

      setTimeout(function(){
        self.onError.publish(error, test);
      });

      return;
    }

    done.called = true;
    self.onRun.publish(test, error);

    next();
  }

};

TestSuite.prototype.runAll = function(callback, undefined){

  var self = this,
      before = this.step('before', true),
      beforeEach = this.step('beforeEach'),
      after = this.step('after', true),
      afterEach = this.step('afterEach'),
      count = 0;

  function iter(i){

    if(i >= self.tests.length){
      after(function(){
        callback(count);
      });
      return;
    }

    var test = self.tests[i],
        next = function(){
          iter(i + 1);
        };

    if(!grep(test.title)){
      next();
      return;
    }

    count++;

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
