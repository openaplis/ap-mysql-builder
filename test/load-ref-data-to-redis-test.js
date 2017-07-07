'use strict'

const assert = require('chai').assert
const path = require('path')

const loadRedis = require(path.resolve('./src/core/load-ref-data-to-redis'))

describe('Load redis tests', function() {

  it('- load data Test', function(done) {
    this.timeout(25000)
    loadRedis.loadData(function(err, result) {
      assert.isNotNull(result)
      assert.notEqual(result, undefined)
      console.log(result)
      done()
    })
  })
})
