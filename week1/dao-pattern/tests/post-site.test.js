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

tap.teardown(() => {
  return Promise.all([client.flushDb("SYNC"), client.quit()]);
});

tap.test("Site Dao Implementation", (t) => {
  t.test("should call hSet and sAdd with correct parameters", async (t) => {
    const hashSetSpy = sinon.spy(client, "hSet");
    const setAddSpy = sinon.spy(client, "sAdd");
    const key = getSiteKey({ id: 1 });
    const obj = {
      name: "CA",
      lat: 23,
      long: 82,
    };
    await dao.insert(obj);
    t.equal(hashSetSpy.called, true, "should call the hashset function 1 time");
    hashSetSpy.calledWith(key, {
      ...obj,
      id: 1,
    });
    t.equal(setAddSpy.called, true, "should call the set add function 1 time");
    setAddSpy.calledWith(getSiteIdsKey(), key);
    t.end();
  });

  t.end();
});
