var glob = require("glob"),
    map   = require('map');

module.exports = paths;

function flatten(list){
  var result = [];

  list.forEach(function(el){
    result.push.apply(result, el);
  });

  return result;
}

function paths(files, callback){
  map(glob, files, function(error, files){
    callback(error, files && flatten(files));
  });
}
