require("dotenv").config()
const mongoose = require("mongoose")
const connectDB = require("../config/db")
const Book = require("../models/Book")
const Chapter = require("../models/Chapter")
const chapterData = require("./gameOfThronesData");

const seed = async () => {
    try {
        console.log("Starting seed process...")

        await connectDB()

        await Book.deleteOne({
    slug: "a-game-of-thrones"
});

const existingBook = await Book.findOne({
    slug: "a-game-of-thrones"
});

if (existingBook) {

    await Chapter.deleteMany({
        bookId: existingBook._id
    });

    await Book.deleteOne({
        _id: existingBook._id
    });

}

        const book = await Book.create({
    title: "A Game of Thrones",
author: "George R. R. Martin",
slug: "a-game-of-thrones",

coverImage: "images/game-of-thrones.jpg",

description:
    "Noble families struggle for power as winter approaches and ancient threats awaken."
     });

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