'use strict'

var _ = require('lodash')
const async = require('async')
const path = require('path')
const fs = require('fs')

const grpc = require('grpc')
const PROTO_PATH = path.join(__dirname, '../../node_modules/ap-protobuf/src/core/gateway.proto')
const gateway_proto = grpc.load(PROTO_PATH).gateway
const mysqlGateway = new gateway_proto.MySQLGateway(process.env.AP_GATEWAY_SERVICE_BINDING, grpc.credentials.createInsecure())

var self = module.exports = {
  generateOrderedTableScript: function(callback) {
    self.getTableList(function(err, tableData) {
      if(err) return callback(err)
      async.eachSeries(tableData, function(table, callback) {
        self.getCreateTableStatement(table['tableName'], function(err, stmtResult) {
          if(err) return callback(err)
          table.sql = stmtResult[0]['create Table']
          self.getForeignKeyConstraintTables(table['tableName'], function(err, constraintResult) {
            if(err) return callback(err)
            table.referenceTables = constraintResult
            callback()
          })
        })
      }, function(err) {
          if(err) return callback(err)
          self.setPriority(tableData)
          tableData = _.sortBy(tableData, function(tbl) {return tbl.priority * -1})
          callback(null, tableData)
      })
    })
  },

  getTableList: function(callback) {
    var cmdSubmitterRequest = {
      sql: ['SELECT TABLE_NAME tableName from INFORMATION_SCHEMA.TABLES ',
      'where TABLE_SCHEMA = \'lis\' and TABLE_NAME like \'tbl%\';'].join('\n')
    }

    mysqlGateway.submitCmd(cmdSubmitterRequest, function (err, result) {
      if(err) return callback(err)
      var data = result.json
      var rows = JSON.parse(data)
      callback(null, rows)
    })
  },

  getCreateTableStatement: function(tableName, callback) {
    var cmdSubmitterRequest = { sql: 'show create table ' + tableName + ';' }

    mysqlGateway.submitCmd(cmdSubmitterRequest, function (err, result) {
      if(err) return callback(err)
      var data = result.json
      var rows = JSON.parse(data)
      callback(null, rows)
    })
  },

  getForeignKeyConstraintTables: function(tableName, callback) {
    var cmdSubmitterRequest = {
      sql: ['SELECT REFERENCED_TABLE_NAME tableName from INFORMATION_SCHEMA.KEY_COLUMN_USAGE',
        ' where TABLE_SCHEMA = \'lis\' and CONSTRAINT_NAME like \'fk%\'',
        'and TABLE_NAME = \'', tableName, '\';'].join('')
    }

    mysqlGateway.submitCmd(cmdSubmitterRequest, function (err, result) {
      if(err) return callback(err)
      var data = result.json
      var rows = JSON.parse(data)
      callback(null, rows)
    })
  },

  setPriority: function(tableData) {
    function setTablePriority(table){
      if(table.hasOwnProperty('priority')) {
        table.priority = table.priority + 1
      }
      else {table.priority = 1}

      if(table.referenceTables !== null) {
        _.each(table.referenceTables, function(refTable) {
          var needTable = _.find(tableData, function(obj) {return obj.tableName == refTable.tableName})
          setTablePriority(needTable)
        })
      }
    }

    _.each(tableData, function(table) {setTablePriority(table)})
  }
}
