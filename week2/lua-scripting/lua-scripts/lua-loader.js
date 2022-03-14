"use strict";

const { getClient } = require("../redis");

/**
 * Get the source code of the lua script
 * @param {string} name - is the name of the lua source file
 */
function getScript() {
  return `return redis.call('SET', KEYS[1], ARGV[1])`
}

/**
 * Load a lua script to the redis server
 * It's an expensive operation
 */
function updateLuaScript(client) {
  let sha;
  return async function load() {
    const source = getScript();
    if (!sha) {
      sha = await client.script('load', source)
    }
    return sha
  };
}


module.exports = Object.freeze({
  load: updateLuaScript(getClient()),
  getScript
});
