'use strict'

var _ = require('lodash')
var dockerNames = require('docker-names')
var Chance = require('chance')
var objectId = require('bson-objectid')
const path = require('path')
const fs = require('fs')

var self = module.exports = {

  runGenerator: function (generatorName, key, callback) {
    this[generatorName](key, callback)
  },

  dateGenerator: function (key, callback) {
    var chance = new Chance(key)
    var date = chance.date({ year: 2017})
    var result = formattedDateString(date)
    callback(null, result)
  },

  dateTimeGenerator: function (key, callback) {
    var chance = new Chance(key)
    var date = chance.date({ year: 2017})
    var result = formattedDateTimeString(date)
    callback(null, result)
  },

  birthdateGenerator: function (key, callback) {
    var chance = new Chance(key)
    var date = chance.birthday({ year: chance.year({ min: 1930, max: 2016 }) });
    var result = formattedDateString(date)
    callback(null, result)
  },

  firstNameGenerator: function(key, callback) {
    dockerNames.getRandomName()
    var result = dockerNames.getRandomName()
    callback(null, result)
  },

  lastNameGenerator: function(key, callback) {
    dockerNames.getRandomName()
    var result = dockerNames.getRandomName()
    callback(null, result)
  },

  characterGenerator: function(key, callback) {
    var chance = new Chance(key)
    var result = chance.character({alpha: true, casing: 'upper'})
    callback(null, result)
  },

  intIdGenerator: function(key, callback) {
    var chance = new Chance(key)
    var result = chance.integer({min: 1, max: 9999})
    callback(null, result)
  },

  mongoIdGenerator: function(key, callback) {
    var result = objectId().toString()
    callback(null, result)
  },

  genderGenerator: function(key, callback) {
    var chance = new Chance(key)
    var result = chance.gender().slice(0,1)
    callback(null, result)
  },

  ssnGenerator: function(key, callback) {
    var chance = new Chance(key)
    var result = chance.ssn()
    callback(null, result)
  },

  phoneGenerator: function(key, callback) {
    var chance = new Chance(key)
    var result = chance.phone({ formatted: false })
    callback(null, result)
  },

  addressGenerator: function(key, callback) {
    var chance = new Chance(key)
    var result = chance.address({short_suffix: true})
    callback(null, result)
  },

  cityGenerator: function(key, callback) {
    var chance = new Chance(key)
    var result = chance.city()
    callback(null, result)
  },

  stateGenerator: function(key, callback) {
    var chance = new Chance(key)
    var result = chance.state()
    callback(null, result)
  },

  zipGenerator: function(key, callback) {
    var chance = new Chance(key)
    var result = chance.zip()
    callback(null, result)
  },

  sentenceGenerator: function(key, callback) {
    var chance = new Chance(key)
    var result = chance.sentence({words: 5})
    callback(null, result)
  },

  paragraphGenerator: function(key, callback) {
    var chance = new Chance(key)
    var result = chance.paragraph()
    callback(null, result)
  },

  trueIntGenerator: function(key, callback) {
    callback(null, 1)
  },

  falseIntGenerator: function(key, callback) {
    callback(null, 0)
  },

  clientNameGenerator: function(key, callback) {
    var chance = new Chance(key)
    var result = chance.pickone(['Big Hospital', 'Hospital Affiliate 1', 'Hospital Affiliate 2', 'Dr. Zorba Office'])
    callback(null, result)
  },

  clientIdGenerator: function(key, callback) {
    var chance = new Chance(key)
    var result = chance.pickone(['123', '124', '125', '234'])
    callback(null, result)
  },

  providerNameGenerator: function(key, callback) {
    var chance = new Chance(key)
    var result = chance.pickone(['able_domb jisk_frand', 'whik_olan moke_tulb', 'ploc_zerk chis_trag', 'frih_frum solp_dajl'])
    callback(null, result)
  },

  providerIdGenerator: function(key, callback) {
    var chance = new Chance(key)
    var result = chance.pickone(['321', '322', '323', '324'])
    callback(null, result)
  }
}

function formattedDateString(date) {
  var dd = date.getDate()
  var mm = date.getMonth() + 1
  var yyyy = date.getFullYear()

  if(dd < 10) { dd = '0' + dd }
  if(mm < 10) { mm = '0'+mm }

  var today = yyyy + '-' + mm + '-' + dd
  return today
}

function formattedDateTimeString(dateTime) {
  var dt = formattedDateString(dateTime)
  var hh = dateTime.getHours()
  var mi = dateTime.getMinutes()
  var ss = dateTime.getSeconds()

  if(mi < 10) { mi = '0' + mi }
  if(ss < 10) { ss = '0' + ss }

  dt = dt + ' ' + hh + ':' + mi + ':' + ss
  return dt
}
