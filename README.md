## Prova [![Build Status](https://travis-ci.org/azer/prova.png)](https://travis-ci.org/azer/prova)

A new pragmatic JavaScript testing framework for both NodeJS and browsers. [Screencast](https://vimeo.com/72334347)

## Features

- No configuration needed.
- NodeJS and browsers supported. All you need is to pass `-b` parameter. It browsefies and serves the source code for you.
- Keep the browsers open, your tests will be run on any code change automatically.
- Headless testing with PhantomJS with `-bv` parameter.
- Beautified error output that show failing lines.
- ChaiJS is injected to every module to avoid repeating.
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

If you have PhantomJS installed in your system, run Prova with `-bv` parameters to run the tests headlessly;

```bash
$ prova -bv
```

![](https://dl.dropboxusercontent.com/s/xji3v0p4yonssgy/fox-bv.png)
