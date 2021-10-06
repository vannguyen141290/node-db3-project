const db = require('../../data/db-config')

const checkSchemeId = async (req, res, next) => {
  try {
    const { scheme_id } = req.params
    const scheme = db('schemes').where({ "id": scheme_id }).first()
    if (scheme) {
      req.found = scheme
      next()
    } else {
      next({
        status: 404,
        message: `scheme with scheme_id ${scheme_id} not found`
      })
    }
  } catch (err) { next(err) }
}

const validateScheme = (req, res, next) => {
  try {
    const { scheme_name } = req.body
    if (
      scheme_name === undefined
      || scheme_name === ''
      || typeof scheme_name !== 'string'
    ) {
      next({
        status: 400,
        message: 'invalid scheme_name'
      })
    } else {
      next()
    }
  } catch (err) { next(err) }
}

const validateStep = (req, res, next) => {
  try {
    const { instructions, step_number } = req.body
    if (
      instructions === undefined
      || instructions === ''
      || typeof instructions !== 'string'
      || typeof step_number !== 'number'
    ) {
      next({
        status: 400,
        message: 'invalid step'
      })
    } else {
      next()
    }
  } catch (err) { next(err) }
}

module.exports = {
  checkSchemeId,
  validateScheme,
  validateStep,
}
