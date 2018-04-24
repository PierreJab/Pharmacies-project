router.get("/pharmacies/add", (req, res, next) => {
    res.render("auth-views/add-store");
});

router.post("/process-add", (req, res, next) => {
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