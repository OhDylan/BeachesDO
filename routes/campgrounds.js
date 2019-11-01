const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const Comment = require('../models/comment');
const middleware = require('../middleware/index.js');
var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);




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
	
	
//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res){
	// get data from form and add to campgrounds array
	var name = req.body.name;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	geocoder.geocode(req.body.location, function (err, data) {
	  if (err || !data.length) {
		req.flash('error', 'Invalid address');
		return res.redirect('back');
	  }
	  var lat = data[0].latitude;
	  var lng = data[0].longitude;
	  var location = data[0].formattedAddress;
	  var newCampground = {name: name, image: image, description: desc, author:author, location: location, lat: lat, lng: lng};
	  // Create a new campground and save to DB
	  Campground.create(newCampground, function(err, newlyCreated){
		  if(err){
			  console.log(err);
		  } else {
			  //redirect back to campgrounds page
			  console.log(newlyCreated);
			  res.redirect("/campgrounds");
		  }
	  });
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