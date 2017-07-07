'use strict'

const createDb = require('./src/core/create-db')
const createTableScript = require('./src/core/create-table-script')
const loadDbFromRedis = require('./src/core/load-db-from-redis')
const loadRedis = require('./src/core/load-redis')

exports = module.exports = {
  createDb: createDb,
  createTableScript: createTableScript,
  loadDbFromRedis: loadDbFromRedis,
  loadRedis: loadRedis
}
