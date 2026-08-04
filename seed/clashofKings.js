require("dotenv").config()
const mongoose = require("mongoose")
const connectDB = require("../config/db")
const Book = require("../models/Book")
const Chapter = require("../models/Chapter")
const chapterData = require("./clashOfKingsData");

const seed = async () => {
    try {
        console.log("Starting seed process...")

        await connectDB()

        await Book.deleteOne({
    slug: "a-clash-of-kings"
});

const existingBook = await Book.findOne({
    slug: "a-clash-of-kings"
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
    title: "A Clash of Kings",
    author: "George R. R. Martin",
    slug: "a-clash-of-kings",
    coverImage: "images/clash-of-kings.jpg",
    description:
        "As war engulfs Westeros, rival kings battle for the Iron Throne while ancient powers continue to awaken."
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