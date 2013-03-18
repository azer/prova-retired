module.exports = {
  before     : before,
  beforeEach : beforeEach,
  after      : after,
  afterEach  : afterEach
};

function before(callback){
  callback();
}

function beforeEach(callback){
  callback();
}

function after(callback){
  callback();
}

function afterEach(callback){
  callback();
}
