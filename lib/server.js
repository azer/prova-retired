var express = require("express"),
    path = require('path'),
    fs = require("fs"),
    attr = require('attr'),
    pubsub = require('pubsub'),
    style = require('styled'),
    options = require('./options'),
    timeout = options.timeout,
    port = options.port;

var app = express(app),
    server = require('http').createServer(app),
    onConnect = require('simple.io')(server);

var bundle = attr(''),
    paths = attr([]),
    onUpdate = pubsub();

app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, '../web/dist')));
app.use('/src', express.static(process.cwd()));

app.get('/bundle.js', function(req, res){
  res.send(bundle());
});

app.get('/modules', function(req, res){
  res.send(JSON.stringify(paths()));
});

onConnect(function(io){
  onUpdate.subscribe(io.pub);

  io.pub({ timeout: timeout() });

  io.onClose(function(){
    onUpdate.unsubscribe(io.pub);
  });
});

module.exports = serve;
module.exports.bundle = bundle;
module.exports.notify = onUpdate.publish;
module.exports.paths = paths;
module.exports.log = log;

function cleanUserAgent(userAgent){
  return userAgent.replace(/^.+\)\s+/, '');
}

function serve(){
  server.listen(port());
  log('grey', '\n    Visit localhost:' + port() + ' to run tests.');
};

function onMessage(msg){
  if (msg.error) {
    log('red', '\n    ' + msg.name + style.grey(' (' + cleanUserAgent(msg.env) + ')'));
    log('white', '    ' + msg.message);
    log('grey', tab(msg.stack).slice(4));
    return;
  }

  if (msg.finish) {
    log('green', '\n    OK, passed ' + msg.passed + ' tests.' + style.grey(' (' + cleanUserAgent(msg.env) + ')'));
    return;
  }

  if (msg.start) {
    log('cyan', 'Running tests on ' + cleanUserAgent(msg.env));
  }
}


function showErrors(errors){
  errors.forEach(log);
}

function log(options, text){
  process.stdout.write(style(options, text) + '\n    ');
}

function tab(text){
  return text.split('\n').map(function(el, ind){
      return '    ' + el;
  }).join('\n');
}
