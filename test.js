'use strict'

var WATCH_KEYS = [ /firstName/gi , /lastName/gi , /phone/gi ]
var triggers = ['firstName','lastName','phone','phoneNumber','standardfirstname']
var ERROR_MESSAGE = 'REDACTED, DO NOT LOG PERSONALLY IDENTIFIABLE INFORMATION'
var jsonRedactor = require('./index.js')(WATCH_KEYS)
var assert = require('assert');

describe('remove PII', function() {

  function assertion(obj,exp){
    var a = jsonRedactor.clean(obj)[0]
    assert.equal(JSON.stringify(a),JSON.stringify(exp))
  }

  describe('does nothing', function(){
    var object = {}
    it('when passed an empty object', function() {
    });

    it('when passed an empty array', function() {
      object = []
    });

    it('when passed an empty string', function() {
      object = ''
    });

    it('when passed a regular object', function() {
      object = {k:'v'}
    });

    it('when passed a deep object', function() {
      object = {k:'v',k2:{k:'v'}}
    });

    it('when passed a regular array', function() {
      object = [1,2,'e',true]
    });

    afterEach(function(){
      assertion(object,object)
    })
  });

  describe('removes each key value', function(){
    var removed = {}
    var object = {}

    beforeEach(function(){
      object = {}
      removed = {firstName:'a',lastName:'b',phone:''}
    })

    it('in a regular object', function(){
      object = removed
      object.test = 'test';
      assertion(object,{test:'test'})
    })

    it('in a deep object', function(){
      object = {test1:removed,test2:'test2'}
      assertion(object,{test1:{},test2:'test2'})
    })
  })

  describe('swaps out strings', function (){
    var watchKeys
    beforeEach(function(){
      watchKeys = WATCH_KEYS
    })
    it('in a string',function(){
      for(var i = 0; i < triggers.length; i++){
        assertion(triggers[i],ERROR_MESSAGE)
      }
    })
    it('in an array',function(){
      var t = triggers
      assertion(t,[ERROR_MESSAGE,ERROR_MESSAGE,ERROR_MESSAGE,ERROR_MESSAGE,ERROR_MESSAGE])
    })
    it('in a 2D array',function(){
      var t = [triggers]
      assertion(t,[[ERROR_MESSAGE,ERROR_MESSAGE,ERROR_MESSAGE,ERROR_MESSAGE,ERROR_MESSAGE]])
    })
    it('in a 3D array',function(){
      var t = [[triggers]]
      assertion(t,[[[ERROR_MESSAGE,ERROR_MESSAGE,ERROR_MESSAGE,ERROR_MESSAGE,ERROR_MESSAGE]]])
    })
    it('in an array inside of an object',function(){
      var t = {test:'test',error:[[triggers]]}
      assertion(t,{test:'test',error:[[[ERROR_MESSAGE,ERROR_MESSAGE,ERROR_MESSAGE,ERROR_MESSAGE,ERROR_MESSAGE]]]})
    })
  })

  describe('swaps out strings and removes each key value', function(){
    it('if they both match some malicious string', function(){
      var t = {test:triggers[0]}
      t[triggers[1]] = 'test2'
      assertion(t,{test:ERROR_MESSAGE})
    })
  })
});