var dom      = require("domquery"),
    pubsub   = require('pubsub'),
    onStart  = pubsub(),
    onError  = pubsub(),
    onFinish = pubsub(),
    el;

window.onFrameError = onError;
window.onFrameFinish = onFinish;

module.exports = {
  onError: onError,
  onFinish: onFinish,
  onStart: onStart,
  run: run,
  reset: reset
};

function reset(){
  if(el) el.remove();
  el = dom('<iframe src="context.html" />').insert('.frame');
}

function run(){
  onStart.publish();
  reset();
}
