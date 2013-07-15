## Fox [![Build Status](https://travis-ci.org/azer/fox.png)](https://travis-ci.org/azer/fox)

A new pragmatic JavaScript testing framework fpr both NodeJS and browsers.

```bash
$ npm install -g fox
```

## First Steps

Create a new test document and name it `test.js`. [ChaiJS'](http://chaijs.com) `expect` and `assert` modules are injected to the test modules by default;

```js
describe('Number', function(){
  it('converts a date to a number', function(){    
      expect( Number(new Date) ).to.be.a('number')
  })
})
```

Available BDD methods:

* before
* beforeEach
* describe
* it
* afterEach
* after

## Running on Node

```bash
$ fox test # Globbing and multiple parameters are enabled.
OK, passed 1 test.
```

![](https://dl.dropbox.com/s/agkrqwdrw3jlfhs/fox_cli.png)

## Running On Browsers

```bash
$ fox test -b
Visit localhost:7559 to run tests on a web browser
```

Once you pass `-b` parameter, fox [compiles your source code for browsers](https://github.com/azer/fox/blob/master/lib/browser.js#L18) and [publishes](https://github.com/azer/fox/blob/master/lib/server.js#L19) [a web page](https://github.com/azer/fox/blob/master/web/index.html) where you can run and see the test results.

### Headless Testing

If you have PhantomJS installed in your system, run fox with `-bv` parameters to run the tests headlessly;

```bash
$ fox -bv
```

![](https://dl.dropboxusercontent.com/s/xji3v0p4yonssgy/fox-bv.png)

## Command-Line

```
    USAGE

        fox [modules] [options]

    OPTIONS

        -b    --browser    Publishes the tests on localhost:7559
        -g    --grep       Run tests matching with given pattern
        -t    --timeout    Set test-case timeout in milliseconds [2000]
        -v    --version    Show version and exit
        -h    --help       Show help and exit
```



## JavaScript API

```js

describe('#Foo', function self(){
  
  self.testsuite.onError(function(error, test){
    console.log('%s throws %s', test.title, error)
  })
  
  it('will sing us a rap song', function(){
    throw new Error('fails immediately')
  })
 
})

```

Observing errors thrown by all testsuites; 

```js
var fox = require('fox');

fox.suites.onError(function(updates){
  
  errors.forEach(function(update){
    var error = update.params[0],
        test = update.params[1];
    
    console.log('%s throws %s', test.title, error.message);
  })
  
});

```

# Migrating From Mocha

Unless you have nested `describe` calls, Fox can run your Mocha tests.
