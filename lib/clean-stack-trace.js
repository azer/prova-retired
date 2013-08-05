module.exports = cleanStackTrace;

function cleanStackTrace(stack){
  return stack;

  if(!stack) return '';

  return stack
        .split('\n')
        .filter(function(line){
          return !isFoxTrace(line) && !isChaiTrace(line) && !isJQueryTrace(line);
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

function isFoxTrace(line){
  return /\/fox\/(lib|bin|node_modules)/.test(line) || /\/fox\.js/.test(line) || /\/fox-runner\.js/.test(line);
}

function isChaiTrace(line){
  return /\/chai\/(lib|bin|node_modules)/.test(line);
}
