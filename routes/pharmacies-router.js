const express = require("express");
const router = express.Router();
const User = require("../models/user-model");
const Store = require("../models/store-model");
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.cloudinary_name,
    api_key: process.env.cloudinary_key,
    api_secret: process.env.cloudinary_secret
  });
  
const storage = cloudinaryStorage({
    cloudinary,
    folder: 'more-movies'
  })
  
const upload = multer({ storage });


router.get("/pharmacies/add", (req, res, next) => {
    res.render("auth-views/add-store");
});

router.post("/process-add", upload.single('profilePicture'), (req, res, next) => {
    const { storeName, storeAddress, storeZip, storeCity, storeCountry, storePhoneNumber, prescriptions, licenses, services, storeImage } = req.body;
    Store.create({storeName, storeAddress, storeZip, storeCity, storeCountry, storePhoneNumber, prescriptions, licenses, services, storeImage})
        .then(() => {
            res.redirect("/")
        })
        .catch((err) => {
            next(err);
        });
    return;
});

router.get("/pharmacies/:id", (req, res, next) => {
});

router.get("/pharmacies/:id/edit", (req, res, next) => {

});

router.get("/process-store-edit")

// router.get("/pharmacies/edit", (req, res, next) => {
//     res.locals.
// })

module.exports = router