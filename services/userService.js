const userRepository = require("../repositories/userRepository");

const uploadAvatar = async (userId, file) => {

    if (!file) {
        throw new Error("No image uploaded.");
    }

    return await userRepository.updateAvatar(
        userId,
        file.filename
    );

};

module.exports = {
    uploadAvatar
};