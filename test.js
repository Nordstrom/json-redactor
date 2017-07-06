'use strict'

/* global describe, it, afterEach, beforeEach */

var WATCH_KEYS = [ /firstName/gi, /lastName/gi, /phone/gi ]
var ERROR_MESSAGE = 'TEST'

var jsonRedactor = require('./index.js')({
  error: ERROR_MESSAGE,
  watchKeys: WATCH_KEYS
})

var triggers = ['firstName', 'lastName', 'phone', 'phoneNumber', 'standardfirstname']
var assert = require('assert')

describe('json redactor', function () {
  function assertion (obj, exp) {
    var a = jsonRedactor(obj)[0]
    assert.equal(JSON.stringify(a), JSON.stringify(exp))
  }

  describe('does nothing', function () {
    var object = {}
    it('when passed an empty object', function () {
    })

    it('when passed an empty array', function () {
      object = []
    })

    it('when passed an empty string', function () {
      object = ''
    })

    it('when passed a regular object', function () {
      object = {k: 'v'}
    })

    it('when passed a deep object', function () {
      object = {k: 'v', k2: {k: 'v'}}
    })

    it('when passed a regular array', function () {
      object = [1, 2, 'e', true]
    })

    afterEach(function () {
      assertion(object, object)
    })
  })

  describe('removes each key value', function () {
    var removed = {}
    var object = {}

    beforeEach(function () {
      object = {}
      removed = {firstName: 'a', lastName: 'b', phone: ''}
    })

    it('in a regular object', function () {
      object = removed
      object.test = 'test'
      assertion(object, {test: 'test'})
    })

    it('in a deep object', function () {
      object = {test1: removed, test2: 'test2'}
      assertion(object, {test1: {}, test2: 'test2'})
    })
  })

  describe('swaps out strings', function () {
    it('in a string', function () {
      for (var i = 0; i < triggers.length; i++) {
        assertion(triggers[i], ERROR_MESSAGE)
      }
    })
    it('in an array', function () {
      var t = triggers
      assertion(t, [ERROR_MESSAGE, ERROR_MESSAGE, ERROR_MESSAGE, ERROR_MESSAGE, ERROR_MESSAGE])
    })
    it('in a 2D array', function () {
      var t = [triggers]
      assertion(t, [[ERROR_MESSAGE, ERROR_MESSAGE, ERROR_MESSAGE, ERROR_MESSAGE, ERROR_MESSAGE]])
    })
    it('in a 3D array', function () {
      var t = [[triggers]]
      assertion(t, [[[ERROR_MESSAGE, ERROR_MESSAGE, ERROR_MESSAGE, ERROR_MESSAGE, ERROR_MESSAGE]]])
    })
    it('in an array inside of an object', function () {
      var t = {test: 'test', error: [triggers]}
      assertion(t, {test: 'test', error: [[ERROR_MESSAGE, ERROR_MESSAGE, ERROR_MESSAGE, ERROR_MESSAGE, ERROR_MESSAGE]]})
    })
  })

  describe('covers elements that are circular', function () {
    it('replaces circular references with `[circular]`', function () {
      var t = {a: 1, b: 2}
      t.c = t
      var test = {a: 1, b: 2, c: '[circular]'}
      assertion(t, test)
    })
    it('it still works on deep references', function () {
      var t = {a: 1, b: 2}
      t.c = {d: t}
      var test = {a: 1, b: 2, c: {d: '[circular]'}}
      assertion(t, test)
    })
  })

  describe('swaps out strings and removes each key value', function () {
    it('if they both match some malicious string', function () {
      var t = {test: triggers[0]}
      t[triggers[1]] = 'test2'
      assertion(t, {test: ERROR_MESSAGE})
    })
  })
})
