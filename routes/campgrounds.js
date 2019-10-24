const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware/index.js');
//INDEX ROUTE, SHOW ALL CAMPGROUNDS

router.get('/', (req,res)=>{
	if(req.query.search){
		const regex = new RegExp(escapeRegex(req.query.search), 'gi');
		Campground.find({name: regex},(err, allcampgrounds)=>{
			if(err){
				console.log(err);
			} else {
					res.render('campgrounds/index', {campgrounds : allcampgrounds}); 
				}
		});
	}else{
		//GET ALL CAMPGROUNDS FROM DATABASE
		Campground.find({},(err, allcampgrounds)=>{

			if(err){
				console.log(err);
			} else {
				res.render('campgrounds/index', {campgrounds : allcampgrounds});
			}

		});
	}
	
});
	
	
// CREATE ROUTE, ADD NEW CAMPGROUND TO DB

router.post('/', middleware.isLoggedIn, (req,res)=>{
	const name=req.body.name ;
	const image=req.body.image;
	const desc=req.body.description;
	const price=req.body.price;
	const author={
		id: req.user._id,
		username: req.user.username
	}
	const newCampground = {name:name, image:image, description:desc, author: author, price:price}
	Campground.create(newCampground, (err, newlyCreated)=>{
		if(err){
			console.log(err);
		} else {
			res.redirect('/campgrounds');
		}
		
	});
});
	


//NEW, SHOW FORM TO CREATE NEW CAMPGROUND
router.get('/new', middleware.isLoggedIn, (req,res)=>{
	
	res.render('campgrounds/new');
});

router.get('/:id', (req,res)=>{
	//find the campground with provided ID
	Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			res.render('campgrounds/show', {campground: foundCampground});
		}
	});
});
	//render show templat with that campground

	
	
//EDIT CAMPGROUND ROUTE 
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req,res)=>{
	Campground.findById(req.params.id, (err, foundCampground)=>{
		res.render('campgrounds/edit', {campground: foundCampground});
	});
});
	
		
	
	//if not, redirect
	


//UPDATE CAMPGROUND ROUTE
router.put('/:id', middleware.checkCampgroundOwnership, (req,res)=>{
	//find and update the correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
		if(err){
			res.redirect('/campgrounds');
		} else {
			req.flash('success', 'Campground edited');
			res.redirect('/campgrounds/'+ req.params.id);
		}
	});
});


//DESTROY CAMPGROUND ROUTE
router.delete('/:id', middleware.checkCampgroundOwnership, (req,res)=>{
	Campground.findByIdAndRemove(req.params.id, (err)=>{
		if(err){
			res.redirect('/campgrounds');
		} else {
			req.flash('success', 'Campground deleted');
			res.redirect('/campgrounds');
		}
	});	
});

function escapeRegex(text){
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}


module.exports = router;