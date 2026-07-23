const mongoose = require("mongoose")

const commentSchema = new mongoose.Schema(
    {
        threadId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Thread",
            required: true
        },
        parentCommentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            default: null
        },
        content: {
            type: String,
            required: true
        },
        user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
}
    },
    { timestamps: true }
)

commentSchema.index({ threadId: 1, createdAt: 1 })

module.exports = mongoose.model("Comment", commentSchema)