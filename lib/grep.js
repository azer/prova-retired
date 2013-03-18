var pattern = undefined;

module.exports = test;
module.exports.pattern = function(newPattern){
  pattern = new RegExp(newPattern);
};

function test(text){
  return !pattern || pattern.test(text);
}
