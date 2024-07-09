const express = require("express")
const { createPost, deletePost } = require("../controllers/post")
const { verifyToken, isAdminPost } = require("../middlewares/auth")

const router = express.Router()

router.post("/", createPost)
router.delete("/:id", verifyToken, isAdminPost, deletePost)

module.exports = router
