const prisma = require("../utils/prisma")
const bcrypt = require("bcrypt")

const createUserDb = async (username, password, role) => {
  const data = {
    username,
    passwordHash: await bcrypt.hash(password, 6),
  }

  if (role) {
    data.role = role
  }

  const user = await prisma.user.create({ data })
  delete user.passwordHash
  return user
}

const getAllUsersDb = async () => await prisma.user.findMany()

const deleteUserDb = async (id) =>
  await prisma.user.delete({
    where: {
      id: id,
    },
  })

module.exports = {
  createUserDb,
  getAllUsersDb,
  deleteUserDb,
}
