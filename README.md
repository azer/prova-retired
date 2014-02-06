## Prova [![Build Status](https://travis-ci.org/azer/prova.png)](https://travis-ci.org/azer/prova)

A new pragmatic JavaScript testing framework for both NodeJS and browsers. [Screencast](https://vimeo.com/72334347)

## Features

- No configuration needed.
- It's quite simple, run `prova` command to run on Node, add `-b` parameter to run on browsers (browserifies for you)
- Keep the browsers always open, it enables watchify as well, so your browser will run your tests automatically
- Headless testing is simple as well, run tests in PhantomJS by `-i` parameter.
- Beautified error output that show failing lines.
- ChaiJS is injected to every module to avoid repeating. If you don't prefer injection, pass `-V` to avoid it.
- Mostly compatible with Mocha.

## Install

```bash
$ npm install -g prova
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
$ prova # It'll look modules like test.js and test/index by default. You can specify them manually; prova test_foo.js test_b*.js
OK, passed 1 test.
```

![](https://dl.dropbox.com/s/agkrqwdrw3jlfhs/fox_cli.png)

## Running On Browsers

```bash
$ prova -b
Visit localhost:7559 to run tests on a web browser
```

Once you pass `-b` parameter, Prova [compiles your source code for browsers](https://github.com/azer/fox/blob/master/lib/browser.js) and [publishes](https://github.com/azer/fox/blob/master/lib/server.js) [a web page](https://github.com/azer/fox/blob/master/web/index.html) where you can run and see the test results.

## Running On PhantomJS Headlessly

If you have PhantomJS installed in your system, run Prova with `-i` parameters to run the tests headlessly;

```bash
$ prova -i
```

![](https://dl.dropboxusercontent.com/s/xji3v0p4yonssgy/fox-bv.png)
