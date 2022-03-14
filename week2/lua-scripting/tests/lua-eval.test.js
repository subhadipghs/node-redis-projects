"use strict";

const tap = require("tap");
const { getClient } = require("../redis");
const updateLuaScript = require("../lua-scripts/lua-loader");

const client = getClient();

tap.before(() => client.connect());
tap.afterEach(() => client.scriptFlush("SYNC"));
tap.teardown(() => client.quit());

tap.test("Lua script with redis", (subtest) => {

  subtest.test("should run the lua script correctly", async expect => {
    const key = "lua-script:test", value = 'this-the-value';
    const script = updateLuaScript.getScript();
    const result = await client.sendCommand(['EVAL', script, 1, key, value])
    expect.equal(result, 'OK')
    const valueStored = await client.get(key)
    expect.equal(valueStored, value)
    expect.end()
  });

  subtest.end()
});
