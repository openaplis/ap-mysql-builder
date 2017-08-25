'use strict'

var _ = require('lodash')
const async = require('async')
const path = require('path')
const fs = require('fs')

const grpc = require('grpc')
const PROTO_PATH = path.join(__dirname, '../../node_modules/ap-protobuf/src/core/gateway.proto')
const gateway_proto = grpc.load(PROTO_PATH).gateway
const mysqlGateway = new gateway_proto.MySQLGateway(process.env.AP_GATEWAY_SERVICE_BINDING, grpc.credentials.createInsecure())

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

  getCreateTableStatement: function(tableName, callback) {
    var cmdSubmitterRequest = { sql: 'show create table ' + tableName + ';' }

    mysqlGateway.submitCmd(cmdSubmitterRequest, function (err, result) {
      if(err) return callback(err)
      var data = result.json
      var rows = JSON.parse(data)
      callback(null, rows)
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
            table.sql = result[0]['create Table']
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
