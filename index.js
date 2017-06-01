'use strict'

var find = require('lodash.find')
var isString = require('lodash.isstring')
var isArray = require('lodash.isarray')
var map = require('lodash.map')
var isObject = require('lodash.isobject')
var forOwn = require('lodash.forown')
var cloneDeep = require('lodash.clonedeep')

var omittingKeys = [ /firstName/gi, /lastName/gi, /phone/gi ]
var error = 'REDACTED, DO NOT LOG PERSONALLY IDENTIFIABLE INFORMATION'
var recursionLimit = 20

module.exports = function (opts) {
  opts = opts || {}
  var MAX = opts.max || recursionLimit
  var WATCH = opts.watchKeys || omittingKeys
  var ERR = opts.error || error

  return function clean () {
    function firstRegexMatch (el) {
      return !!find(WATCH,function(k){
        return el.match(k)
      })
    }

    function internalSwap (el, cnt) {
      cnt++
      if (cnt >= MAX) return ''
      if (isString(el)) {
        if (firstRegexMatch(el)) {
          el = ERR
        }
      } else if (isArray(el)) {
        el = map(el, function (el) {
          return internalSwap(el, cnt)
        })
      } else if (isObject(el)) {
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

    var args = cloneDeep(arguments)
    var cleaned = {}
    forOwn(args, function (v, k) {
      cleaned[k] = internalSwap(v, 0)
    })
    return cleaned
  }
}
