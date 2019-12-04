require("dotenv").config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Comment = require('./models/comment');
const User= require('./models/user');
const seedDB = require('./seeds');
const flash = require('connect-flash');

//REQUIRING ROUTES
const commentRoutes = require('./routes/comments'),
	  campgroundRoutes = require('./routes/campgrounds'),
	  indexRoutes = require('./routes/index');




mongoose.connect('mongodb+srv://dylanoh:1234@cluster0-iiqlt.mongodb.net/test?retryWrites=true&w=majority', {useNewUrlParser: true, useFindAndModify: false, useCreateIndex: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname+'/public'));
app.use(methodOverride('_method'));
app.use(flash());
// seedDB();  //SEED THE DATABASE

//PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret: 'Once again Rusty wins cutest dog!',
	resave: false,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');

	next();
});

app.use(indexRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);
app.use('/campgrounds', campgroundRoutes);



app.listen('3001', ()=>{
	console.log('YelpCamp has started!');
});