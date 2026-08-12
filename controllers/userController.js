const userService = require("../services/userService");

const uploadAvatar = async (req, res) => {

    try {

        const user = await userService.uploadAvatar(
            req.user.id,
            req.file
        );

        res.json({
            success: true,
            data: user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    uploadAvatar
};