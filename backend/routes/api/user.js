const router = require("express").Router();
const bcrypt = require("bcryptjs");

const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const validateSignup = [
    check("email")
        .exists({ checkFalsy: true })
        .isEmail()
        .withMessage("Please provide a valid email."),
    check("username")
        .exists({ checkFalsy: true })
        .isLength({ min: 4 })
        .withMessage("Please provide an username with at least 4 characters."),
    check("username")
        .not()
        .isEmail()
        .withMessage("Username cannot be an email"),
    check("password")
        .exists({ checkFalsy: true })
        .isLength({ min: 6 })
        .withMessage("Password must be 6 chracters or more."),
    handleValidationErrors
];

router.post("/", validateSignup, async (req, res, next) => {
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