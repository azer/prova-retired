var express        = require("express"),
    path           = require('path'),
    fs             = require("fs"),
    attr           = require('attr'),
    style          = require('styled'),
    parseUserAgent = require('ua-parser-js'),

    app     = express(),
    port    = attr(7559);


app.use(express.bodyParser());
app.use(express.static(path.join(__dirname, '../web')));

module.exports = server;
module.exports.port = port;

function server(bundle, paths){

  app.get('/bundle.js', function(req, res){
    res.send(bundle);
  });

  app.get('/modules', function(req, res){
    res.send(JSON.stringify(paths));
  });

  app.post('/message', function(req, res){
    var msg = req.body;

    res.send('{ "ok": true }');

    if ( msg.error ) {
      log('red', '\n    ' + msg.content.test);
      log('white', '    ' + msg.content.error);
      log('grey', tab(msg.content.stack).slice(4));
    }

    var sysinfo;
    if ( msg.start ) {
      sysinfo = parseUserAgent(msg.content);
      log('cyan', 'Running tests on '
          + sysinfo.browser.name
          + style('grey', ' '
                  + sysinfo.browser.version
                  + ' / '
                  + sysinfo.os.name + ' '
                  + sysinfo.os.version));
    }

  });

  app.listen(port());

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
