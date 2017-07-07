'use strict'

const path = require('path')
var assert = require('chai').assert
var db = require(path.resolve('.//src/core/load-db-from-redis'))

describe('load db from redis Tests', function() {

  it('Load objects test', function(done) {
    db.loadObjects('client', function(err, result) {
      if(err) console.log(err)
      //console.log(result)
      assert.equal(result, 'success')
      done()
    })
  })
})
