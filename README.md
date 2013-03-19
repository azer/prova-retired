fox is a new JavaScript testing framework running on NodeJS and browsers. 
It requires no ceremony, let's you write and run tests quickly.

```bash
$ npm install -g fox
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

![](https://dl.dropbox.com/s/agkrqwdrw3jlfhs/fox_cli.png?token_hash=AAET5mc15WE-bx9WlW0CLmZwk4N0K0qgcT9PMh72NX_KCA)

### On browsers:

```bash
$ fox -b # looks for modules like test.js or test/index.js by default.
Visit localhost:7559 to run tests on a web browser
```

Once you pass `-b` parameter, fox compiles the whole NPM package with related
test modules and publishes a web page where you can run and see the test results.

![](https://dl.dropbox.com/s/vxqjrcs21lkyu31/fox_browsers.png?token_hash=AAGmgetvrDsTtDSypyyWiI1jhH2rJqQkBSrghjypyj2k1Q)

# BDD API

before, beforEach, describe, it, afterEach, after
