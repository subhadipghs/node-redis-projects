
"use strict"

const redis = require('redis')

const client = redis.createClient({
  host: '0.0.0.0',
  port: 6379
})

function buildRedisTx(client) {
  return async function() {
    const tx = client.multi()
    tx.set('key', 1)
    tx.incrBy('key', 2)
    const result = await tx.exec()
    return result
  }
}

const redisTx = buildRedisTx(client)

module.exports = Object.freeze({
  getClient: () => client,
  buildRedisTx,
  redisTx
})
