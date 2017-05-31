# JSON Redactor

Recursively clean a list of arguments before sending them out somewhere.

This is a (soon to be) standard npm module, so you'll install it via

`npm install --save json-redactor`

## `require` it like:

```js
var jsonRedactor = require('json-redactor')([List of regex to filter out],maxRecursion)

// Defaults:
//  List of regex to filter out: [ /firstName/gi, /lastName/gi, /phone/gi ]
//  maxRecursion: 20
```

## `test` it by:

`npm test`

## `use` it like:

### as a go-between, example using `bole`

```js
var b = bole(name)
var pre = {
  error = function(){
    b.error.apply(null,_.values(jsonRedactor(watchKeys).clean.apply(null,arguments)))
  },
  info = function(){
    b.info.apply(null,_.values(jsonRedactor(watchKeys).clean.apply(null,arguments)))
  },
  warn = function(){
    b.warn.apply(null,_.values(jsonRedactor(watchKeys).clean.apply(null,arguments)))
  },
  debug = function(){
    b.debug.apply(null,_.values(jsonRedactor(watchKeys).clean.apply(null,arguments)))
  }
}
```

### standard usage

`jsonRedactor.clean()`

## Some examples

```js
jsonRedactor([/error/gi]).clean('this is a error')
// returns 'REDACTED, DO NOT LOG PERSONALLY IDENTIFIABLE INFORMATION'
// this is because our regex matches `error` in the clean function, and the argument was a string, so it gets redacted

jsonRedactor([/string/gi]).clean({string:'test',test2:'string'})
// returns {test2:'REDACTED, DO NOT LOG PERSONALLY IDENTIFIABLE INFORMATION'}
// this is because our regex matches the key string, which gets removed, and the string `string` gets redacted
```