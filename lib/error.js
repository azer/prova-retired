var fs   = require('fs'),
    path = require("path");

module.exports = newError;

function cleanStackTrace(stack){

  if(!stack) return '';

  return stack
        .split('\n')
        .filter(function(line){
          return !isFoxTrace(line) && !isChaiTrace(line);
        })
        .filter(function(el, ind, list){
          return list[ind-1] != el;
        })
        .slice(0, 10)
        .join('\n');
}

function isFoxTrace(line){
  return /\/fox\/(lib|bin|node_modules)/.test(line);
}

function isChaiTrace(line){
  return /\/chai\/(lib|bin|node_modules)/.test(line);
}

function newError(error, test){

  var result = {

    message: error.message,
    stack : cleanStackTrace(error.stack),
    test  : test

    /*
     filename, basename, lineno, code
     */
  };

  var stackMatching = result.stack.match(/\(([^\(\)]+)\)/);

  if(!stackMatching){
    return result;
  }

  stackMatching = stackMatching[1].split(':');

  var filename = result.filename = stackMatching[0],
      basename = result.basename = path.basename(filename),
      lineno   = result.lineno   = Number(stackMatching[1]),
      code     = result.code     = relatedCode(result);

  return result;
};

function relatedCode(err, callback){

  var buffer;

  try {
    buffer = fs.readFileSync(err.filename);
  } catch(readError) {
    return undefined;
  }

  return buffer
    .toString()
    .split('\n')
    .slice(err.lineno - 2, err.lineno + 1)
    .map(function(code, ind){
      return { lineno: err.lineno + (ind - 1), code: code };
    });
}
