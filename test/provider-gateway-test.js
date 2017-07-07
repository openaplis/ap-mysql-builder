'use strict'

var assert = require('chai').assert
var providerGateway = require('../src/core/provider-gateway')

describe('Provider GateWay Tests', function() {
  it('Get Client by Id Test', function(done) {
    providerGateway.getClientById('33', function(err, result) {
      if(err) return console.log(err)
      assert.isNotNull(result)
      console.log(result)
      done()
    })
  })
})
