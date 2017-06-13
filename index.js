'use strict'

var find = require('lodash.find')
var map = require('lodash.map')
var isObject = require('lodash.isobject')
var forOwn = require('lodash.forown')

var error = '-'

module.exports = function (opts) {
  opts = opts || {}
  var WATCH = opts.watchKeys || []
  var ERR = opts.error || error

  return function clean () {
    var gcache = []

    function firstRegexMatch (el) {
      return !!find(WATCH, function (k) {
        return el.match(k)
      })
    }

    function internalSwap (el, cnt) {
      if (typeof el === 'string') {
        if (firstRegexMatch(el)) {
          el = ERR
        }
      } else if (Array.isArray(el)) {
        el = map(el, function (el) {
          return internalSwap(el, cnt)
        })
      } else if (isObject(el)) {
        var index = gcache.indexOf(el)
        if (index !== -1) {
          return '[circular]'
        }
        gcache.push(el)
        var cache = {}
        forOwn(el, function (v, k) {
          if (!firstRegexMatch(k)) {
            cache[k] = internalSwap(v, cnt)
          }
        })
        el = cache
      }
      return el
    }

    var cleaned = {}
    forOwn(arguments, function (v, k) {
      cleaned[k] = internalSwap(v, 0)
    })
    return cleaned
  }
}
