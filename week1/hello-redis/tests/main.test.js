'use strict'

const t = require('tap')
const { main } = require('../main')

const suite = 'main'

t.test(`${suite}: should return ok`, async t => {
  const rep = await main('hello', 'redis')
  t.equal(rep, 'redis', 'expected reply to be ok')
  t.end()
})