const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt')
const User = require('./models/User')



// Initialize Express

const app = express();


// Configure middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.use(session({
    secret: '123456',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'ejs');


// Connect to the MongoDB

mongoose.connect('mongodb://localhost/e-commerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Passport.js configuration

passport.use(
    new LocalStrategy(async (username, password, done) => {

        try {
            const user = await User.findOne({username});
            if (!user) return done(null, false)

            const isMatch = await bcrypt.compare(password, user.password);
            if(isMatch) return done(null, user)

            return done(null, false)
        }
        catch (error) {
            return done(error)
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id)
});

passport.deserializeUser(async (id, done) => {
 try {
     const user = await User.findById(id);
     done(null, user)
 }
 catch (error) {
     done(error)
 }
})


// Routes
const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth')
const productsRouter = require('./routes/products')
const cartRouter = require('./routes/cart')


app.use('/', indexRouter)
app.use('/auth', authRouter)
app.use('/products', productsRouter)
app.use('/cart', cartRouter)


// Start the server
app.listen(3000, () => {
    console.log('Server started on port 3000')
})
