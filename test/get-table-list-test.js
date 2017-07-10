'use strict'

const path = require('path')
//var _ = require('lodash')
//var camelCase = require(path.resolve('.//src/core/camel-case'))
var assert = require('chai').assert
var createTableScript = require(path.resolve('.//src/core/create-table-script'))
const fs = require('fs')

describe('Create Table Script File Tests', function() {

    it('Get Table List Test', function(done) {
      createTableScript.getTableList(function(err, data) {
        if(err) return console.log(err)
        assert.isNotNull(data)
        //console.log(data)
        done()
      })
    })

  it('Get Create Statement Test', function(done) {
    createTableScript.getCreateTableStatement('tblClient', function(err, data) {
      if(err) return console.log(err)
      assert.isNotNull(data)
      //console.log(data)
      done()
    })
  })

  it('Get Table Constraints Test', function(done) {
    createTableScript.getForeignKeyConstraintTables('tblClientLocation', function(err, result) {
      if(err) return console.log(err)
      //assert.isAtLeast(result.length, 1)
      //console.log(result)
      done()
    })
  })

  it('Generate Ordered Table File Test', function(done) {
    this.timeout(10000)
    createTableScript.generateOrderedTableFile(path.join(__dirname, 'tableScript.json'), function(err, result) {
      if(err) return console.log(err)
      assert.isAtLeast(result.length, 1)
      //console.log(result)
      done()
    })
  })
})
