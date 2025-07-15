const router = require("express").Router();
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

router.post("/", async (req, res, next) => {
    const { email, password, username } = req.body;

    // seed the model
    // hash the password
    const newUser = await User.create({
        email: email,
        username, username,
        hashedPassword: bcrypt.hashSync(password)
    });

    // login the user and set token
    const safeUser = {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username
    };

    await setTokenCookie(res, safeUser);

    return res.json({
        message: "Successfully login"
    });
})


module.exports = router;