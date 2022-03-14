
"use strict"

const redis = require('redis2')
const bluebird = require('bluebird')

bluebird.promisifyAll(redis);

const client = redis.createClient({
  host: '0.0.0.0',
  port: 6379
})


module.exports = Object.freeze({
  getClient: () => client
})
