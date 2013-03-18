var util        = require("util"),
    betterError = require('../../error'),
    theme       = require('./theme');

exports.run = function(test, error, ind){
//  process.stdout.write(theme.bold.blue('.'));
}

exports.start = function(){
  process.stdout.write('\u001B[2J\u001B[0;0f');
};

exports.error = function(test, error){
  var err = betterError(error, test);

  var output = ['\n', test && test.title || '[Unknown]', ''],
      code = [];

  output.push('    ' + theme.bold.red(err.message) + ' ' + theme.blackBright(err.filename + ( error.lineno ? ':' + err.lineno : '' )));

  if(err.code){
    code.push(theme.blackBright(err.code[0].lineno + '.   ' + err.code[0].code),
              err.code[1].lineno + '.   ' + err.code[1].code,
              theme.blackBright(err.code[2].lineno + '.   ' + err.code[2].code));

    code = code.map(function(el){ return '        ' + el; });
  }

  output = output.concat(code);

  output.push('', '    ' + theme.blackBright(err.stack.replace(/\n/g, '\n        ')));

  output = output.map(function(ln){
    return '    ' + ln;
  });

  output.push('\n');

  process.stdout.write(output.join('\n'));
};

exports.end = function(result){
  result.passed && process.stdout.write(util.format('\n    OK, passed %d tests.\n\n', result.passed));
//  process.stdout.write('\n    end');
}
