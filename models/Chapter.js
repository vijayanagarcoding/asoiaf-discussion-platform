const mongoose = require("mongoose")

const chapterSchema = new mongoose.Schema(
    {
        bookId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Book",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        povCharacter: {
            type: String
        },
        order: {
            type: Number,
            required: true
        },
        summary: {
            type: String
        }
    },
    { timestamps: true }
)

// Ensure chapters are ordered within a book
chapterSchema.index({ bookId: 1, order: 1 })

module.exports = mongoose.model("Chapter", chapterSchema)
