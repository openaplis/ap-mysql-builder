'use strict'

const path = require('path')
const async = require('async')
var assert = require('chai').assert
var fs = require('fs')
var dataGenerator = require(path.resolve('./src/core/data-generator'))

describe('Data Generatior Tests', function() {
  var key = '17-1'

  it('date Generator Test', function(done) {
    dataGenerator.runGenerator('dateGenerator', key, function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  }),

  it('dateTime Generator Test', function(done) {
    dataGenerator.runGenerator('dateTimeGenerator', key, function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  }),

  it('birthdate Generator Test', function(done) {
    dataGenerator.runGenerator('birthdateGenerator', key, function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  })

  it('firstName Generator Test', function(done) {
    dataGenerator.runGenerator('firstNameGenerator', key, function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  })

  it('lastName Generator Test', function(done) {
    dataGenerator.runGenerator('lastNameGenerator', key, function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  })

  it('character Generator Test', function(done) {
    dataGenerator.runGenerator('characterGenerator', key, function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  })

  it('intId Generator Test', function(done) {
    dataGenerator.runGenerator('intIdGenerator', key, function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  })

  it('mongoId Generator Test', function(done) {
    dataGenerator.runGenerator('mongoIdGenerator', key, function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  })

  it('gender Generator Test', function(done) {
    dataGenerator.runGenerator('genderGenerator', key, function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  })

  it('ssn Generator Test', function(done) {
    dataGenerator.runGenerator('ssnGenerator', key, function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  })

  it('phone Generator Test', function(done) {
    dataGenerator.runGenerator('phoneGenerator', key, function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  })

  it('address Generator Test', function(done) {
    dataGenerator.runGenerator('addressGenerator', key, function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  })

  it('city Generator Test', function(done) {
    dataGenerator.runGenerator('cityGenerator', key, function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  })

  it('state Generator Test', function(done) {
    dataGenerator.runGenerator('stateGenerator', key, function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  })

  it('zip Generator Test', function(done) {
    dataGenerator.runGenerator('zipGenerator', key, function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  })

  it('sentence Generator Test', function(done) {
    dataGenerator.runGenerator('sentenceGenerator', key, function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  })

  it('paragraph Generator Test', function(done) {
    dataGenerator.runGenerator('paragraphGenerator', key, function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  })

  it('trueInt Generator Test', function(done) {
    dataGenerator.runGenerator('trueIntGenerator', key, function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  })

  it('falseInt Generator Test', function(done) {
    dataGenerator.runGenerator('falseIntGenerator', key, function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  })

  it('clientName Generator Test', function(done) {
    dataGenerator.runGenerator('clientNameGenerator', key, function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  })

  it('clientId Generator Test', function(done) {
    dataGenerator.runGenerator('clientIdGenerator', key, function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  })

  it('providerName Generator Test', function(done) {
    dataGenerator.runGenerator('providerNameGenerator', key, function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  })

  it('providerId Generator Test', function(done) {
    dataGenerator.runGenerator('providerIdGenerator', key, function(err, result) {
      if(err) return console.log(err)
      console.log(result)
      assert.isNotNull(result)
      done()
    })
  })
})
