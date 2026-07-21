const express = require("express")
const router = express.Router()
const Book = require("../models/Book")
const Chapter = require("../models/Chapter")

// Get all books
router.get("/", async (req, res) => {
    const books = await Book.find()
    res.json(books)
})

// Get chapters by book
router.get("/:bookId/chapters", async (req, res) => {
    const chapters = await Chapter.find({ bookId: req.params.bookId }).sort({ order: 1 })
    res.json(chapters)
})

module.exports = router