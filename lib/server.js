var express = require("express"),
    path    = require('path'),
    fs      = require("fs"),
    attr    = require('attr'),
    style   = require('styled'),
    app     = express(app),
    server  = require('http').createServer(app),
    io      = require('simple.io')(server),

    bundle  = attr(''),
    paths   = attr([]),
    port    = attr(7559);

app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, '../web/dist')));

module.exports = serve;
module.exports.bundle = bundle;
module.exports.io = io;
module.exports.paths = paths;
module.exports.port = port;

function cleanUserAgent(userAgent){
  return userAgent.replace(/^.+\)\s+/, '');
}

function serve(){
  app.get('/bundle.js', function(req, res){
    res.send(bundle());
  });

  app.get('/modules', function(req, res){
    res.send(JSON.stringify(paths()));
  });

  io.subscribe(function(msg){
    if (msg.error) {
      log('red', '\n    ' + msg.name);
      log('white', '    ' + msg.message);
      log('grey', tab(msg.stack).slice(4));
      return;
    }

    if (msg.finish) {
      log('green', '\n    OK, passed ' + msg.passed + ' tests.\n');
      return;
    }

    if (msg.start) {
      log('cyan', 'Running tests on ' + cleanUserAgent(msg.env));
    }
  });

  server.listen(port());

  log('grey', '\n    Visit localhost:' + port() + ' to run tests.');
};

function showErrors(errors){
  errors.forEach(log);
}

function log(options, text){
  process.stdout.write(style(options, text) + '\n    ');
}

function tab(text){
  return text.split('\n')
    .map(function(el, ind){
      return '    ' + el;
    })
    .join('\n');
}
