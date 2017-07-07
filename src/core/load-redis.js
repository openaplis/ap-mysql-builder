'use strict'

const async = require('async')
const fs = require('fs')
const path = require('path')
var _ = require('lodash')
var camelCase = require('./camel-case')
var objectId = require('bson-objectid')
var redis = require('redis'),
 redisClient = redis.createClient()

redisClient.on("error", function (err) {
  return callback(err)
})

function matchFiles(dir, pattern) {
  var fileList = []

  function match(fileName){
    var stat = fs.lstatSync(fileName)
    if(stat.isDirectory()) {
      var files = fs.readdirSync(fileName)
      _.each(files, function(fileObj) {
        var fname = path.join(fileName, fileObj)
        match(fname)
      })
    }
    else {
      if(pattern.test(fileName)) {
        //console.log(fileName)
        fileList.push(fileName)
        }
      return(fileName)
    }
  }

  match(dir)
  return(fileList)
}

var self = module.exports = {

  loadRedisFromDataFiles: function(dir, pattern, callback) {
    redisClient.flushall()
    var fileList = matchFiles(dir, pattern)

    async.eachSeries(fileList, function(fileName, callback) {
      var shortName = path.basename(fileName, '.json')
      var idx = shortName.indexOf('-test-data')
      shortName = shortName.substring(0, idx)
      var data = null
      console.log(shortName)
      redisClient.rpush('files', shortName)

      async.series([

        function(callback) {
          fs.readFile(fileName, function(err, result) {
            if(err) return callback(err)
            data = JSON.parse(result)
            callback()
          })
        },

        function(callback) {
          async.eachSeries(data, function(obj, callback) {
            var key = objectId().toString()
            var objString = JSON.stringify(obj)
            console.log(objString)
            redisClient.hset('objectStrings', key, objString)
            redisClient.rpush(shortName, key)
            async.setImmediate(function(err) { callback() })
          }, function(err) {
            if(err) return callback(err)
            callback()
          })
        }
      ], function(err) {
          if(err) return callback(err)
          callback()
      })
    }, function(err) {
      if(err) return callback(err)
      callback(null, 'success')
    })
  },

  getValuesForKeys(keys, callback) {
    redisClient.hmget('objectStrings', keys,  function(err, result) {
      if(err) return callback(err)
      callback(null, result)
    })
  },

  getAllKeys: function(listName, callback) {
    redisClient.lrange(listName, 0, -1, function(err, result) {
      if(err) return callback(err)
      callback(null, result)
    })
  }
}
