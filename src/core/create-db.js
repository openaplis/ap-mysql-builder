'use strict'

var _ = require('lodash')
var mysql = require('mysql')
const async = require('async')
const path = require('path')
const fs = require('fs')

var dbName = 'test_mysql'
var tables = null

const grpc = require('grpc')
const PROTO_PATH = path.join(__dirname, '../../node_modules/ap-protobuf/src/core/gateway.proto')
const gateway_proto = grpc.load(PROTO_PATH).gateway
const mysqlGateway = new gateway_proto.MySQLGateway(process.env.AP_GATEWAY_SERVICE_BINDING, grpc.credentials.createInsecure())

var self = module.exports = {

  createDatabase: function(fileName, callback) {
    async.series([
      function(callback) {
        var stmt = ['Drop database if exists `' + dbName + '`; ',
          'CREATE DATABASE ', dbName, ' DEFAULT CHARACTER SET = \'utf8mb4\' DEFAULT COLLATE = ',
          '\'utf8mb4_general_ci\';'].join('')
        var cmdSubmitterRequest = { sql: stmt }

        mysqlGateway.submitCmd(cmdSubmitterRequest, function (err, result) {
          if(err) return callback(err)
          callback()
        })
      },

      function(callback) {
        fs.readFile(fileName, function(err, result) {
          if(err) return callback(err)
          tables = JSON.parse(result)
          callback()
        })
      },

      function(callback) {
        var stmt = 'use `' + dbName + '`; '
        _.each(tables, function(table) {
          stmt = stmt + table.sql + '; '
        })

        var cmdSubmitterRequest = { sql: stmt }

        mysqlGateway.submitCmd(cmdSubmitterRequest, function (err, result) {
          if(err) return callback(err)
          callback()
        })
      }
    ], function(err) {
        if(err) return callback(err)
        var tablesInFile = Object.keys(tables).length
        var stmt = ['SELECT count(*) cnt FROM INFORMATION_SCHEMA.TABLES ',
        'where TABLE_SCHEMA = \'', dbName, '\';'].join('')

        var cmdSubmitterRequest = { sql: stmt }

        mysqlGateway.submitCmd(cmdSubmitterRequest, function (err, result) {
          if(err) return callback(err)
          var tablesInDb = result[0].cnt
          var diff = tablesInFile - tablesInDb
          callback( null, diff)
        })
    })
  }
}
