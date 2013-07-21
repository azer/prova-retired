var dom      = require("domquery"),
    pubsub   = require('pubsub'),
    onError  = pubsub(),
    onFinish = pubsub(),
    el       = dom('<iframe />').insert(document.body);

window.onFrameError = onError;
window.onFrameFinish = onFinish;

module.exports = {
  onError: onError,
  onFinish: onFinish,
  run: run,
  reset: reset
};

function reset(){
  el.attr('src', 'about:blank');
}

function run(){
  el.attr('src', 'context.html');
}
