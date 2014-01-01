var browserify = require("browserify"),
    path = require("path"),
    fs = require('fs'),
    uniques = require('uniques'),
    after = require('after-time'),
    paths = require('./paths'),
    server = require('./server'),
    visit = require('./visit'),
    toInclude;

module.exports = browser;

function browser(args){
  paths(args._, function(error, paths){
    if(error) throw error;

    bundle(paths, args, function (error, output) {
      if (error) throw error;

      server.bundle(output);
      server.paths(paths);
      server();

      args.visit && visit();
    });
  });
}

function bundle (paths, args, callback) {
  paths ? ( bundle.paths = paths ) : ( paths = bundle.paths );
  args ? ( bundle.args = args ) : ( args = bundle.args );

  var result = browserify();
  var dir = path.dirname(paths[0]) + '/';

  paths = paths.map(function(filename, ind){
    if (ind == 0) return './' + filename;
    if (filename.indexOf(dir) != 0) return undefined;
    return './' + filename.slice(dir.length);
  });

  paths.forEach(function (filename) {
    result.add(filename);
  });

  var buffer = '';
  var stream = result.bundle();

  stream.on('data', function (chunk) {
    buffer += chunk;
  });

  stream.on('error', function (error) {
    callback(error);
  });

  stream.on('end', function () {
    callback(undefined, buffer);
  });
}

function filterFilesToWatch(files){
  if (files.length == 1) return files;

  return uniques(files.map(path.dirname));
}

function onChange(){
  if (onChange.defer != undefined){
    clearTimeout(onChange.defer);
  }

  onChange.defer = after('250ms', function(){
    onChange.defer = undefined;
    server.bundle(bundle().render());
    server.notify({ update: true });
    server.log('grey', 'Notifying browsers the file change you just made.');
  });
}

function watchDir(dir){
  fs.watch(dir, onChange);
}

function watchAll(files){
  var toWatch = filterFilesToWatch(files);

  toWatch.forEach(watchDir);
}
