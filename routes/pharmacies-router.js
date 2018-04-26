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

//portal main page

router.get("/portal", (req, res, next) => {
    if (!req.user){
        next();
    }
    User.find()
    .then((usersFromDb) => {
        //let userList = usersFromDb;
        console.log(usersFromDb);
        res.locals.userList = usersFromDb;
        res.render("logged-views/main-page")
    })

    
})

//portal edit prescriptions
//portal edit services

//all pharmacies

router.get("/portal/pharmacies", (req, res, next) => {
    if (!req.user){
        next();
    }
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

    router.get("/pharmacies", (req, res, next) => {
        if (!req.user){
            next();
        }
        Store.find()
        // .populate('storeName')
        .then((storesFromDb) => {
                res.locals.storeList = storesFromDb;
                res.render('pharmacy-views/pharmacies-page');
            })
            .catch((err) => {
                next(err);
            });
    })

//add a pharmacy

router.get("/pharmacies/add", (req, res, next) => {
    if (!req.user){
        next();
    }
    res.render("pharmacy-views/add-store");
});

router.post("/process-add", upload.single('profilePicture'), (req, res, next) => {
    const { storeName, storeAddress, storeZip, storeCity, storeCountry, storePhoneNumber, prescriptions, licenses, services, storeImage } = req.body;
    Store.create({storeName, storeAddress, storeZip, storeCity, storeCountry, storePhoneNumber, prescriptions, licenses, services, storeImage})
        .then(() => {
            res.redirect("/portal/pharmacies")
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

//delete??

// router.get("/pharmacies/delete", (req, res, next) => {
//     Store.findByIdAndRemove(req.params.id)
//     .then(() => {
//         res.redirect('/portal/pharmacies')
//     })
//     .catch((err) => {
//         next(err);
//     });
//     });

//leave a review

router.get("/pharmacies/review", (req, res, next) => {
    res.locals.storeDetails=req.store;
    res.render("pharmacy-views/review-form");
})

module.exports = router