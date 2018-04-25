const express = require("express");
const router = express.Router();
const User = require("../models/user-model");

router.get("/portal/maps", (req, res, next) => {
    if (!req.user){
        next();
    }
    res.render("logged-views/map");
})

// router.get("/process-search", (req, res, next) => {
//     console.log("yolo")
//     res.json(req.body);
// })

module.exports = router;