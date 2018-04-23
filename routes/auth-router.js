const passport = require("passport");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user-model");
const nodemailer = require("nodemailer");

// Bcrypt to encrypt passwords
// const bcryptSalt = 10;

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.gmail_user,
    pass: process.env.gmail_pass
  }
});


// Routes -----




/* ---------- SIGNUP --------------- */ 

router.get("/signup", (req, res, next) => {
    res.render("auth-views/signup-form");
});

router.post("/process-signup", (req, res, next) => {
    // console.log(req.user);
    if (req.user && req.user.role === "Admin"){
        const {fullName, email, role} = req.body;
        // if (password === "" || password.match(/[0-9]/) === null){
        //     // "req.flash()" is defined by the "flash" package
        //     req.flash("error", "Your password must have at least one number");
        //     res.redirect("/signup");
        //     return;
        // }
        
        // Default password
        const password = "123456";
        const salt = bcrypt.genSaltSync(10);
        const encryptedPassword = bcrypt.hashSync(password, salt);
    
        User.create({fullName, email, encryptedPassword, role})
            .then(() => {
                    // "req.flash()" is defined by the "flash" package
                req.flash("success", "You have signed up! Try logging in.");
                res.redirect("/");
            })
            .catch((err) => {
                next(err);
            });

        return;
    };
    
    
    
    
    const {fullName, email, password} = req.body;

    // password can't be blank and requires a number
    if (password === "" || password.match(/[0-9]/) === null || password.length < 6){
        // "req.flash()" is defined by the "flash" package
        req.flash("error", "Your password must have at least one number and contain 6 characters");
        res.redirect("/signup");
        return;
    }

    User.findOne({ fullName }, "username", (err, user) => {
        if (user !== null) {
          res.render("auth/signup", { message: "The username already exists" });
          return;
        };
    });
    
    const salt = bcrypt.genSaltSync(10);
    const encryptedPassword = bcrypt.hashSync(password, salt);
    const temporaryHash = bcrypt.hashSync(fullName, salt);
    hashUsername = temporaryHash.replace(/\//g, '');

    const confirmationCode = hashUsername;

    console.log("je suis ici");

    /* User.create({fullName, encryptedPassword, email, confirmationCode})
    .then(() => {
        console.log("created");
    })
    .catch((err) => {
        next(err);
    }); */

    const newUser = new User({
        fullName,
        encryptedPassword,
        email,
        confirmationCode: hashUsername
        });
    
    newUser.save((err) => {
        if (err) {
            res.render("auth-views/signup-form", { message: "Something went wrong" });
        } else {
            const link = `http://localhost:3000/confirm/${hashUsername}/${email}`;
        
        transport.sendMail({
        from: "Find It <website@example.com>",
        to: email,
        subject: `$Find It: Confirm your email`,
        text: `
            Name: ${fullName}
            Email: ${email}
            Welcome on our website, click on the link to confirm your email: ${link} 
        `,
        html: `
            <img src="https://cdn-images-1.medium.com/max/1920/1*e35LkwPQGqxRoB4dCWCh4g.png" width="100px"/>
            <h1>Welcome on Find It! Confirm your email</h1>
            <p>Name: <b>${fullName}</b></p>
            <p>Email: ${email}</p>
            <p>Confirm your mail: <a href="${link}">Confirm your email</a></p>
            `
        
        })
        .then(() => {
            console.log("success redirect to awaiting");
            res.redirect('/awaiting');
        })
        .catch((err) => {
        next(err);
        });
            res.redirect("/awaiting");
        };
    });


    /* newUser.save();


    
    console.log("je suis encor ici"); */
    
});

router.get("/awaiting", (req, res, next) => {
    res.render("auth-views/awaiting-confirmation")
})




router.get("/confirm/:confirmedCode/:email", (req, res, next) => {
    const currentEmail = req.params.email;
    const reconfirmationCode = req.params.confirmedCode;
    User.findOneAndUpdate({email: currentEmail, confirmationCode: reconfirmationCode}, {status: "Active"})
    .then((userDetails)=> {
        res.locals.user = userDetails;
        res.render('auth-views/account-active');
    
    })
    .catch((err) => {
        console.log('Confirmation did not work');
        next(err);
    });
});
    


/* ---------- LOGIN --------------- */    

router.get("/login", (req, res, next) => {
    res.render("auth-views/login-form");
});


router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth-views/login",
    failureFlash: true,
    passReqToCallback: true
  }));

router.post("/process-login", (req, res, next) => {
    const {email, password} = req.body;

    User.findOne({email})
        .then((userDetails) => {
            if (!userDetails){
                req.flash("error", "Wrong email.");
                res.redirect("/login");
                return;
            } 

            const {encryptedPassword} = userDetails;
            if (!bcrypt.compareSync(password,encryptedPassword )){
                req.flash("error", "Wrong password");
                res.redirect("/login");
                return;
            } 
            
            // req.session.isLoggedIn = true;
            // "req.login()" is Passport's method for logging a user in
            req.flash("success", "Log in successful!");
            req.login(userDetails, (userDetails) => {
                res.redirect("/");
            });
            
        })
        .catch((err) => {
            next(err);
        });
});

router.get("/logout", (req, res, next) => {
    // "req.logout()" is Passport's method for logging a user OUT
    req.logout();
    req.flash("success", "Log out successful!");
    res.redirect("/");
})

router.get("/google/login", 
    passport.authenticate("google", {
        scope: [
            "https://www.googleapis.com/auth/plus.login",
            "https://www.googleapis.com/auth/plus.profile.emails.read"
        ]
    }));
router.get("/google/success", 
    passport.authenticate("google", {
        successRedirect: "/",
        successFlash: "Google lig in success!",
        failureRedirect: "/login",
        failureFlash: "Google log in failure."
    }));


router.get("/github/login", passport.authenticate("github"));
router.get("/github/success", passport.authenticate("github", {
    successRedirect: "/",
    successFlash: "Github log in success!",
    failureRedirect: "/login",
    failureFlash: "Github log in failure"
}));






router.get("/personal/edit", (req, res, next) => {
    res.locals.myDetails = req.user;
    res.locals.fields = ["fullName", "email"];
    res.render("auth-views/personal-edit");
});

router.post("/process-edit/:id", (req, res, next) => {

});

router.post("/process-edit/:id/:field", (req, res, next) =>{

});


module.exports = router;