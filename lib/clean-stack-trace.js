var isDisabled = require("./options").keepStack;

module.exports = cleanStackTrace;

function cleanStackTrace(stack){
  if (isDisabled()) return stack;

  if(!stack) return '';

  return stack
        .split('\n')
        .filter(function(line){
          return !isProvaTrace(line) && !isChaiTrace(line) && !isJQueryTrace(line);
        })
        .filter(function(el, ind, list){
          return list[ind-1] != el;
        })
        .slice(0, 10)
        .join('\n');
}

function isJQueryTrace(line){
  return /\/jquery\.min\.js/.test(line);
}

function isProvaTrace(line){
  return /\/prova\/(lib|bin|node_modules)/.test(line) || /\/prova\.js/.test(line) || /\/prova-runner\.js/.test(line);
}

function isChaiTrace(line){
  return /\/chai\/(lib|bin|node_modules)/.test(line);
}
