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
const updateAvatar = async (id, avatar) => {

    return await User.findByIdAndUpdate(

        id,

        { avatar },

        {
            new: true
        }

    ).select("-password");

}
module.exports = {
  create,
  findByEmail,
  findById,
  updateAvatar
}
