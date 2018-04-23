const express = require('express');
const router  = express.Router();
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.gmail_user,
    pass: process.env.gmail_pass
  }
});

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('home');
});



router.get("/contact", (req, res, next) => {
  res.render('contact-page');
});

router.post("/process-contact", (req, res, next) => {
  // sender, senderEmail, message
  console.log("je suis là");
  const {sender, senderEmail, message} = req.body;
  console.log(req.body);
  // const link = `http://localhost:3000/auth/confirm/${hashUsername}/${email}`
  transport.sendMail({
    from: "Your website <website@example.com>",
    to: process.env.gmail_user,
    subject: `${sender} is trying to contact you`,
    text: `
      Name: ${sender}
      Email: ${senderEmail}
      Message: ${message}
      Welcome on our website, click on the link to confirm your email:  
    `,
    html: `
      <img src="https://cdn-images-1.medium.com/max/1920/1*e35LkwPQGqxRoB4dCWCh4g.png" width="100px"/>
      <h1>Contact Form Message</h1>
      <p>Name: <b>${sender}</b></p>
      <p>Email: ${senderEmail}</p>
      <p>Message: ${message}</p>
      `
    
  })
  .then(() => {
    res.redirect('/');
  })
  .catch((err) => {
    next(err);
  });
});

router.get('/about', (req, res, next) => {
  res.render('about');
})

module.exports = router;
