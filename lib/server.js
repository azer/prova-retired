var express = require("express"),
    path    = require('path'),
    fs      = require("fs"),
    app     = express();

app.use(express.logger());
app.use(express.static(path.join(__dirname, '../web')));

module.exports = function(bundle){

  app.get('/bundle.js', function(req, res){
    res.send(fs.readFileSync(bundle));
  });

  app.listen(7559);
  console.log('Visit localhost:7559 to run tests on a web browser');
};
