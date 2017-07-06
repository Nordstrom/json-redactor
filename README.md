# JSON Redactor

[![Travis Build](https://travis-ci.org/Nordstrom/json-redactor.svg?branch=master)](https://travis-ci.org/Nordstrom/json-redactor)
[![Coverage Status](https://coveralls.io/repos/github/Nordstrom/json-redactor/badge.svg?branch=master)](https://coveralls.io/github/Nordstrom/json-redactor?branch=master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![json-redactor](https://img.shields.io/npm/v/json-redactor.svg)](https://www.npmjs.com/package/json-redactor)

Recursively clean a list of arguments before sending them out somewhere.

This is a standard npm module, so you'll install it via

`npm install --save json-redactor`

## `require` it like:

```js
var jsonRedactor = require('json-redactor')({
  watchKeys: // array of regex values, default is an empty array
  error: // string, default is '-'
})
```
`watchKeys` is the list of things to watch for, only accepts regex

`error` is the error message to replace strings that match the watchKeys with.

## `test` it by:

`npm test`

## `use` it like:

### as a go-between, example using `bole`

```js
var bole = require('bole');
var jsonRedactor = require('./logFilter.js')({
    watchKeys : [ /firstName/gi , /lastName/gi , /phone/gi , /^_.*/ ],
    error: 'Dont Log sensitive data'
  });

var b = bole(name)
var pre = {
  error : function(){
    b.error.apply(null,_.values(jsonRedactor.apply(null,arguments)))
  },
  info :function(){
    b.info.apply(null,_.values(jsonRedactor.apply(null,arguments)))
  },
  warn : function(){
    b.warn.apply(null,_.values(jsonRedactor.apply(null,arguments)))
  },
  debug : function(){
    b.debug.apply(null,_.values(jsonRedactor.apply(null,arguments)))
  }
}

return pre
```

### standard usage

`jsonRedactor()`

## Some examples

```js
var jsonRedactor = require('json-redactor')({
    watchKeys:[/error/gi]
  })
console.log(jsonRedactor('this is an error'))
// logs {'0':'-'}
```
The outer object is because we copy and return the arguments object, this way we can parse through an arbitrary amount of args. The inner string got redacted because our regex matches `error` in the clean function, and the argument was a string

```js
var jsonRedactor = require('json-redactor')({
    watchKeys:[/string/gi],
    error: 'redacted!'
  })
console.log(jsonRedactor({string:'test',test2:'string'}))
// logs {'0':{test2:'redacted!'}}
```
In the inner object, key `string` matches the regex so it gets stripped out. The value of key `test2` gets replaced with `redacted!` because that is what our error message is set to (and the value matches the regex)