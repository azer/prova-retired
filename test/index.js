var fs = require('fs');

var globalBefore     = 0,
    globalBeforeEach = 0,
    globalAfter      = 0,
    globalAfterEach  = 0;

before(function(done){
  globalBefore++;
  done();
});

beforeEach(function(){
  globalBeforeEach++;
});

describe('TestSuite', function(){

  var localBefore     = 0,
      localBeforeEach = 0,
      localAfter      = 0,
      localAfterEach  = 0,
      localCounter    = 0;

  before(function(){
    expect(globalBefore).to.equal(1);
    expect(globalBeforeEach).to.equal(0);

    localBefore++;
  });

  beforeEach(function(){
    localBeforeEach++;
  });

  it('runs all tests in order', function(){
    expect(localCounter).to.equal(0);
    localCounter++;
  });

  it('first runs global before and beforeEach', function(){
    expect(globalBefore).to.equal(1);
    expect(globalBeforeEach).to.equal(2);
    expect(localCounter).to.equal(1);
    localCounter++;
  });

  it('then runs local before and beforeEach', function(){
    expect(localBefore).to.equal(1);
    expect(localBeforeEach).to.equal(3);
    expect(localCounter).to.equal(2);
    localCounter++;
  });

  it('may have a callback optionally', function(done){
    expect(localCounter).to.equal(3);
    localCounter++;
    done();
  });

  it('waits until specified timeout (default 1500)', function(done){
    setTimeout(function () {
      done();
    }, 2350);
  });


  afterEach(function(done){
    localAfterEach++;
    expect(localAfter).to.equal(0);
    done();
  });

  after(function(done){
    expect(localAfter).to.equal(0);
    expect(localAfterEach).to.equal(5);

    expect(globalAfter).to.equal(0);
    expect(globalAfterEach).to.equal(5);

    done();
  });

});

it('transfroms fs.readFileSync calls for browsers', function(){
  var fruits = fs.readFileSync('./test/fruits.txt').toString();
  expect(fruits).to.equal('apple\norange\ncherry\ngrape\n');
});

it('may have tests without description', function(){
  expect(globalBefore).to.equal(1);
  expect(globalBeforeEach).to.equal(7);
  expect(globalAfterEach).to.equal(6);
});

it('calls global beforeEach and afterEach for tests on top scope', function(){
  expect(globalBefore).to.equal(1);
  expect(globalBeforeEach).to.equal(8);
  expect(globalAfterEach).to.equal(7);
});

afterEach(function(){
  globalAfterEach++;
  expect(globalAfter).to.equal(0);
});

after(function(done){
  expect(globalAfterEach).to.equal(8);
  done();
});
