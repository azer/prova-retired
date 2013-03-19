fox a new JavaScript testing framework running on NodeJS and browsers. 
It requires no ceremony, let's you write and run tests quickly.

```
$ npm install fox
```

# USAGE

Create a new test document and name it `test.js`. [ChaiJS'](http://chaijs.com) `expect` and `assert` modules are injected by default;

```js
describe('Number', function(){

  it('convert a Date to a number', function(){
      
      expect( Number(new Date) ).to.be.a('number')
      
  })

})
```

### On NodeJS:

```bash
$ fox test # Globbing and multiple parameters are enabled.
OK, passed 1 test.
```

### On browsers:

```bash
$ fox -b # looks for modules like test.js or test/index.js by default.
Visit localhost:7559 to run tests on a web browser
```

Once you pass `-b` parameter, fox compiles the whole NPM package with related
test modules and publishes a web page where you can run and see the test results.

### BDD API

before, beforEach, describe, it, afterEach, after
