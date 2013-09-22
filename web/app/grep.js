var params = require('./params'),
    dom = require('domquery'),
    input = dom('#grep');

params.onChange(function () {
  updateInput();
});

input.on(':enter', function(){
  params('grep', input.val());
});

dom('.grep-wrapper').click(function(){
  input[0].focus();
});

updateInput();

module.exports = grep;

function updateInput(){
  input.val(grep());
}

function grep(){
  return params('grep');
}
