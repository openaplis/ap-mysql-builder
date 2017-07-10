'use strict'

const cmdSubmitter = require('./cmd-submitter')
const insertCmdBuilder = require('./insert-cmd-builder')
const clientHelper = require('ap-object').clientHelper
const redis = require('./load-redis')
const async = require('async')
const clone = require('clone')

var self = module.exports = {
  //read redis data by value
  // each obj in array
  // - create ojb,
  // - clone,
  // - fill clone,
  // - submit to bd
  loadObjects: function(objectName, callback) {
    var keys = []
    var objData = []

    async.series([

      function(callback) {
        redis.getAllKeys('client', function(err, result) {
          if(err) return callback(err)
          keys = result
          callback()
        })
      },

      function(callback) {
        redis.getValuesForKeys(keys, function(err, result) {
          if(err) return callback(err)
          objData = result
          callback()
        })
      },

      function(callback) {
        async.eachSeries(objData, function(obj, callback) {
          var input = JSON.parse(obj)
          var client = clientHelper.createBlankClient()
          var clientClone = clone(client)
          insertCmdBuilder.build(client, clientClone, function (err, statements) {
            if(err) return callback(err)
            console.log(statements)
            callback()
          })
        }, function(err) {
          if(err) return callback(err)
          callback()
        })
      }
    ], function(err) {
      if(err) return callback(err)
      callback(null, objData)
    })
  }
}
