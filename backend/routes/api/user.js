const router = require("express").Router();

router.get("/", (req, res) => {
    res.json("Hello from user js");
})



module.exports = router;