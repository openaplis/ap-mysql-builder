'use strict'

const path = require('path')
var assert = require('chai').assert
var loadRedis = require(path.resolve('.//src/core/load-redis'))
const fs = require('fs')

describe('Redis Tests', function() {

  /*it('Load Redis from Datafiles test', function(done) {
    this.timeout(50000)
    var dir = path.resolve('../ap-object/src/core')
    loadRedis.loadRedisFromDataFiles(dir, /-test-data.json/, function(err, result) {
      if(err) return callback(err)
        assert.equal(result, 'success')
        done()
    })
  })*/

  it('Get All Keys Test', function(done) {
    loadRedis.getAllKeys('client', function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  })

  /*it('Get Values for keys Test', function(done) {
    var keys = ['5951530d1283212358057b1d', '5951530d1283212358057b1e',
          '5951530d1283212358057b1f',
          '5951530d1283212358057b20',
          '5951530d1283212358057b21',
          '5951530d1283212358057b22',
          '5951530d1283212358057b23',
          '5951530d1283212358057b24',
          '5951530d1283212358057b25',
          '5951530d1283212358057b26',
          '5951530d1283212358057b27',
          '5951530d1283212358057b28',
          '5951530d1283212358057b29',
          '5951530d1283212358057b2a']
          console.log(keys)
    loadRedis.getValuesForKeys(keys, function(err, result) {
      if(err) return console.log(err)
      assert.isNotNull(result)
      console.log(result)
      done()
    })
  })*/

  /*it('Create client test', function(done) {
    loadRedis.getAllKeys(function(err, result) {
      if(err) return console.log(err)
      var keys = result
      loadRedis.getValue('referenceData', keys[0], function(err, result) {
        if(err) return console.log(err)
        assert.isNotNull(result)
        var input = JSON.parse(result)
        loadRedis.createClient(input, function(err, result) {
          if(err) return callback(err)
          assert.isNotNull(result)
          console.log(result)
          done()
        })
      })
    })
  })*/
})
