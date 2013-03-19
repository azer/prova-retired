var fs   = require('fs'),
    path = require("path"),
    map  = require('map'),
    glob = map.bind(undefined, require('glob'));

module.exports = paths;

function complete(files){
  files.length || ( files = ['test.js', 'test/index.js'].filter(fs.existsSync) );

  return files;
}

function filterDuplicates(files){
  return files.filter(function(el, ind){
    return files.indexOf(el) >= ind;
  });
}

function flatten(list){
  var result = [];

  list.forEach(function(el){
    result.push.apply(result, el);
  });

  return result;
}

function isDirectory(filename){
  return fs.existsSync(filename) && fs.lstatSync(filename).isDirectory();
}


function paths(files, callback){

  files = complete(files);

  files = files.map(function(filename){

    if(isDirectory(filename))
      return path.join(filename, '*');
    else if(!/\.js$/.test(filename))
      return filename + '.js';

    return filename;

  });

  glob(files, function(error, files){
    callback(error, files && filterDuplicates(flatten(files)));
  });

}
