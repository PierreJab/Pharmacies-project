const express = require("express");
const router = express.Router();
const User = require("../models/user-model");
var axios = require('axios');
var C

router.get("/portal/maps", (req, res, next) => {
    if (!req.user){
        next();
    }
    res.render("logged-views/map");
});


router.post("/pharmacy/:id", (req, res, next) => {
    // const {place_id} = req.body;
    const place_id = req.params.id;
    axios.get("https://maps.googleapis.com/maps/api/place/details/json?placeid="+ place_id +"&key=AIzaSyCAJIIGinRa7FIlpr_Ld14c9Uoa8NI4dRM")
        .then(placeInfo => {
        console.log(placeInfo);
        // res.send(placeInfo);
        res.locals.pharmacy = placeInfo.data.result;
        console.log(placeInfo.data);
        console.log(placeInfo.data.website)
        res.render("pharmacy-views/one-pharmacy");
        })
        .catch(err=>{
            console.log(err)
        })
});

module.exports = router;