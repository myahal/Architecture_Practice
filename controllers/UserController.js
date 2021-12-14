const userRepository = require('../repository/userRepository')

module.exports = {
  doGetUser: (async () => {
      const users = await userRepository.getUsers()
      return users
  }),

  doPostUser: (async (name, pass) => {
    return await userRepository.createUser(name, pass)
  }),

  doLogin: (async (name, pass) => {
    const user = await userRepository.getUser(name)
    if (user && user.isValid(pass)) {
      return true
    } else {
      return false
    }
  })
}