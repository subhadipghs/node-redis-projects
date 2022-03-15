
"use strict"
const tap = require('tap')
const redis = require('../index')

const client = redis.getClient()


tap.before(() => client.connect())
tap.afterEach(() => client.flushDb("SYNC"))
tap.teardown(() => client.quit())


tap.test('redis transaction', test => {
  test.test('should execute the transaction well', async assert => {
    const tx = redis.buildRedisTx(client);
    const result = await tx() 
    assert.equal(result.length, 2) // as two commands ran
    assert.equal(result[0], 'OK');
    assert.equal(result[1], 3)
    assert.end()
  })
  test.end()
})
