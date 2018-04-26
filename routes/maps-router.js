const express = require("express");
const router = express.Router();
const User = require("../models/user-model");
var axios = require('axios')
// const CircularJSON = require("circular-json");

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
    const {place_id, name, formatted_address, price_level, type0, type1, type2, type3, type4, icon, opennn} = req.body;
    axios.get("https://maps.googleapis.com/maps/api/place/details/json?placeid="+ req.body.place_id +"&key=AIzaSyCAJIIGinRa7FIlpr_Ld14c9Uoa8NI4dRM")
    .then(placeInfo => {
    //  console.log(req.body);
        // const json = CircularJSON.stringify(placeInfo.data);
    res.locals.pharmacy = placeInfo.data;
//    res.send(placeInfo.data)
   res.render("pharmacy-views/one-pharmacy");
}).catch(err=>{
    console.log(err)
})
});

router.post("https://maps.googleapis.com/maps/api/place/details/json?placeid=ChIJr8ABh4pYwokR8Abs2nO9kOI&key=AIzaSyCAJIIGinRa7FIlpr_Ld14c9Uoa8NI4dRM")

module.exports = router;