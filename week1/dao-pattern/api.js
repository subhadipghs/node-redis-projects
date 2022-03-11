"use strict"

const e = require("express")
const morgan = require("morgan")
const { siteDao } = require('./site-dao')


function buildSiteApi(siteDao, app) {
  app.use(e.json())
  app.use(morgan("short"))
  /**
   * POST /sites
   */
  app.post("/sites", async (req, res) => {
    const data = req.body
    const r = await siteDao.insert(data)
    return res.json(r)
  })

  return app
}

const siteApi = buildSiteApi(siteDao, e())

module.exports = Object.freeze({
  api: siteApi,
})
