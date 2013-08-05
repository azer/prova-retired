var dom = require("domquery"),
    pubsub = require('pubsub'),
    params = require('./params'),
    onStart = pubsub(),
    onError = pubsub(),
    onFinish = pubsub(),
    onRun = pubsub(),
    el;

window.onFrameError = onError;
window.onFrameRun = onRun;
window.onFrameFinish = onFinish;

module.exports = {
  onError: onError,
  onFinish: onFinish,
  onStart: onStart,
  onRun: onRun,
  run: run,
  reset: reset
};

function reset(){
  if(el) el.remove();
  var url = 'context.html?' + params();

  el = dom('<iframe src="' + url + '" />').insert('.frame');
}

function run(){
  console.clear();
  onStart.publish();
  reset();
}
