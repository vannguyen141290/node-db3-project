const db = require('../../data/db-config')

function find() {
  return db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .select('sc.scheme_id', 'sc.scheme_name')
    .count('st.step_id as number_of_steps')
    .groupBy('sc.scheme_id')
    .orderBy('sc.scheme_id')
}

function getRows(id) {
  return db('schemes as sc')
    .leftJoin('steps as st', 'sc.scheme_id', 'st.scheme_id')
    .select('sc.*', 'st.step_id', 'st.step_number', 'st.instructions')
    .where('sc.scheme_id', id)
    .orderBy('st.step_number')
}

async function findById(scheme_id) {
  const rows = await getRows(scheme_id)

  const stepArr = rows.map(row => {
    return ({
      step_id: row.step_id,
      step_number: row.step_number,
      instructions: row.instructions
    })
  })

  function getStep() {
    if (stepArr.every(step => step.step_id === null)) {
      return ([])
    } else { return stepArr }
  }

  return ({
    scheme_id: rows[0].scheme_id,
    scheme_name: rows[0].scheme_name,
    steps: getStep()
  })
}

async function findSteps(scheme_id) {
  const rows = await getRows(scheme_id)

  const steps = rows.map(row => {
    return ({
      step_id: row.step_id,
      step_number: row.step_number,
      instructions: row.instructions,
      scheme_name: row.scheme_name
    })
  })

  return steps
}

async function add(scheme) {
  const [id] = await db('schemes')
    .insert({ 'scheme_name': scheme.scheme_name })
  const newScheme = await db('schemes')
    .select('scheme_id', 'scheme_name')
    .where('scheme_id', id)
    .first()
  return newScheme
}

async function addStep(scheme_id, step) {
  await db('steps')
    .insert({
      step_number: step.step_number,
      instructions: step.instructions,
      'scheme_id': scheme_id
    })

  const result = await findSteps(scheme_id)
  return result
}

module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
}
