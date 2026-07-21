const User = require("../models/User")

const create = async (data) => {
  return await User.create(data)
}

const findByEmail = async (email) => {
  return await User.findOne({ email })
}

const findById = async (id) => {
  return await User.findById(id)
}

module.exports = {
  create,
  findByEmail,
  findById
}
