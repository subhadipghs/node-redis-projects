'use strict'

const { loadDaoImpl } = require('./util')


// load the implementation module
const { siteDaoImpl } = loadDaoImpl('site')

function buildSiteDao(impl) {
  return {
    insert: async (r) => await impl.insert(r),
  }
}

const siteDao = buildSiteDao(siteDaoImpl)

module.exports = Object.freeze({
  siteDao
})
