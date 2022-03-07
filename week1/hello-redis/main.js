'use strict'

const redis = require('redis')

const client = redis.createClient({
  host: '0.0.0.0',
  port: 6379
})


async function main(key = 'hello', value = 'redis') {
  const ok = 'OK'
  await client.connect()
  const k = await client.set(key, value)
  console.log(k)
  if (k == ok) {
    const reply = await client.get(key)
    await client.quit()
    return reply
  }
  return null
}


module.exports = {
  main
}