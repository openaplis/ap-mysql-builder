'use strict'

var _ = require('lodash')
var camelCase = require('./camel-case')
var mysql = require('mysql')
const async = require('async')
const path = require('path')
const cmdSubmitter = require(path.join(__dirname, 'cmd-submitter'))
const fs = require('fs')

var dbName = process.env.AP_MYSQL_DATABASE
var server = process.env.AP_MYSQL_HOST
var usr = process.env.AP_MYSQL_USER
var pw = process.env.AP_MYSQL_PASS
var tables = null

var self = module.exports = {

  createDatabase: function(fileName, callback) {
    async.series([
      function(callback) {
        var con = mysql.createConnection({
          host: server,
          user: usr,
          password: pw,
          multipleStatements: true
        })

        con.connect(function(err) {
          if (err) throw err;
          var sql = ['Drop database if exists `' + dbName + '`;',
            'CREATE DATABASE ', dbName, ' DEFAULT CHARACTER SET = \'utf8mb4\' DEFAULT COLLATE = ',
            '\'utf8mb4_general_ci\';'].join('')
          con.query(sql, function (err, result) {
            if (err) return callback(err)
            callback()
          })
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
        var sql = 'use `' + dbName + '`; '
        _.each(tables, function(table) {
          sql = sql + table.sql + ';'
        })

        cmdSubmitter.submit(sql, function(err, result) {
          if(err) return callback(err)
          callback()
        })
      }
    ], function(err) {
        if(err) return callback(err)
        var tablesInFile = Object.keys(tables).length
        var sql = ['SELECT count(*) cnt FROM INFORMATION_SCHEMA.TABLES ',
        'where TABLE_SCHEMA = \'', dbName, '\';'].join('')

        cmdSubmitter.submit(sql, function(err, result) {
          if(err) return callback(err)
          var tablesInDb = result[0].cnt
          var diff = tablesInFile - tablesInDb
          callback( null, diff)
        })
    })
  }
}
