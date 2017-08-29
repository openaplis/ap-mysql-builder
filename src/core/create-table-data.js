'use strict'

const path = require('path')
const async = require('async')
var fs = require('fs')
var dataGenerator = require(path.join(__dirname, './data-generator'))

const grpc = require('grpc')
const PROTO_PATH = path.join(__dirname, '../../node_modules/ap-protobuf/src/core/gateway.proto')
const gateway_proto = grpc.load(PROTO_PATH).gateway
const mysqlGateway = new gateway_proto.MySQLGateway(process.env.AP_GATEWAY_SERVICE_BINDING, grpc.credentials.createInsecure())

var self = module.exports = {

  run: function(tableName, ids, callback) {
    acquireTableMetaData(tableName, function (err, metaDataRows) {
      if(err) return callback(err)
      var dataObjs = []
      async.each(ids, function(id, callback) {
        createData(metaDataRows, id, function(err, dataObj) {
          if(err) return callback(err)
          dataObjs.push(dataObj)
          callback()
        })
        }, function(err) {
          if(err) return callback(err)
          callback(null, dataObjs)
      })
    })
  },

  generateMasterAccessionNo: function(howMany, callback) {
    var ids = []
    var today = new Date()
    var yr = today.getFullYear()
    var prefix = '' + yr
    prefix = prefix.slice(2, 4) + '-'
    var limit = 1
    async.whilst( function() { return limit <= howMany },
      function(callback) {
          var id = prefix + limit
          ids.push(id)
          limit = limit + 1
          callback()
      }, function(err) {
        if(err) return callback(err)
        callback(null, ids)
    })
  },

  generateIntIds: function(startWith, howMany, callback) {
    var ids = []
    var limit = 0
    async.whilst( function() { return limit < howMany },
      function(callback) {
          var id = limit + startWith
          ids.push(id)
          limit = limit + 1
          callback()
      }, function(err) {
        if(err) return callback(err)
        callback(null, ids)
    })
  }
}

function createData(columnsMetaData, key, callback) {
  var dataObject = {}
  async.each(columnsMetaData, function(data, callback) {
    var columnName = data.column_name
    var metadata = data.column_comment
    var columnDefault = data.column_default
    var isPrimary = data.IsPrimary
    if(data.is_primary == 1) columnDefault = key
    else if(data.column_comment != '') {
      var gen = JSON.parse(data.column_comment)
      var generator = gen.metadata.generator
      dataGenerator.runGenerator(generator, key, function(err, result) {
        if(err) return callback(err)
        columnDefault = result
      })
    }
    dataObject[columnName] = columnDefault
    callback()
  }, function(err) {
    if(err) return callback(err)
    callback(null, dataObject)
  })
}

function acquireTableMetaData(tableName, callback) {
  var cmdSubmitterRequest = {
    sql: ['SELECT c.column_name, c.column_comment, c.column_default, ',
      'case when c.column_name = u.column_name and u.constraint_name = \'PRIMARY\' then 1 ',
      'else 0 end is_primary FROM information_schema.columns c join information_schema.key_column_usage u ',
      'On c.table_schema = u.table_schema and c.table_name = u.table_name WHERE c.table_schema = \'lis\' ',
      'and c.table_name = \'' + tableName + '\'and c.column_name <> \'Timestamp\' ',
      'order by c.ordinal_position;'].join('')
  }

  mysqlGateway.submitCmd(cmdSubmitterRequest, function (err, result) {
    if(err) return callback(err)
    var data = result.json
    var rows = JSON.parse(data)
    callback(null, rows)
  })
}
