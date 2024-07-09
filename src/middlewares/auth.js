const jwt = require("jsonwebtoken")
const prisma = require("../utils/prisma")

async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"].split(" ")[1]
    const decoded = jwt.verify(authHeader, process.env.JWT_SECRET)

    const userFound = await prisma.user.findFirst({
      where: {
        id: decoded.sub,
      },
    })

    req.user = userFound
    next()
  } catch (error) {
    res.status(401).json({
      message: "Invalid credentials",
    })
  }
}

async function isAdmin(req, res, next) {
  const id = Number(req.params.id)

  if (req.user.id !== id && req.user.role !== "ADMIN") {
    return res.status(403).json({
      error: "Access denied: admins only",
    })
  }

  next()
}

async function isAdminPost(req, res, next) {
  const id = Number(req.params.id)

  const post = await prisma.post.findUnique({
    where: {
      id: id,
    },
  })

  if (post.userId !== req.user.id && req.user.role !== "ADMIN") {
    return res.status(403).json({
      error: "Access denied: admins only",
    })
  }

  next()
}

module.exports = {
  verifyToken,
  isAdmin,
  isAdminPost,
}
