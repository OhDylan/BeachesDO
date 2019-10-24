const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const passport = require('passport');
const User = require('../models/user');

router.get('/',(req, res)=>{
	res.render('landing');
});




//show register form
router.get('/register', (req,res)=>{
	res.render('register');
});

//handle sign up logic
router.post('/register', (req,res)=>{
	const newUser = new User({
		username: req.body.username,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		avatar: req.body.avatar
	});
	if(req.body.adminCode === "dylanassigned"){
		newUser.isAdmin = true;
	}
	User.register(newUser, req.body.password, (err, user)=>{
		if(err){
			req.flash('error', err.message);
			return res.render('register');
		} 
		passport.authenticate('local')(req, res, ()=>{
			req.flash('success', 'Successfully signed up! Welcome, ' + newUser.username);
			res.redirect('/campgrounds');
		});
	});
});

//show login form
router.get('/login',(req,res)=>{
	res.render('login');
});

//handling login logic
//app.post('/login',middleware,callback)
router.post('/login', passport.authenticate('local',
	{
		successRedirect: '/campgrounds',
		failureRedirect: '/login'
	}), (req,res)=>{
});

//logout route
router.get('/logout', (req,res)=>{
	req.logout();
	req.flash('success', 'Logged You Out!');
	res.redirect('/campgrounds');
});

//USER PROFILE
router.get("/users/:id", (req,res)=>{
	User.findById(req.params.id, (err, foundUser)=>{
		if(err){
			req.flash("error", "Something went wrong");
			res.redirect("/");
		} 
		Campground.find().where("author.id").equals(foundUser._id).exec((err, campgrounds)=>{
			if(err){
				req.flash("error", "Something went wrong");
				res.redirect("/");
			} 
			res.render("users/show", {user: foundUser, campgrounds: campgrounds});
		})
		
	})
})




module.exports = router;