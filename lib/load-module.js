var vm          = require('vm'),
    fs          = require('fs'),
    path        = require('path'),
    chai        = require('chai'),
    requireLike = require('require-like'),
    options     = require('./options'),
    bdd         = require('./bdd'),
    mocks       = { chai: chai };

chai.Assertion.includeStack = true;

module.exports = loadModule;

function loadModule(filename){
  if (options.disableVM()) {
    return require(path.join(process.cwd(), filename));
  }

  var context = newContext(filename);
  vm.runInNewContext(read(filename), context, filename);
  return context.module.exports;
};

function mockRequire(relative){
  var relativeRequire = requireLike(relative);

  return function(module){
    return mocks[module] || relativeRequire(module);
  };
}

function newContext(filename){
  var exports = {},
      module  = { exports: exports };

  return {
    __filename    : filename,
    __dirname     : path.dirname(filename),

    Buffer        : Buffer,

    process       : process,
    console       : console,

    setTimeout    : setTimeout,
    clearTimeout  : clearTimeout,
    setInterval   : setInterval,
    clearInterval : clearInterval,

    exports       : exports,
    require       : mockRequire(filename),
    module        : module,

    chai          : chai,
    expect        : chai.expect,
    assert        : chai.assert,

    describe      : bdd.describe,
    it            : bdd.it,
    before        : bdd.before,
    after         : bdd.after,
    beforeEach    : bdd.beforeEach,
    afterEach     : bdd.afterEach
  };
}

function read(filename){
  if(!/\.js$/.test(filename))
    filename += '.js';

  return fs.readFileSync(filename);
}

function resolveModule(relative, module) {
  if (module.charAt(0) !== '.') return module;
  return path.resolve(path.dirname(relative), module);
};
