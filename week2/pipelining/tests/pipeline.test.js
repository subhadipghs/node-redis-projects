"use strict"


const tap = require("tap");
const { buildPipeline } = require("..");
const { getClient } = require('../redis');

const client = getClient();
const pipelineCmd = buildPipeline(client);

tap.afterEach(async () => {
  const keys = await client.keysAsync('*')
  if (keys.length > 0) {
    await client.delAsync(keys)
  }
})

tap.teardown(() => client.quit());

tap.test("Redis pipeline", (test) => {
  test.test("should give correct pipeline responses", async (assert) => {
    const resp = await pipelineCmd("test2");
    assert.equal(resp.length, 2, 'response should have 2 responses')
    assert.equal(resp[0], 1)
    assert.equal(resp[1], 3)
    assert.end()
  });
  test.end()
});
