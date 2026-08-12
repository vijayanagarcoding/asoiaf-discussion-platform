require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/books", require("./routes/bookRoutes"));
app.use("/api", require("./routes/threadRoutes"));
app.use("/api", require("./routes/commentRoutes"));
app.use("/api", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.get("/", (req, res) => {
    res.json({ message: "ASOIAF Discussion API Running" });
});

const PORT = process.env.PORT || 5000;
app.get("/test-upload", (req, res) => {
    res.sendFile(path.join(__dirname, "uploads", "default-avatar.png"));
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});