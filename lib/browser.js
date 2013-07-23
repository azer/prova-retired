var one     = require("one"),
    path    = require("path"),
    fs      = require('fs'),
    uniques = require('uniques'),
    after   = require('after-time'),
    paths   = require('./paths'),
    server  = require('./server'),
    visit   = require('./visit'),
    toInclude;

module.exports = browser;

function browser(args){
  paths(args._, function(error, paths){
    if(error) throw error;

    server.bundle(bundle(paths, args).render());
    server.paths(paths);
    server();

    args.visit && visit();
  });
}

function bundle(paths, args){
  paths ? ( bundle.paths = paths ) : ( paths = bundle.paths );
  args ? ( bundle.args = args ) : ( args = bundle.args );

  var filename = paths[0],
      result   = one(filename).global(),
      dir, otherPaths;

  //if(!args.visit) bundle.debug();

  dir = path.dirname(paths[0]) + '/';
  otherPaths = paths.slice(1).map(function(p){
    if(p.indexOf(dir) != 0) return undefined;
    return './' + p.slice(dir.length);
  });

  otherPaths.forEach(result.require);

  !args.nowatch && watchAll(result.files());

  return result;
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
    server.io.publish({ update: true });
  });
}

function watchDir(dir){
  fs.watch(dir, onChange);
}

function watchAll(files){
  var toWatch = filterFilesToWatch(files);

  toWatch.forEach(watchDir);
}
