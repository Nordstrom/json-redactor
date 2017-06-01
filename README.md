# JSON Redactor

Recursively clean a list of arguments before sending them out somewhere.

This is a standard npm module, so you'll install it via

`npm install --save json-redactor`

## `require` it like:

```js
var jsonRedactor = require('json-redactor')({
  max: // int, default is 20
  watchKeys: // array of regex, default is [ /firstName/gi, /lastName/gi, /phone/gi]
  error: // string, default is 'REDACTED, DO NOT LOG PERSONALLY IDENTIFIABLE INFORMATION'
})
```
`max` is the maximum number of recursions to go, deeper than max gets reset to ''.
This is done so that recursive structures dont error out with a stack overflow.

`watchKeys` is the list of things to watch for, only accepts regex

`error` is the error message to replace strings that match the watchKeys with.

## `test` it by:

`npm test`

## `use` it like:

### as a go-between, example using `bole`

```js
var bole = require('bole');
var jsonRedactor = require('./logFilter.js')({
    watchKeys : [ /firstName/gi , /lastName/gi , /phone/gi ],
    error: 'Dont Log sensitive data',
    max: 5
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
var jsonRedactor = require('jsonRedactor')({
    watchKeys:[/error/gi]
  })
console.log(jsonRedactor('this is an error'))
// logs {'0':'REDACTED, DO NOT LOG PERSONALLY IDENTIFIABLE INFORMATION'}
```
The outer object is because we copy and return the arguments object, this way we can parse through an arbitrary amount of args. The inner string got redacted because our regex matches `error` in the clean function, and the argument was a string

```js
var jsonRedactor = require('jsonRedactor')({
    watchKeys:[/string/gi],
    error: 'redacted!'
  })
console.log(jsonRedactor({string:'test',test2:'string'}))
// logs {'0':{test2:'redacted!'}}
```
In the inner object, key `string` matches the regex so it gets stripped out. The value of key `test2` gets replaced with `redacted!` because that is what our error message is set to (and the value matches the regex)