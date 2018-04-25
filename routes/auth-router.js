const passport = require("passport");
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user-model");
const nodemailer = require("nodemailer");
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
const Store = require("../models/store-model");

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
    if (password.match(/[0-9]/) === null || password.length < 6){
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
        <!doctype html>
        <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
        
        <head>
            <title>
        
            </title>
            <!--[if !mso]><!-- -->
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <!--<![endif]-->
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style type="text/css">
                #outlook a {
                    padding: 0;
                }
        
                .ReadMsgBody {
                    width: 100%;
                }
        
                .ExternalClass {
                    width: 100%;
                }
        
                .ExternalClass * {
                    line-height: 100%;
                }
        
                body {
                    margin: 0;
                    padding: 0;
                    -webkit-text-size-adjust: 100%;
                    -ms-text-size-adjust: 100%;
                }
        
                table,
                td {
                    border-collapse: collapse;
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                }
        
                img {
                    border: 0;
                    height: auto;
                    line-height: 100%;
                    outline: none;
                    text-decoration: none;
                    -ms-interpolation-mode: bicubic;
                }
        
                p {
                    display: block;
                    margin: 13px 0;
                }
            </style>
            <!--[if !mso]><!-->
            <style type="text/css">
                @media only screen and (max-width:480px) {
                    @-ms-viewport {
                        width: 320px;
                    }
                    @viewport {
                        width: 320px;
                    }
                }
            </style>
            <!--<![endif]-->
            <!--[if mso]>
                <xml>
                <o:OfficeDocumentSettings>
                  <o:AllowPNG/>
                  <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
            <!--[if lte mso 11]>
                <style type="text/css">
                  .outlook-group-fix { width:100% !important; }
                </style>
                <![endif]-->
        
            <!--[if !mso]><!-->
            <link href="https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700" rel="stylesheet" type="text/css">
            <style type="text/css">
                @import url(https://fonts.googleapis.com/css?family=Ubuntu:300,400,500,700);
            </style>
            <!--<![endif]-->
        
        
        
            <style type="text/css">
                @media only screen and (min-width:480px) {
                    .mj-column-per-100 {
                        width: 100% !important;
                    }
                }
            </style>
        
        
            <style type="text/css">
            </style>
        
        </head>
        
        <body style="background-color:#bedae6;">
        
        
            <div style="background-color:#bedae6;">
        
        
                <!--[if mso | IE]>
              <table
                 align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
              >
                <tr>
                  <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
              <![endif]-->
        
        
                <div style="background:#ffffff;background-color:#ffffff;Margin:0px auto;max-width:600px;">
        
                    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
                        <tbody>
                            <tr>
                                <td style="direction:ltr;font-size:0px;padding:0px;text-align:center;vertical-align:top;">
                                    <!--[if mso | IE]>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        
                <tr>
              
                    <td
                       style="vertical-align:top;width:600px;"
                    >
                  <![endif]-->
        
                                    <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
        
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td style="vertical-align:top;padding:0px;">
        
                                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                                            <!-- <mj-image src="http%3A%2F%2Fgo.mailjet.com%2Ftplimg%2Fmtrq%2Fb%2Fox8s%2Fmg1q9.png" alt="header%20image" padding="0px"></mj-image> -->
                                                            <!-- <mj-image src="https%3A%2F%2Fmd.thegalleria.ae%2Ffiler_public_thumbnails%2Ffiler_public%2F12%2Ff5%2F12f5617d-8672-4d35-8f82-f6ee6353ca17%2Fbinsinapharmacy.jpg__1824x870_q85_crop-smart_subsampling-2_upscale-true.jpg" alt="header%20image" padding="0px"></mj-image> -->
                                                            <tr>
                                                                <td align="center" style="font-size:0px;padding:0px;word-break:break-word;">
        
                                                                    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:collapse;border-spacing:0px;">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td style="width:600px;">
        
                                                                                    <img height="auto" src="https://aquilanonvedente.files.wordpress.com/2015/02/farmaci1.jpg" style="border:0;display:block;outline:none;text-decoration:none;width:100%;" width="600">
        
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
        
                                                                </td>
                                                            </tr>
        
                                                        </table>
        
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
        
                                    </div>
        
                                    <!--[if mso | IE]>
                    </td>
                  
                </tr>
              
                          </table>
                        <![endif]-->
                                </td>
                            </tr>
                        </tbody>
                    </table>
        
                </div>
        
        
                <!--[if mso | IE]>
                  </td>
                </tr>
              </table>
              
              <table
                 align="center" border="0" cellpadding="0" cellspacing="0" style="width:600px;" width="600"
              >
                <tr>
                  <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
              <![endif]-->
        
        
                <div style="background:#ffffff;background-color:#ffffff;Margin:0px auto;max-width:600px;">
        
                    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="background:#ffffff;background-color:#ffffff;width:100%;">
                        <tbody>
                            <tr>
                                <td style="direction:ltr;font-size:0px;padding:0px;padding-bottom:20px;padding-top:10px;text-align:center;vertical-align:top;">
                                    <!--[if mso | IE]>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        
                <tr>
              
                    <td
                       style="vertical-align:top;width:600px;"
                    >
                  <![endif]-->
        
                                    <div class="mj-column-per-100 outlook-group-fix" style="font-size:13px;text-align:left;direction:ltr;display:inline-block;vertical-align:top;width:100%;">
        
                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
                                            <tbody>
                                                <tr>
                                                    <td style="vertical-align:top;padding:0px;">
        
                                                        <table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">
        
                                                            <tr>
                                                                <td align="center" style="font-size:0px;padding:10px 25px;word-break:break-word;">
        
                                                                    <div style="font-family:Ubuntu, Helvetica, Arial, sans-serif;font-size:20px;line-height:1;text-align:center;color:#512d0b;">
                                                                        <strong>Hey ${fullName}!</strong>
                                                                    </div>
        
                                                                </td>
                                                            </tr>
        
                                                            <tr>
                                                                <td align="center" style="font-size:0px;padding:0 25px;word-break:break-word;">
        
                                                                    <div style="font-family:Arial;font-size:18px;line-height:1;text-align:center;color:#000000;">
                                                                        Thank you for signing up!<br>You are almost done.
                                                                    </div>
        
                                                                </td>
                                                            </tr>
        
                                                            <tr>
                                                                <td align="center" style="font-size:0px;padding:0 25px;padding-top:20px;word-break:break-word;">
        
                                                                    <div style="font-family:Arial, sans-serif;font-size:25px;font-weight:bold;line-height:35px;text-align:center;color:#489BDA;">
                                                                        Click on the link bellow<br>
                                                                        <span style="font-size:18px">and find your pharmacy as soon as possible!</span>
                                                                    </div>
        
                                                                </td>
                                                            </tr>
        
                                                            <tr>
                                                                <td align="center" vertical-align="middle" style="font-size:0px;padding:20px 0 0 0;word-break:break-word;">
        
                                                                    <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">
                                                                        <tr>
                                                                            <td align="center" bgcolor="#8bb420" role="presentation" style="border:none;border-radius:3px;color:#FFFFFF;cursor:auto;padding:10px 25px;" valign="middle">
                                                                                <a href="http://localhost:3000/confirm/${hashUsername}/${email}" style="background: #8bb420; font-family: Arial, sans-serif; font-size: 16px; font-weight: bold; line-height: 120%; Margin: 0; text-transform: none; text-decoration: none; color: inherit;"
                                                                                    target="_blank">
                      Confirm your account
                    </a>
                                                                            </td>
                                                                        </tr>
                                                                    </table>
        
                                                                </td>
                                                            </tr>
        
                                                            <tr>
                                                                <td align="center" style="font-size:0px;padding:0 25px;padding-top:40px;word-break:break-word;">
        
                                                                    <div style="font-family:Arial, sans-serif;font-size:14px;line-height:1;text-align:center;color:#000000;">
                                                                        Best, <br> The Find It Team
                                                                        <p></p>
                                                                        <img src="https://png.icons8.com/metro/1600/pill.png" alt="" width="40vw">
                                                                    </div>
        
                                                                </td>
                                                            </tr>
        
                                                        </table>
        
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
        
                                    </div>
        
                                    <!--[if mso | IE]>
                    </td>
                  
                </tr>
              
                          </table>
                        <![endif]-->
                                </td>
                            </tr>
                        </tbody>
                    </table>
        
                </div>
        
        
                <!--[if mso | IE]>
                  </td>
                </tr>
              </table>
              <![endif]-->
        
        
            </div>
        
        </body>
        
        </html>
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

    
});
//
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
    successRedirect: "/portal",
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
                res.redirect("/portal");
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
        successRedirect: "/portal",
        successFlash: "Google log in success!",
        failureRedirect: "/login",
        failureFlash: "Google log in failure."
    }));


