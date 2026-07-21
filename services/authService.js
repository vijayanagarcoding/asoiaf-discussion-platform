const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const userRepository = require("../repositories/userRepository")

const register = async (payload) => {
  const { username, email, password } = payload

  if (!username || !email || !password) {
    throw new Error("All fields are required")
  }

  const existingUser = await userRepository.findByEmail(email)
  if (existingUser) {
    throw new Error("Email already in use")
  }

  const passwordHash = await bcrypt.hash(password, 10)

  const user = await userRepository.create({
    username,
    email,
    passwordHash
  })

  return generateToken(user)
}

const login = async (payload) => {
  const { email, password } = payload

  const user = await userRepository.findByEmail(email)
  if (!user) {
    throw new Error("Invalid credentials")
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash)
  if (!isMatch) {
    throw new Error("Invalid credentials")
  }

  return generateToken(user)
}

const generateToken = (user) => {
  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  )

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    }
  }
}

module.exports = {
  register,
  login
}
