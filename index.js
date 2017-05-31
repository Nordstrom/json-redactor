'use strict'

var _ = require('lodash')
var omittingKeys = [ /firstName/gi, /lastName/gi, /phone/gi]
var error = 'REDACTED, DO NOT LOG PERSONALLY IDENTIFIABLE INFORMATION'
var cntLimit = 20
var MAX
var watchKeys

function clean () {
  function firstRegexMatch(el){
    return !!_.find(watchKeys, function (v) {
      return el.match(v)
    })
  }

  function internalSwap(el,cnt){
    cnt++
    if(cnt >= MAX) return ''
    if(_.isString(el)){
      if(firstRegexMatch(el)){
        el = error
      }
    } else if(_.isArray(el)){
      el = _.map(el,function(el){
        return internalSwap(el,cnt)
      });
    } else if(_.isObject(el)){
      var cache = {}
      _.forOwn(el, function(v,k){
        if(!firstRegexMatch(k)){
          cache[k] = internalSwap(v,cnt)
        }
      })
      el = cache;
    }
    return el
  }

  var args = _.cloneDeep(arguments);
  var cleaned = {}
  _.forOwn(arguments,function(v,k){
    cleaned[k] = internalSwap(v,0)
  })
  return cleaned
}

module.exports = function (keys, countLimit) {
  watchKeys = keys || omittingKeys
  MAX = countLimit || cntLimit
  return {clean:clean}
}
