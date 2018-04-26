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

router.post("/pharmacy/process-one-pharmacy", (req, res, next) => {
    // place_id = req.params.id;
    // console.log(place_id);
    const {name, formatted_address} = req.body;
    // onePlace = JSON.parse(onePlace)
    // console.log("one place:", onePlace.formatted_address);
    // res.send(JSON.stringify(req.body.onePlace));
    // res.send(JSON.parse(req.body))
    res.send(req.body)
    // console.log(onePlace[0])
    // res.locals.pharmacy = onePlace;
    // res.render("pharmacy-views/one-pharmacy");
})

module.exports = router;