const mongoose = require("mongoose")

const bookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },

        author: {
            type: String,
            required: true
        },

        slug: {
            type: String,
            required: true,
            unique: true
        },

        coverImage: {
            type: String,
            default: ""
        },

        description: {
            type: String,
            default: ""
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Book", bookSchema)