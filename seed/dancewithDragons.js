require("dotenv").config()
const mongoose = require("mongoose")
const connectDB = require("../config/db")
const Book = require("../models/Book")
const Chapter = require("../models/Chapter")
const chapterData = require("./danceWithDragonsData");

const seed = async () => {
    try {
        console.log("Starting seed process...")

        await connectDB()

        await Book.deleteOne({
    slug: "a-dance-with-dragons"
});

const existingBook = await Book.findOne({
    slug: "a-dance-with-dragons"
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
    title: "A Dance with Dragons",
    author: "George R. R. Martin",
    slug: "a-dance-with-dragons",
    coverImage: "images/dance-with-dragons.jpg",
    description:
        "As winter deepens, Jon Snow, Daenerys Targaryen, Tyrion Lannister, and many others face the consequences of a fractured world."
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