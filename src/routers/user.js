const express = require("express")
const { createUser, getAllUsers, deleteUser } = require("../controllers/user")
const { verifyToken, isAdmin } = require("../middlewares/auth")

const router = express.Router()

router.post("/", createUser)
router.get("/", verifyToken, isAdmin, getAllUsers)
router.delete("/:id", verifyToken, isAdmin, deleteUser)

module.exports = router
