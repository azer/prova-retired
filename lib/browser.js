var server = require("./server"),
    path   = require('path'),
    one    = require('one');

module.exports = function(path){
  var target = path.join(path.dirname(filename), 'package.json'),
      bundle = '/tmp/fox-bundle' + Math.floor(Math.random()*9999) + '.js';

  one(target)
    .include('test.js')
    .dependency('chai', '*')
    .devDependencies()
    .debug()
    .name('bundle')
    .quiet()
    .save(bundle);

  server(bundle);
};
