"use strict";

const tap = require("tap");
const sinon = require("sinon");
const { getClient } = require("../redis");
const {
  buildSiteDaoImpl,
  getSiteKey,
  getSiteIdsKey,
} = require("../impl/redis/site-dao-impl");


const Id = {
  makeId: () => 1, 
  isValidId: () => true,
};

const client = getClient();
const dao = buildSiteDaoImpl({ client, Id });

tap.before(() => {
  return client.connect();
});

tap.afterEach(() => {
  return client.flushDb('SYNC')
})

tap.teardown(() => {
  return client.quit();
});

tap.test("Site Dao Implementation", (t) => {

  t.test("should call hSet and sAdd with correct parameters", async (t) => {
    const hashSetSpy = sinon.spy(client, "hSet");
    const setAddSpy = sinon.spy(client, "sAdd");
    const key = getSiteKey({ id: Id.makeId() })
    const obj = {
      name: "CA",
      lat: 23,
      long: 82,
    };
    await dao.insert(obj);
    t.equal(hashSetSpy.called, true, "should call the hashset function 1 time");
    hashSetSpy.calledWith(key, {
      ...obj,
      id: Id.makeId()
    });
    t.equal(setAddSpy.called, true, "should call the set add function 1 time");
    setAddSpy.calledWith(getSiteIdsKey(), key);
    t.end();
  });

  t.test('should correctly insert a site into the redis', async t => {
    const obj = {
      name: 'one',
      lat: 42,
      lng: 83
    }
    const rep = await dao.insert(obj)
    t.ok(rep.ok)
    t.ok(rep.id)
    t.equal(rep.ok, true)
    t.equal(rep.id, 1)
    t.end()
  })

  t.test("should find a site information by id correctly", async t => {
    const site = {
      name: 'oops',
      lat: 24,
      long: 32
    }
    await dao.insert(site)
    const rep = await dao.findById(1)
    t.same(rep, { ...site, id: Id.makeId() })
    t.end()
  })

  t.test("should return null if the site does not exist", async t => {
    const rep = await dao.findById('randomId')
    t.notOk(rep)
    t.end()
  })

  t.end();
});
