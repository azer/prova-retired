var betterError = require('../../error'),
    theme       = require('./theme');

exports.run = function(test, error){
  console.log('running', test.title);
}

exports.start = function(){
  process.stdout.write('\u001B[2J\u001B[0;0f');
};

exports.error = function(test, error){
  var err = betterError(error, test);

  var output = [
    test.title,
    '',
    '    ' + theme.bold.red(err.message) + ' ' + theme.blackBright(err.filename + ':' + err.lineno),
    '        ' + theme.blackBright(err.code[0].lineno + '.   ' + err.code[0].code),
    '        ' + err.code[1].lineno + '.   ' + err.code[1].code,
    '        ' + theme.blackBright(err.code[2].lineno + '.   ' + err.code[2].code),
    '',
    '    ' + theme.blackBright(err.stack.replace(/\n/g, '\n        '))
  ];

  output = output.map(function(ln){
    return '    ' + ln;
  });

  output.splice(0,0, '\n\n');

  process.stdout.write(output.join('\n'));
};

exports.end = function(){
console.log( 'end' );

}
