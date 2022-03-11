'use strict'

const e = require('express')
const { connect, getClient } = require('./redis')
const { api } = require('./api')


const main = async () => {
  try {
    await getClient().connect()
    api.listen(2000, () => {
      console.log('Api..')
    })
  } catch(e) {
    console.error(e)
  }
}

main()
