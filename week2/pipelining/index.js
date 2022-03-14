"use strict";

const redis = require("./redis");

function buildPipeline(client) {
  return async function setAndIncrement(key) {
    const pipeline = client.batch();

    pipeline.hset(key, "one", 1);
    pipeline.hincrby(key, "one", 2);

    const resp = await pipeline.execAsync();
    return resp;
  };
}

module.exports = Object.freeze({
  pipelineCmd: buildPipeline(redis.getClient()),
  buildPipeline
});
