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
  if (k == ok) {
    const reply = await client.get(key)
    await client.quit()
    console.log(reply)
    return reply
  }
  return null
}

client.on('ready', () => {
  console.log('client is ready')
})

client.on('end', () => {
  console.log('disconnected')
})

client.on('reconnecting', () => {
  console.log('oops! reconnecting...')
})

module.exports = {
  main
}
