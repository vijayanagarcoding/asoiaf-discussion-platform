const mongoose = require("mongoose")

const threadSchema = new mongoose.Schema(
    {
        chapterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chapter",
            required: true
        },

        title: {
            type: String,
            required: true
        },

        category: {
            type: String,
            default: "Discussion"
        },

        pinned: {
            type: Boolean,
            default: false
        },

        content: {
            type: String,
            required: true
        },
likes: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }

    },
    { timestamps: true }
)

module.exports = mongoose.model("Thread", threadSchema)
