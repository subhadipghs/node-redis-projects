"use strict"

const redis = require('redis')

const client = redis.createClient({
  host: '0.0.0.0',
  port: 6379
})

module.exports = Object.freeze({
  getClient: () => client
})

