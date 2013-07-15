var phantom = require('phantom'),
    style   = require('styled'),
    port    = require('./server').port;

module.exports = visit;

function visit(){
  process.stdout.write(style('grey', 'Headless-mode enabled.\n    '));
  phantom.create(function(window){
    window.createPage(function(page){
      page.open("http://localhost:" + port());
    });
  });
}
