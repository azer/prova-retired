var util        = require("util"),
    style       = require('styled'),
    betterError = require('../../error');

exports.run = function(){};

exports.start = function(){
  process.stdout.write('\u001B[2J\u001B[0;0f');
};

exports.error = function(test, error){
  var err = betterError(error, test);

  var output = ['\n', test && test.title || '[Unknown]', ''],
      code = [];

  output.push('    '
              + style('bold red', err.message)
              + ' '
              + style.grey(err.filename + ( error.lineno ? ':' + err.lineno : '' )));

  if(err.code){
    code.push(style.grey(err.code[0].lineno + '.   ' + err.code[0].code),
              err.code && err.code[1] ? err.code[1].lineno + '.   ' + err.code[1].code : '',
              err.code && err.code[2] ? style.grey(err.code[2].lineno + '.   ' + err.code[2].code) : '');

    code = code.map(function(el){ return '        ' + el; });
  }

  output = output.concat(code);

  output.push('', '    ' + style.grey(err.stack.replace(/\n/g, '\n        ')));

  output = output.map(function(ln){
    return '    ' + ln;
  });

  output.push('\n');

  process.stdout.write(output.join('\n'));
};

exports.end = function(result){
  result.passed && process.stdout.write(util.format('\n    OK, passed %d tests.\n\n', result.passed));
}
