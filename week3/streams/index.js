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
      await client.xAdd(key, '*', "MAXLEN", "~", 2, ...entry);
      const len = await client.xLen(key);
      assert.equal(len, 1);
    } catch (e) {
      console.error(e);
      assert.fail('should add an entry to the stream')
    } finally {
      assert.end();
    }
  });
  test.end();
});
