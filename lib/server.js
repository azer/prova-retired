var express = require("express"),
    path    = require('path'),
    fs      = require("fs"),
    prop    = require('new-prop'),
    app     = express(),

    port    = prop(7559);

app.use(express.logger());
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

  app.listen(port());

  process.stdout.write('\n\n  Visit localhost:' + port() + ' to run tests on a web browser.\n\n');
};
