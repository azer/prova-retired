var phantom = require('phantom'),
    style   = require('styled'),
    port    = require('./server').port;

module.exports = visit;

function visit(){
  process.stdout.write(style('grey', 'Visiting localhost:' + port() + ' with PhantomJS.'));

  phantom.create(function(window){
    window.createPage(function(page){
      page.open("localhost:" + port(), function(status){
        console.log(status);
        setTimeout(function(){
          window.exit();
        }, 2000);
      });
    });
  });
}
