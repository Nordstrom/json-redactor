# Log Filter

Recursively clean a list of arguments before sending them out somewhere.

This is a standard npm module, so you install it via

`npm install --save log-filter`

## `require` it like:

```js
var logFilter = require('logFilter')([List of values to filter out],maxRecursion)

// Defaults:
//  List of values to filter out: ['firstName', 'lastName', 'phone']
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
      b.error.apply(null,_.values(logFilter(watchKeys).clean.apply(null,arguments)))
    },
    info = function(){
      b.info.apply(null,_.values(logFilter(watchKeys).clean.apply(null,arguments)))
    },
    warn = function(){
      b.warn.apply(null,_.values(logFilter(watchKeys).clean.apply(null,arguments)))
    },
    debug = function(){
      b.debug.apply(null,_.values(logFilter(watchKeys).clean.apply(null,arguments)))
    }
```

### standard usage

`logFilter.clean()`

