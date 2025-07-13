const router = require("express").Router();

router.get("/csrf/restore", (req, res, next) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
        "XSRF-Token": csrfToken
    })
});


router.post("/test", (req, res, next) => {
    res.json({"requestBody": req.body });
});



module.exports = router;