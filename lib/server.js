var express = require("express"),
    path    = require('path'),
    fs      = require("fs"),
    app     = express();

app.use(express.logger());
app.use(express.static(path.join(__dirname, '../web')));

module.exports = function(bundle, paths){

  app.get('/bundle.js', function(req, res){
    res.send(fs.readFileSync(bundle));
  });

  app.get('/modules', function(req, res){
    res.send(JSON.stringify(paths));
  });

  app.listen(7559);

  console.log('Visit localhost:7559 to run tests on a web browser');

};
