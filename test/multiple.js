var once = true;

it('calls done multiple times', function(done){
  done();

  setTimeout(function(){

    done();

    setTimeout(function(){
      done();
    }, 200);

  }, 100);
});

it('should be called only once', function(done){
  expect(once).to.be.true;
  once = false;
  done();
});
