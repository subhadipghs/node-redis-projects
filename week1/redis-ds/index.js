"use strict"

const redis = require("redis")
const assert = require('assert')

let client = redis.createClient({
  host: "0.0.0.0",
  port: 6379,
})

async function setup() {
  await client.connect()
  await client.flushDb('SYNC')
  return true
}

async function hash() {
  let hk = "user:john"
  const hv = { name: 'john', age: 23 }

  // setting a hash field
  const l = await client.hSet(hk, hv)
  assert.equal(l, 2, 'inserted fields should be 2')
 
  // for getting all the fields of the hash key
  const values = await client.hGetAll(hk)
  assert.deepEqual(values, hv)
  assert.equal(typeof values, 'object', 'hash should return object')

  // for getting one field
  const name =  await client.hGet(hk, 'name')
  assert.equal(name, hv.name)

  console.log('OK:', hash.name)
  await client.flushAll()
}

async function lists() {
  // for lists rpush
  const k = 'lists-test'
  const words = ['one', 'two', 'three', 'three', 'four', 'five']
  
  // set a list
  const c = await client.rPush(k, words)
  assert.equal(c, words.length)
  
  // length of the list
  const rc = await client.lLen(k)
  assert.equal(rc, words.length)

  // get the values through range
  const v = await client.lRange(k, 0, -1)
  assert.equal(v.length, words.length)
  console.dir(v)
  
  // pop the last element
  const popped = await client.rPop(k)
  assert.equal(popped, 'five') 

  // remove known duplicates
  const removed = await client.lRem(k, 1, 'three')
  // removed 1 
  assert.equal(removed, 1)
  const lengthAfterRemoving = await client.lLen(k)
  assert.equal(lengthAfterRemoving, 4)

  console.log('OK:', lists.name)
  await client.flushAll()
}


async function float() {
  let k = 'pi2'
  const l = await client.set(k, 3.14)
  assert.equal(l, 'OK', 'set should return ok')
  const v = await client.get(k)
  assert.equal(v, '3.14', 'should return 3.13')
  const ack = await client.incrByFloat(k, 1)
  assert.equal(ack, '4.14', 'float value should match')
  console.log('OK:', float.name)
  await client.flushAll()
}

async function set() {
  let k = 'numbers'
  let nums = [1, 2, 33, 2, 4, 4, 34]
  const noDups = new Set(nums)
  // add elements
  const l = await client.sAdd(k, nums)
  // check the cardinality
  assert.equal(l, noDups.size)
  const cardn = await client.sCard(k)
  assert.equal(cardn, noDups.size)

  // get the elements
  const elems = await client.sMembers(k)
  // check whether all the elements resides in the set
  console.dir(elems)
  for (let e = 0; e < e.length; e++) {
    assert.ok(noDups.has(elems[e]))
  }

  // remove one element and check the cardinality
  const rm = await client.sRem(k, 33)
  assert.equal(rm, 1)
  const [cardn2, mem2] = await Promise.all([
    client.sCard(k),
    client.sMembers(k)
  ])
  assert.equal(cardn2, noDups.size - 1)
  assert.equal(new Set(mem2).has(33), false)
  await client.flushAll()
  console.log('OK:', set.name)
}


function main() {
  setup().then(() => {
    set().then(() => {
      client.quit() 
    }) // for list data structure
  })
}

main()
