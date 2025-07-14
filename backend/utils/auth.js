const jwt = require("jsonwebtoken");
const { jwtConfig } = require("../config");
const { User } = require("../db/models");

const { secret, expiresIn } = jwtConfig;

// sends JWT Cookie
const setTokenCookie = (res, user) => {
    // Create token
    const safeUser = {
        id: user.id,
        email: user.email,
        username: user.username,
    };
    const token = jwt.sign(
        { data: safeUser },
        secret,
        { expiresIn: parseInt(expiresIn) }
    );

    const isProduction = process.env.NODE_ENV === "production";

    // Set the cookie token
    res.cookie("token", token, {
        maxAge: expiresIn * 1000,
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });

    return token;
};

// For authenticated routes
// require the identity for current session user
const restoreUser = (req, res, next) => {
    // get the token from the cookies
    const { token } = req.cookies;
    req.user = null;

    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if(err) {
            return next();
        }

        try {
            const { id } = jwtPayload.data;
            req.user = await User.findByPk(id, {
                atttributes: {
                    include: ["email", "createdAt", "updatedAt"]
                }
            })
        } catch(e) {
            res.clearCookie("token");
            return next();
        }

        if(!req.user) res.clearCookie("token");

        return next();
    });
};

// requireAuth - authenticate session user
// before accessing a route
const requireAuth = (req, _res, next) => {
    if(req.user) return next();

    const err = new Error("Authentication required");
    err.title = "Authentication required";
    err.errors = { message: "Authentication required" };
    err.status = 401;
    return next(err);
};


module.exports = { setTokenCookie, restoreUser, requireAuth };