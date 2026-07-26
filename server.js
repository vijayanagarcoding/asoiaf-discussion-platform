require("dotenv").config()

const express = require("express")
const cors = require("cors")
const connectDB = require("./config/db")

const app = express()

connectDB()

app.use(cors())
app.use(express.json())
const path = require("path")
app.use(express.static(path.join(__dirname, "public")))

app.use("/api/books", require("./routes/bookRoutes"))
app.use("/api", require("./routes/threadRoutes"))   // ← ADD THIS

app.get("/", (req, res) => {
    res.json({ message: "ASOIAF Discussion API Running" })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
app.use("/api", require("./routes/commentRoutes"))
app.use("/api", require("./routes/authRoutes"))
app.use("/api/users", require("./routes/userRoutes"));