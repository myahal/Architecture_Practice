const Crypt = require('bcrypt')

class User  {
  constructor(id, name, hashed_password) {
    this.id =  id
    this.name = name
    this.hashed_password = hashed_password
  }

  static buildFromRow(row) {
    return new User(row.id, row.name, row.pass)
  }

  isValid(password) {
    return Crypt.compareSync(password, this.hashed_password)
  }

  hash(password) {
    return Crypt.hashSync(password, 10)
  }
}

module.exports = User