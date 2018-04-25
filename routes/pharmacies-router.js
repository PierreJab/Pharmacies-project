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

//all pharmacies page

router.get("/pharmacies", (req, res, next) => {
    
    Store.find()
    // .populate('storeName')
    .then((storesFromDb) => {
            res.locals.storeList = storesFromDb;
            res.render('pharmacy-views/pharmacies-page');
        })
        .catch((err) => {
            next(err);
        });
    });

//add a pharmacy

router.get("/pharmacies/add", (req, res, next) => {
    res.render("pharmacy-views/add-store");
});

router.post("/process-add", upload.single('profilePicture'), (req, res, next) => {
    const { storeName, storeAddress, storeZip, storeCity, storeCountry, storePhoneNumber, prescriptions, licenses, services, storeImage } = req.body;
    Store.create({storeName, storeAddress, storeZip, storeCity, storeCountry, storePhoneNumber, prescriptions, licenses, services, storeImage})
        .then(() => {
            res.redirect("/pharmacies")
        })
        .catch((err) => {
            next(err);
        });
    return;
});

//single pharmacy page by id

router.get("/pharmacies/:id", (req, res, next) => {
    Store.findById(req.params.id)
    .then((storeDetails) => {
        var Store = storeDetails;
        // res.locals.store = storeDetails;
        res.render('pharmacy-views/single-pharmacy-page', {Store});
    })
    .catch((err) => {
        next(err);
    });
});

//edit pharmacy by id

// router.get("/pharmacies/:id/edit", (req, res, next) => {

// router.get("/process-store-edit")

// router.get("/pharmacies/edit", (req, res, next) => {
//     res.locals.
// })

module.exports = router