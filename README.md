## Fox [![Build Status](https://travis-ci.org/azer/fox.png)](https://travis-ci.org/azer/fox)

A new pragmatic JavaScript testing framework for both NodeJS and browsers. [Screencast](https://vimeo.com/70852179)

## Features

- No configuration needed.
- Can be used for both testing on NodeJS and browsers.
- Automatically runs tests on a file change, in open browsers.
- Headless testing with PhantomJS supported
- Beautified error outputs
- ChaiJS is injected to every module to avoid repeating.

## Install

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
$ fox # It'll look modules like test.js and test/index by default. You can specify them manually; fox test_foo.js test_b*.js
OK, passed 1 test.
```

![](https://dl.dropbox.com/s/agkrqwdrw3jlfhs/fox_cli.png)

## Running On Browsers

```bash
$ fox -b
Visit localhost:7559 to run tests on a web browser
```

Once you pass `-b` parameter, fox [compiles your source code for browsers](https://github.com/azer/fox/blob/master/lib/browser.js) and [publishes](https://github.com/azer/fox/blob/master/lib/server.js) [a web page](https://github.com/azer/fox/blob/master/web/index.html) where you can run and see the test results.

## Running On PhantomJS Headlessly

If you have PhantomJS installed in your system, run fox with `-bv` parameters to run the tests headlessly;

```bash
$ fox -bv
```

![](https://dl.dropboxusercontent.com/s/xji3v0p4yonssgy/fox-bv.png)
