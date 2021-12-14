const dbConfig = require('../config/db')

module.exports = {
  doGetUser: (async () => {
      const users = await dbConfig.getUsers()
      return users
  }),

  doPostUser: (async (name, pass) => {
    return await dbConfig.createUser(name, pass)
  }),

  doLogin: (async (name, pass) => {
    const user = await dbConfig.getUser(name)
    if (user && user.isValid(pass)) {
      return true
    } else {
      return false
    }
  })
}