var parseURL = require('url').parse;

module.exports = params;

function params(){
  var parsed = parseURL(document.location.href);

  if (!parsed.hash) {
    return '';
  }

  return parsed.hash.slice(1);
}