router.get("/github/login", passport.authenticate("github"));
router.get("/github/success", passport.authenticate("github", {
    successRedirect: "/pharmacies",
    successFlash: "Github log in success!",
    failureRedirect: "/login",
    failureFlash: "Github log in failure"
}));



router.get("/personal/edit", (req, res, next) => {
    res.locals.myDetails = req.user;
    res.render("auth-views/personal-edit");
});

router.post("/process-edit/:id", upload.single('profilePicture'), (req, res, next) => {
    if (!req.user){
        next();
        return;
    }
    console.log("im here");

    id = req.params.id;
    const {fullName, email, birthday, phone, address, zip, city, country, aboutMe} = req.body;
    // const {profilePicture} = req.file;
    console.log(req.file);
    const {originalname, secure_url} = req.file;
    /* if (req.file){
    } else {
        originalname = "";
        secure_url = "";
    }; */

    User.findByIdAndUpdate(id, 
        {
            fullName, 
            email, 
            birthday, 
            phone, 
            address, 
            zip, 
            city, 
            country, 
            aboutMe,
            profilePicture: {
                originalname, 
                secure_url
            }, 
        })
        .then(() => {
            console.log("updated");
            req.flash("success", "Information saved!");
            res.redirect("/personal/edit");
        })
        .catch((err) => {
            next(err);
        })


});



router.post("/process-edit/:id/password", (req, res, next) =>{
    if (!req.user){
        next();
        return;
    }

    id = req.params.id;
    const {oldPassword, newPassword, confirmPassword} = req.body;

    bcrypt.compare(oldPassword, req.user.encryptedPassword, function(err, isMatch) {
        // isMatch === true
        // console.log(isMatch);
        if(!isMatch) {
            req.flash("error", "Wrong password!");
            res.redirect("/personal/edit");
            return;
        };
    });

    if (newPassword.length < 6 || newPassword.match(/[0-9]/) === null){
        req.flash("error", "Your password must have at least one number");
        res.redirect("/signup");
        return;
    };

    if (newPassword !== confirmPassword){
        req.flash("error", "Enter the same password");
        res.redirect("personal/edit");
        return;
    };

    const salt = bcrypt.genSaltSync(10);
    const newEncryptedPassword = bcrypt.hashSync(newPassword, salt);

    User.findByIdAndUpdate(id, {encryptedPassword: newEncryptedPassword})
    .then(() => {
        console.log("did it");
        req.flash("success", "Password edited!");
        res.redirect("/personal/edit");
    })
    .catch((err) =>{
        console.log("problem");
        next(err);
    });
});

module.exports = router;






