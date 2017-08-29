'use strict'

var _ = require('lodash')
const async = require('async')
const path = require('path')
const fs = require('fs')

var cmdSubmitter = require('ap-mysql').cmdSubmitter
var createTableScript = require(path.resolve(__dirname, './create-table-script'))

var self = module.exports = {

  createDatabase: function(databaseNames, callback) {
    var tables = []
    async.series([

      function(callback) {
        createTableScript.generateOrderedTableScript(function(err, rows) {
          if(err) callback(err)
          tables = rows
          callback()
        })
      },

      function(callback) {
        _.each(databaseNames, function(dbName) {
          var createStmt = ['Drop database if exists `' + dbName + '`; ',
            'CREATE DATABASE ', dbName, ' DEFAULT CHARACTER SET = \'utf8mb4\' DEFAULT COLLATE = ',
            '\'utf8mb4_general_ci\';'].join('')

          cmdSubmitter.submit(createStmt, function (err, result) {
            if(err) return callback(err)
            var stmt = 'use `' + dbName + '`; '
            _.each(tables, function(table) {
              stmt = stmt + table.sql + '; '
            })

            cmdSubmitter.submit(stmt, function (err, result) {
              if(err) return callback(err)
              var tablesInFile = Object.keys(tables).length
              var checkStmt = ['USE ', dbName, '; ', 'SELECT count(*) cnt FROM INFORMATION_SCHEMA.TABLES ',
              'where TABLE_SCHEMA = \'', dbName, '\';'].join('')

              cmdSubmitter.submit(checkStmt, function (err, result) {
                if(err) return callback(err)
                var tablesInDb = result[1].cnt
                var diff = tablesInFile - tablesInDb
                if(diff != 0) return callback('Tables in file = ' + tablesInFile + ' Tables in ' + dbName + ' = ' + tablesInDb)
                callback()
              })
            })
          })
        })
      }

    ], function(err) {
        if(err) return callback(err)
        callback( null, 'Success')
    })
  }
}
