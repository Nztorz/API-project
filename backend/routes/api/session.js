const router = require("express").Router();
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

const { setTokenCookie, restoreUser } = require("../../utils/auth");
const { User } = require("../../db/models");

// POST /
router.post("/", async (req, res, next) => {
    // destructuring password and credential
    // credential could be username or email
    const { credential, password } = req.body;

    const user = await User.unscoped().findOne({
        where:{
            [Op.or]: {
                username: credential,
                email: credential
            }
        }
    });

    // check for the password equals hashed password
    if(!user || !bcrypt.compareSync(password, user.hashedPassword.toString())) {
        const err = new Error("Login failed!");
        err.status = 401;
        err.title = "Login failed";
        err.errors = { credential: "The provided credentials were invalid" };
        return next(err);
    }

    // build safeUser
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };

    // if everything success set the token
    await setTokenCookie(res, safeUser);

    return res.json({
        user: safeUser
    });
});


module.exports = router;