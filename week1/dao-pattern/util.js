'use strict'

/**
 * Load the dao implementation module
 * @param {string} name - is the name of the dao to load
 */
function loadDaoImpl(name) {
  return require(`./impl/redis/${name}-dao-impl`)
}

module.exports = Object.freeze({
  loadDaoImpl
})
