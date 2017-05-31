'use strict'

var find = require('lodash.find') 
var isString = require('lodash.isstring') 
var isArray = require('lodash.isarray') 
var map = require('lodash.map') 
var isObject = require('lodash.isobject') 
var forOwn = require('lodash.forown') 
var cloneDeep = require('lodash.clonedeep')

var omittingKeys = [ /firstName/gi, /lastName/gi, /phone/gi]
var error = 'REDACTED, DO NOT LOG PERSONALLY IDENTIFIABLE INFORMATION'
var cntLimit = 20
var MAX
var watchKeys

function clean () {
  function firstRegexMatch(el){
    return !!find(watchKeys, function (v) {
      return el.match(v)
    })
  }

  function internalSwap(el,cnt){
    cnt++
    if(cnt >= MAX) return ''
    if(isString(el)){
      if(firstRegexMatch(el)){
        el = error
      }
    } else if(isArray(el)){
      el = map(el,function(el){
        return internalSwap(el,cnt)
      });
    } else if(isObject(el)){
      var cache = {}
      forOwn(el, function(v,k){
        if(!firstRegexMatch(k)){
          cache[k] = internalSwap(v,cnt)
        }
      })
      el = cache;
    }
    return el
  }

  var args = cloneDeep(arguments);
  var cleaned = {}
  forOwn(arguments,function(v,k){
    cleaned[k] = internalSwap(v,0)
  })
  return cleaned
}

module.exports = function (keys, countLimit) {
  watchKeys = keys || omittingKeys
  MAX = countLimit || cntLimit
  return {clean:clean}
}
