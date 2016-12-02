const bcrypt = require('bcrypt-nodejs');

module.exports = {
  hashPassword(password) {
    return bcrypt.hashSync(password);
  }
};
