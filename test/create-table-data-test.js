'use strict'

const path = require('path')
var assert = require('chai').assert
var fs = require('fs')
var createTableData = require(path.resolve('./src/core/create-table-data'))

describe('Create Table Data Tests', function() {

  it('run Test', function(done) {
    var howMany = 2
    createTableData.generateMasterAccessionNo(howMany, function(err, result) {
      if(err) return console.log(err)
      assert.equal(result.length, howMany)
      createTableData.run('tblAccessionOrder', result, function(err, dataObjs) {
        if(err) return console.log(err)
        assert.equal(dataObjs.length, howMany)
        console.log(dataObjs)
        done()
      })
    })
  })
})
