var one    = require("one"),
    path   = require("path"),
    fs     = require('fs'),
    paths  = require('./paths'),
    server = require('./server'),
    toInclude;

module.exports = browser;
module.exports.include = include;

function browser(args){

  paths(args._, function(error, paths){

    if(error) throw error;

    var target = findManifest(paths);

    one(target)
      .include.apply(undefined, paths)
      .include.apply(undefined, toInclude)
      .exclude('fox', 'cli-color', 'express', 'glob', 'require-like', 'one', 'optimist', 'glob', 'browserify', 'mocha', 'commander', 'colors', 'uglify-js', 'mkdirp', 'request', 'coffee-script', 'connect', 'jade', 'redis', 'debug', 'mime', 'node-uuid', 'less', 'stylus', 'jsdom', 'mongodb', 'mongoose', 'rimraf', 'vows', 'requirejs', 'npm', 'jshint', 'node-static', 'shelljs', 'nodeunit', 'tar', 'pg')
      .devDependencies()
      .name('bundle')
      .quiet()
      .save(function(error, bundle){
        if(error) throw error;

        server(bundle, paths);
      });

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

function include(files){
  toInclude = files.split(',');
}
