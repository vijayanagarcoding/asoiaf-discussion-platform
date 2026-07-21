require("dotenv").config()
const mongoose = require("mongoose")
const connectDB = require("../config/db")
const Book = require("../models/Book")
const Chapter = require("../models/Chapter")
const chapterData = require("./stormOfSwordsData")

const seed = async () => {
    try {
        console.log("Starting seed process...")

        await connectDB()

        await Book.deleteMany()
        await Chapter.deleteMany()

        const book = await Book.create({
            title: "A Storm of Swords",
            author: "George R. R. Martin",
            slug: "a-storm-of-swords"
        })

        const chaptersWithBook = chapterData.map(ch => ({
            ...ch,
            bookId: book._id
        }))

        await Chapter.insertMany(chaptersWithBook)

        console.log(`Inserted ${chaptersWithBook.length} chapters`)

        await mongoose.connection.close()
        process.exit(0)

    } catch (error) {
        console.error("Seed failed:", error)
        process.exit(1)
    }
}

seed()