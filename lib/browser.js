var one    = require("one"),
    path   = require("path"),
    fs     = require('fs'),
    paths  = require('./paths'),
    server = require('./server');

module.exports = browser;

function browser(args){

  paths(args._, function(error, paths){

    if(error) throw error;

    var target = findManifest(paths),
        bundle = '/tmp/fox-bundle' + Math.floor(Math.random()*9999) + '.js';

    one(target)
      .include.apply(undefined, paths)
      .exclude('cli-color', 'express', 'glob', 'require-like', 'one', 'optimist')
      .dependency('fox', '*')
      .devDependencies()
      .debug()
      .name('bundle')
      .quiet()
      .save(bundle);

    server(bundle, paths);

  });

}

function findManifest(paths){
  var manifest;

  paths.some(function(filename){
    var apt = path.join(path.dirname(fs.existsSync(filename)), 'package.json');

    if(fs.existsSync(apt)){
      manifest = apt;
      return false;
    }

    return true;

  });

  return manifest;
}
