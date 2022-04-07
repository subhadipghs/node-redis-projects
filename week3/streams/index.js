const tap = require("tap");
const redis = require("./redis");

const client = redis.getClient();

tap.before(() => client.connect());
tap.afterEach(() => client.flushDb("SYNC"));
tap.teardown(() => client.quit());

tap.test("redis streams", (test) => {
  test.test("should add an entry to the stream", async (assert) => {
    try {
      const key = "test:stream:2";
      const entry = ["id", 1, "email", "test@gmail.com"];
      await client.xAdd(key, "*", "MAXLEN", "~", 2, ...entry);
      const len = await client.xLen(key);
      assert.equal(len, 1);
    } catch (e) {
      console.error(e);
      assert.fail("should add an entry to the stream");
    } finally {
      assert.end();
    }
  });
  test.test("should retrieve the stream entries using xrange from oldest to newest", async (assert) => {
    const key = "test:stream:3";
    const entry = [
      {"id": 2, "email": "test2@mail.com"},
      {"id": 1, "email": "test2@mail.com"},
    ];
    for (let i = 0; i < entry.length; i++) {
      await client.xAdd(key, "*", entry[i]);
    }
    const len = await client.xLen(key);
    assert.equal(len, entry.length);
    const results = await client.xRange(key, "-", "+");
    results.forEach((result, i) => {
      assert.ok(result.id)
      assert.equal(result.message.id, entry[i].id.toString())
      assert.equal(result.message.email, entry[i].email)
    })
    assert.end();
  });
  test.end();
});
