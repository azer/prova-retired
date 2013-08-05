var params = require('./params'),
    dom = require('domquery'),
    qs = require('querystring'),
    input = dom('#grep');

dom(window).on('hashchange', function(){
  updateInput();
});

input.on(':enter', function(){
  var p = qs.parse(params());
  p.grep = input.val();
  document.location.href = document.location.href.split('#')[0] + '#' + qs.stringify(p);
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
  return qs.parse(params()).grep || '';
}
