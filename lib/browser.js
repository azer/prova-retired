var one    = require("one"),
    path   = require("path"),
    fs     = require('fs'),
    paths  = require('./paths'),
    server = require('./server'),
    visit  = require('./visit'),
    toInclude;

module.exports = browser;

function browser(args){
  paths(args._, function(error, paths){

    if(error) throw error;

    var bundle = one(paths[0]).debug().global(),
        dir    = path.dirname(paths[0]) + '/';

    paths = paths.slice(1)
      .map(function(p){
        if(p.indexOf(dir) != 0) return undefined;
        return './' + p.slice(dir.length);
      });

    paths.forEach(bundle.require);
    server(bundle.render(), paths);

    args.visit && visit();

  });
}
