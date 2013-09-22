var parseURL = require('url').parse;
var qs = require('querystring');
var pubsub = require("pubsub");
var onChange = pubsub();
var dom = require('domquery');

dom(window).on('hashchange', function(){
  onChange.publish();
});

module.exports = params;
module.exports.onChange = onChange;
module.exports.stringify = stringify;

function params (key, value) {
  if (arguments.length == 1 && typeof key == 'object') {
    return updateAll(arguments[0]);
  }

  if (arguments.length == 1 && typeof key == 'string') {
    return parse()[key] || '';
  }

  if (arguments.length == 2) {
    return update(key, value);
  }

  return parse();
}

function parse(){
  var url = parseURL(document.location.href);

  if (!url.hash || url.hash.charAt(0) != '#') {
    return {};
  }

  var str = url.hash.slice(1);
  return qs.parse(str);
}

function stringify () {
  return qs.stringify(params());
}

function update (key, value) {
  var all = params();
  all[key] = String(value);

  if (value == undefined) {
    delete all[key];
  }

  if (update.timer != undefined) {
    clearTimeout(update.timer);
    update.timer = undefined;
  }

  update.timer = setTimeout(function () {
    document.location.href = document.location.href.split('#')[0] + '#' + qs.stringify(all);
  }, 0);
}

function updateAll (content) {
  var key;
  for (key in content) {
    update(key, content[key]);
  }
}
