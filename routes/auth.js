const express = require('express')
const passport = require('passport')
const bcrypt = require('bcrypt')
const User = require('../models/User')
const {route} = require("express/lib/router");
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login')
});

router.post('/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login'
    })
)

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', async (req, res) => {
    const { username, password, email } = req.body

   try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username: username,
            password: hashedPassword,
            email: email
        })

       await newUser.save()

       res.redirect('/auth/login')
   }
   catch (error) {
       console.log(error)
   }
})


router.get('/logout', (req, res) => {

        req.logout((err) => {
            if(err) {
                console.error(err);
                return res.status(500).send('Server Error')
            }
        });

        res.redirect('/')

})


module.exports = router;
