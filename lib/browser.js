var browserify = require("browserify");
var watchify = require("watchify");
var path = require("path");
var fs = require('fs');
var uniques = require('uniques');
var after = require('after-time');
var concat = require("concat-stream");
var debug = require("local-debug")('browser');
var brfs = require('brfs');
var paths = require('./paths');
var server = require('./server');
var visit = require('./visit');

module.exports = browser;

function browser(args){
  paths(args._, function(error, paths){
    if(error) throw error;

    var init = true;

    bundle(paths, args, function (error, output) {
      if (error) throw error;

      server.bundle(output);

      if (init) {
        server.paths(paths);
        server();
        args.visit && visit();
        init = false;
        return;
      }

      server.bundle(output);
      server.notify({ update: true });
      server.log('grey', 'Notifying browsers the file change you just made.');
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

  debug('Preparing build from %s', paths.join(', '));

  paths.forEach(function (filename) {
    result.add(filename);
  });

  result.transform(brfs);

  var buffer = '';
  var read = watchify(result);
  var write = concat(done);

  read.on('update', function (up) {
    debug('You\'ve made some changes on the source code, open browsers will get notified with updates.');
    write = concat(done);
    read.bundle({ debug: true }).pipe(write);
  });

  read.on('error', callback);

  read.bundle({ debug: true }).pipe(write);

  function done (output) {
    callback(undefined, output);
  }
}
