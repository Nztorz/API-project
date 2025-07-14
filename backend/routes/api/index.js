const router = require("express").Router();
const { restoreUser } = require("../../utils/auth.js");
const sessionRouter = require("./session.js");
const userRouter = require("./user.js");

router.use(restoreUser);
router.use("/session", sessionRouter);
router.use("/users", userRouter);


router.get("/csrf/restore", (req, res, next) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
        "XSRF-Token": csrfToken
    })
});


module.exports = router;