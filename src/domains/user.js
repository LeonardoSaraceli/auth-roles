const prisma = require("../utils/prisma")
const bcrypt = require("bcrypt")

const createUserDb = async (username, password) => {
  const user = await prisma.user.create({
    data: {
      username,
      passwordHash: await bcrypt.hash(password, 6),
    },
  })
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
