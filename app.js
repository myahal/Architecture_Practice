const express = require("express")
const pg = require("pg")
const bcrypt = require('bcrypt')

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

const pool = new pg.Pool({
  host: 'localhost',
  database: 'mvc_practice',
  user: 'www',
  password: 'pass'
})

// 疎通確認用
app.get('/api/ping', (req, res) => {
  res.json({params: 'Ping OK!'});
 });

 // ユーザの一覧取得
 // curl 'http://localhost:3000/api/users'
 app.get('/api/users', (req, res) => {
   (async () => {
     const client = await pool.connect()
     try {
       await client.query("BEGIN")
       const result = await client.query("SELECT id, name FROM users")
       await client.query("COMMIT")
       res.json({
         users: result.rows
       })
     } catch {
       await client.query("ROLLBACK")
       throw err
     } finally {
       await client.release()
     }
   })().catch(err => {
     console.log(err.stack)
     res.json({
       result: 'FAIL'
     })
   })
 })

 // ユーザ登録
 // curl -X POST http://localhost:3000/api/user -H "Accept: application/json" -H "Content-type: application/json" -d '{ "name" : "tanaka2" , "password": "hoge"}'
 app.post('/api/user', (req, res) => {
  (async () => {
    const name = req.body.name
    const pass = req.body.password
    const hash_pass = bcrypt.hashSync(pass, 10)
    const client = await pool.connect()
    try {
      await client.query("BEGIN")
      await client.query("INSERT INTO users (name, pass) VALUES ($1, $2)", [name, hash_pass])
      await client.query("COMMIT")
      res.json({
        result: 'SUCCESS'
      })
    } catch {
      await client.query("ROLLBACK")
      throw err
    } finally {
      await client.release()
    }
  })().catch(err => {
    console.log(err.stack)
    res.json({
      result: 'FAIL'
    })
  })
})

// 認証
//  curl -X POST http://localhost:3000/api/login -H "Accept: application/json" -H "Content-type: application/json" -d '{ "name" : "tanaka2" , "password": "hoge"}'
app.post('/api/login', (req, res) => {
  (async () => {
    const name = req.body.name
    const pass = req.body.password
    const client = await pool.connect()
    try {
      await client.query("BEGIN")
      const result = await client.query("SELECT pass from USERS where name = $1", [name])
      await client.query("COMMIT")
      if (result.rowCount < 1) {
        res.json({
          result: 'INVALID'
        })
      } else if (bcrypt.compareSync(pass, result.rows[0].pass)){
        res.json({
          result: 'VALID'
        })
      } else {
        res.json({
          result: 'INVALID'
        })
      }

    } catch {
      await client.query("ROLLBACK")
      throw err
    } finally {
      await client.release()
    }
  })().catch(err => {
    console.log(err.stack)
    res.json({
      result: 'FAIL'
    })
  })
})

app.listen(3000, () => console.log('Example app listening on port 3000'))