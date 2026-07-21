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
        content: {
            type: String,
            required: true
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Thread", threadSchema)