const express = require("express");
const router = express.Router();
const User = require("../models/user-model");

router.get("/admin/employees", (req, res, next) => {
    
    // if you aren't logged in or you are NOT an admin
    if (!req.user || req.user.role !== "Admin"){
        // ... go straight to the 404 page (sneaky!)
        next();
        return;
    }

    User.find()
        .then((usersFromDb) => {
            res.locals.employeesList = usersFromDb;
            res.render("admin-views/employees-list-page"); 
        })
        .catch((err) => {
            next(err);
        });
});

router.get("/pharmacy/employees", (req, res, next) => {
    
    // if you aren't logged in or you are NOT an admin
    if (!req.user || req.user.role !== "Pharmacy"){
        // ... go straight to the 404 page (sneaky!)
        next();
        return;
    }

    User.find()
        .then((usersFromDb) => {
            res.locals.employeesList = usersFromDb;
            res.render("pharmacy-views/info");   
        })
        .catch((err) => {
            next(err);
        });
});

router.get("/admin/:id/delete", (req, res, next) => {
    if (!req.user || req.user.role !== "Admin"){
        // ... go straight to the 404 page (sneaky!)
        next();
        return;
    }

    User.findByIdAndRemove(req.params.id)
        .then(() => {
            res.redirect('/admin/employees')
        })
        .catch((err) => {
            next(err);
        })
});

router.get("/admin/:id/edit", (req, res, next) => {
    if (!req.user || req.user.role !== "Admin"){
        // ... go straight to the 404 page (sneaky!)
        next();
        return;
    }

    User.findByIdAndUpdate(req.params.id)
        .then((employeeDetails) => {
            res.locals.id = req.params.id;
            res.locals.employee = employeeDetails;
            res.render('admin-views/employee-edit');
            // res.redirect('/admin/employees');
        })
        .catch((err) => {
            next(err);
        })
});

router.post("/process-edit/:id", (req, res, next) => {
    if (!req.user || req.user.role !== "Admin"){
        // ... go straight to the 404 page (sneaky!)
        next();
        return;
    }

    const {fullName, email, role} = req.body;

    if (!(role in {Admin: "Admin", Pharmacy: "Pharmacy", User: "User"})){
        res.redirect(`/admin/${req.params.id}/edit`);
        return;
    };

    User.findByIdAndUpdate(
        req.params.id, 
        {fullName, email, role},
        {runValidators: true}
    )
        .then(() => {
            res.redirect('/admin/employees');
        })
        .catch((err) => {
            next(err);
        });

})

module.exports = router;