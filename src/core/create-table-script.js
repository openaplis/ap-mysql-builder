'use strict'

var _ = require('lodash')
var camelCase = require('./camel-case')
const async = require('async')
const path = require('path')
const cmdSubmitter = require(path.join(__dirname, 'cmd-submitter'))
const fs = require('fs')

var script = ''
var data = null

function setPriority() {

  function setTablePriority(table){
    if(table.hasOwnProperty('priority')) {
      table.priority = table.priority + 1
    }
    else {table.priority = 1}
    
    if(table.referenceTables !== null) {
      _.each(table.referenceTables, function(refTable) {
        var needTable = _.find(data, function(obj) {return obj.tableName == refTable.tableName})
        setTablePriority(needTable)
      })
    }
  }

  _.each(data, function(table) {setTablePriority(table)})
}

var self = module.exports = {
  getTableList: function(callback) {
    var sql = ['SELECT TABLE_NAME tableName from INFORMATION_SCHEMA.TABLES ',
      'where TABLE_SCHEMA = \'lis\' and TABLE_NAME like \'tbl%\';'].join('\n')

    cmdSubmitter.submit(sql, function(err, result) {
      if(err) return callback(err)
      callback(null, result)
    })
  },

  getForeignKeyConstraintTables: function(tableName, callback) {
    var sql = ['SELECT REFERENCED_TABLE_NAME tableName from INFORMATION_SCHEMA.KEY_COLUMN_USAGE',
      ' where TABLE_SCHEMA = \'lis\' and CONSTRAINT_NAME like \'fk%\'',
      'and TABLE_NAME = \'', tableName, '\';'].join('')

    cmdSubmitter.submit(sql, function(err, result) {
      if(err) return callback(err)
      callback(null, result)
    })
  },

  getCreateTableStatement: function(tableName, callback) {
    var sql = 'show create table ' + tableName + ';'
    cmdSubmitter.submit(sql, function(err, result) {
      if(err) return callback(err)
      callback(null, result)
    })
  },

  generateOrderedTableFile: function(filename, callback) {
    async.series([

      function(callback) {
        self.getTableList(function(err, result) {
          if(err) return callback(err)
          data = result
          callback()
        })
      },

      function(callback) {
        async.eachSeries(data, function(table, callback) {
          self.getCreateTableStatement(table['tableName'], function(err, result) {
            if(err) return callback(err)
            table.sql = result[0]['Create Table']
            callback()
          })
        }, function(err) {
            if(err) return callback(err)
            callback()
        })
      },

      function(callback) {
        async.eachSeries(data, function(table, callback) {
          self.getForeignKeyConstraintTables(table['tableName'], function(err, result) {
            if(err) return callback(err)
            table.referenceTables = result
            //console.log(table)
            callback()
          })
        }, function(err) {
             if(err) return callback(err)
             callback()
        })
      },

      function(callback) {
        setPriority()
        data = _.sortBy(data, function(tbl) {return tbl.priority * -1})
        //console.log(data)
        var output = JSON.stringify(data)
        fs.writeFile(filename, output, function(err, result) {
          if(err) return callback(err)
          callback()
        })
      }
    ], function(err) {
        if(err) return callback(err)
        callback(null, data)
    })
  }
}
