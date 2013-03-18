var TestSuite = require('./testsuite'),
    globals   = require('./globals');

module.exports = {
  after      : after,
  afterEach  : afterEach,
  before     : before,
  beforeEach : beforeEach,
  describe   : describe,
  it         : it
};

function after(fn){
  if(after.caller.testsuite)
    after.caller.testsuite.after = fn;
  else
    globals.after = fn;
}

function afterEach(fn){
  if(afterEach.caller.testsuite)
    afterEach.caller.testsuite.afterEach = fn;
  else
    globals.afterEach = fn;
}

function before(fn){
  if(before.caller.testsuite)
    before.caller.testsuite.before = fn;
  else
    globals.before = fn;
}

function beforeEach(fn){
  if(beforeEach.caller.testsuite)
    beforeEach.caller.testsuite.beforeEach = fn;
  else
    globals.beforeEach = fn;
}

function describe(title, fn){
  fn.testsuite = new TestSuite(title);
  fn();
}

function it(title, fn){
  fn.testsuite = it.caller.testsuite || new TestSuite(title);
  fn.testsuite.test(it.caller.testsuite ? title : '', fn);
}
