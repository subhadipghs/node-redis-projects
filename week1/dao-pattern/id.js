'use strict'

const cuid = require('cuid')

const Id = {
  makeId: () => cuid(),
  isValidId: (id) => cuid.isCuid(id) 
}

module.exports = Object.freeze({
  Id
})
