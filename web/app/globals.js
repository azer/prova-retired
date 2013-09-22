var chai = require('chai'),
    url = require('url'),
    qs = require('querystring'),
    suites = require('../../lib/suites'),
    bdd = require('../../lib/bdd'),
    setGrepPattern = require('../../lib/grep').pattern,
    timeout = require('../../lib/options').timeout,
    parsedURL = url.parse(document.location.href),
    params = qs.parse(parsedURL.query);

params.grep && setGrepPattern(params.grep);
params.timeout != undefined && timeout(params.timeout);

chai.Assertion.includeStack = true;

window.require = require;
window.suites = suites;

window.assert     = chai.assert;
window.expect     = chai.expect;
window.after      = bdd.after;
window.afterEach  = bdd.afterEach;
window.before     = bdd.before;
window.beforeEach = bdd.beforeEach;
window.describe   = bdd.describe;
window.it         = bdd.it;

suites.onRun(window.parent.onFrameRun.publish);

suites.onError(window.parent.onFrameError.publish);
suites.onFinish(function(msg){
  params.grep && (msg.grep = params.grep);
  window.parent.onFrameFinish.publish(msg);
})
