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
    /**
     * Insert a site information inside redis hash
     */
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
        id: nId,
      };
    },
    /**
     * Find a site information by the site id
     */
    findById: async (id) => {
      const key = getSiteKey({ id })
      const rep = await client.hGetAll(key)
      if (Object.keys(rep).length <= 0) {
        return null
      } 
      return rep
    }
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
