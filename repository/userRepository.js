const User = require('../models/Users')
const pg = require("pg")

const pool =  new pg.Pool({
  host: 'localhost',
  database: 'mvc_practice',
  user: 'www',
  password: 'pass'
})

const getUsers = (async () => {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const result = await client.query("SELECT id, name FROM users")
    await client.query("COMMIT")
    const users = result.rows.map((row) => User.buildFromRow(row))
    return users
  } catch {
    await client.query("ROLLBACK")
    throw err
  } finally {
    client.release()
  }
})

const getUser = (async (name) => {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    const result = await client.query("SELECT id, name, pass from USERS where name = $1", [name])
    await client.query("COMMIT")
    if (result.rowCount < 1) {
      return null
    } else {
      return User.buildFromRow(result.rows[0])
    } 
  } catch {
    await client.query("ROLLBACK")
    throw err
  } finally {
    client.release()
  }
})

const createUser = (async (name, password) => {
  const hash_pass = User.hash(password)
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    await client.query("INSERT INTO users (name, pass) VALUES ($1, $2)", [name, hash_pass])
    await client.query("COMMIT")
    return true
  } catch {
    await client.query("ROLLBACK")
    throw err
  } finally {
    client.release()
  }
})


module.exports = {getUsers, getUser, createUser}


