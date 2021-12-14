const UserController = require("./controllers/UserController")
const express = require("express")

const app = express()
app.use(express.urlencoded({extended: true}))
app.use(express.json())


// 疎通確認用
app.get('/api/ping', (req, res) => {
  res.json({params: 'Ping OK!'});
 });

 // ユーザの一覧取得
 // curl 'http://localhost:3000/api/users'
 app.get('/api/users', async (req, res) => {
   const result = await UserController.doGetUser()
   res.json({users: result})
 })

 // ユーザ登録
 // curl -X POST http://localhost:3000/api/user -H "Accept: application/json" -H "Content-type: application/json" -d '{ "name" : "tanaka2" , "password": "hoge"}'
 app.post('/api/user', async (req, res) => {
   try {
      const result = await UserController.doPostUser(req.body.name, req.body.password)
      res.json({result: 'SUCCESS'})
   } catch {
     res.json({result: 'FAIL'})
   }
})

// 認証
//  curl -X POST http://localhost:3000/api/login -H "Accept: application/json" -H "Content-type: application/json" -d '{ "name" : "tanaka2" , "password": "hoge"}'
app.post('/api/login', async (req, res) => {
  try {
    const result = await UserController.doLogin(req.body.name, req.body.password)
    if (result) {
      res.json({result: 'LOGIN SUCCESS'})
    } else {
      res.json({result: 'LOGIN FAILED'})
    }
  } catch {
    res.json({result: 'FAILED'})
  }
})

app.listen(3000, () => console.log('Example app listening on port 3000'))