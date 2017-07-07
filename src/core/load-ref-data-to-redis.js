'use strict'

const async = require('async')
//const fs = require('fs')
const path = require('path')
var _ = require('lodash')
//var camelCase = require('ap-mysql').camel-case
var objectId = require('bson-objectid')

const grpc = require('grpc')
const PROTO_PATH = path.join(__dirname, '../../node_modules/ap-protobuf/src/core/gateway.proto')
const gateway_proto = grpc.load(PROTO_PATH).gateway
const mysqlGateway = new gateway_proto.MySQLGateway(process.env.AP_GATEWAY_SERVICE_BINDING, grpc.credentials.createInsecure())

var redis = require('redis'),
 redisClient = redis.createClient()

redisClient.on("error", function (err) {
  return callback(err)
})

var referenceTables = require('./reference-tables')

var self = module.exports = {

  loadData: function(callback) {
    redisClient.flushall()
    _.each(referenceTables.tables, function(table) {
      redisClient.rpush('tables', table)
      var cmd = 'select * from ' + table + ';'
      console.log(cmd)
      var request = {sql: cmd}
      mysqlGateway.submitCmd(request, function(err, results) {
        if(err) return callback(err)
        _.each(results, function(row) {
          var key = objectId().toString()
          var dataString = JSON.stringify(row)
          redisClient.rpush(table, key)
          redisClient.hset('tableData', key, dataString)
        })
      })
    })
    callback(null, 'success')
  }
}
