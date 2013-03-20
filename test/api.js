describe('#Foo', function self(){

  self.testsuite.onError(function(error, test){

    console.log('%s throws %s', test.title, error)

  })

  it('will sing us a rap song', function(){

    throw new Error('fails immediately')

  })

})
