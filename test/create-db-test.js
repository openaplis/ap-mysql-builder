'use strict'

const path = require('path')
var assert = require('chai').assert
var createdb = require(path.resolve('.//src/core/create-db'))
const fs = require('fs')

describe('Create Database Test', function() {

  it('Create Test', function(done) {
    this.timeout(20000)
    createdb.createDatabase(path.join(__dirname, 'tableScript.json'), function(err, result) {
      if(err) return console.log(err)
      assert.equal(result, 0)
      done()
    })
  })
})
