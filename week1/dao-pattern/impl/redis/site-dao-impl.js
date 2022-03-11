"use strict";

const { Id } = require("../../id");
const { getClient } = require("../../redis");


// Make the hash key for storing the site information
function getSiteKey({ id } = {}) {
  return `site:info:${id}`;
}

// Get the key where we store all the ids of site
function getSiteIdsKey() {
  return "site:ids";
}

function buildSiteDaoImpl({ client, Id } = { Id }) {
   return {
    insert: async (r) => {
      const nId = Id.makeId();
      const key = getSiteKey({ id: nId });
      await Promise.all([
        client.hSet(key, {
          ...r,
          id: nId,
        }),
        client.sAdd(getSiteIdsKey(), key),
      ]);
      return {
        ok: true,
        key,
      };
    },
  };
}
   // Make the hash key for storing the site information
const siteDaoImpl = buildSiteDaoImpl({ client: getClient(), Id });

module.exports = Object.freeze({
  siteDaoImpl,
  buildSiteDaoImpl,
  getSiteKey,
  getSiteIdsKey
});
