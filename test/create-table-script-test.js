'use strict'

var _ = require('lodash')
const path = require('path')
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
    createTableScript.getCreateTableStatement('tblAccessionOrder', function(err, data) {
      if(err) return console.log(err)
      assert.isNotNull(data)
      //console.log(data)
      done()
    })
  })

  it('Get Table Constraints Test', function(done) {
    createTableScript.getForeignKeyConstraintTables('tblAliquotOrder', function(err, result) {
      if(err) return console.log(err)
      assert.isAtLeast(result.length, 1)
      //console.log(result)
      done()
    })
  })

  it('Set Priority Test', function(done) {
    var tbls = [{ "tableName":"T1", "sql": "T1 sql", "referenceTables": [{"tableName": "T4"}], "priority": 0 },
    { "tableName":"T2", "sql": "T2 sql", "referenceTables": [{"tableName": "T1"}], "priority": 0 },
    { "tableName":"T3", "sql": "T3 sql", "referenceTables": [{"tableName": "T2"}], "priority": 0 },
    { "tableName":"T4", "sql": "T4 sql", "referenceTables": [], "priority": 0 }]
    createTableScript.setPriority(tbls)
    var sorted = _.sortBy(tbls, function(tbl) {return tbl.priority * -1})
    //console.log(tbls)
    assert.equal(sorted[0].tableName, 'T4')
    done()
  })

  it('Generate Ordered Table Script Test', function(done) {
    this.timeout(10000)
    createTableScript.generateOrderedTableScript(function(err, result) {
      if(err) return console.log(err)
      assert.equal(result[0].tableName, 'tblAccessionOrder')
      //console.log(result)
      done()
    })
  })
})
