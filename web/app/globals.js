var chai   = require('chai'),
    suites = require('../../lib/suites'),
    bdd    = require('../../lib/bdd');

chai.Assertion.includeStack = true;

window.suites = suites;

window.assert     = chai.assert;
window.expect     = chai.expect;
window.after      = bdd.after;
window.afterEach  = bdd.afterEach;
window.before     = bdd.before;
window.beforeEach = bdd.beforeEach;
window.describe   = bdd.describe;
window.it         = bdd.it;
