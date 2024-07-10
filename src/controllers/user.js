const { PrismaClientKnownRequestError } = require("@prisma/client")
const {
  createUserDb,
  getAllUsersDb,
  deleteUserDb,
} = require("../domains/user.js")
const jwt = require("jsonwebtoken")

const createUser = async (req, res) => {
  const { username, password } = req.body

  if (!username || !password) {
    return res.status(400).json({
      error: "Missing fields in request body",
    })
  }

  try {
    const user = await createUserDb(username, password)
    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET)

    return res.status(201).json({
      user,
      token,
    })
  } catch (e) {
    if (e instanceof PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        return res
          .status(409)
          .json({ error: "A user with the provided username already exists" })
      }
    }

    res.status(500).json({ error: e.message })
  }
}

const getAllUsers = async (req, res) => {
  const users = await getAllUsersDb()

  res.json({
    users,
  })
}

const deleteUser = async (req, res) => {
  const id = Number(req.params.id)

  if (isNaN(id)) {
    return res.status(400).json({
      error: "The id must be a number",
    })
  }

  const user = await deleteUserDb(id)

  if (!user) {
    return res.status(404).json({
      error: "User not found",
    })
  }

  res.json({
    user,
  })
}

module.exports = {
  createUser,
  getAllUsers,
  deleteUser,
}
