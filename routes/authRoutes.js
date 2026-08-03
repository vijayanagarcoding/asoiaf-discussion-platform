const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const User = require("../models/User");

const crypto = require("crypto");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({

    service: "gmail",

    auth: {

        user: process.env.EMAIL_USER,

        pass: process.env.EMAIL_PASS

    }

});

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/forgot-password", async (req, res) => {

    try {

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {

            return res.status(404).json({

                message: "No account found with that email."

            });

        }

        const token = crypto.randomBytes(32).toString("hex");

        user.resetPasswordToken = token;

        user.resetPasswordExpires = Date.now() + 1000 * 60 * 30;

        await user.save();

        const resetLink =
            `${process.env.FRONTEND_URL}/reset-password.html?token=${token}`;

        await transporter.sendMail({

            from: process.env.EMAIL_USER,

            to: user.email,

            subject: "Reset your Password",

            html: `
                <h2>Password Reset</h2>

                <p>You requested to reset your password.</p>

                <p>Click the link below to choose a new password.</p>

                <a href="${resetLink}">
                    Reset Password
                </a>

                <p>This link will expire in 30 minutes.</p>
            `

        });

        res.json({

            message: "Password reset email sent."

        });

    } catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Server error."

        });

    }

});

module.exports = router;