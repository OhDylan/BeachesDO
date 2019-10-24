var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");
 
var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere condimentum mi ac commodo. 			  Suspendisse ullamcorper scelerisque euismod. Nulla eu iaculis arcu, fermentum lacinia nisl. Nulla orci felis, varius non pretium sit amet, ornare sit amet quam. Morbi eu iaculis ipsum. Nam feugiat lobortis nisi, ut mattis mauris consequat non. Phasellus elementum lobortis ligula. Quisque a dui massa. Praesent hendrerit est ut magna facilisis fermentum vitae id ex. Aenean tempor ac leo vel pulvinar. Vivamus lacinia, ante nec dignissim suscipit, tellus dolor malesuada neque, eu auctor nisi dolor non tortor. In ex metus, viverra in ipsum eget, rhoncus congue erat. Maecenas facilisis, nibh quis fringilla laoreet, quam lorem hendrerit turpis, sit amet mollis libero nulla vitae odio. Phasellus massa erat, maximus malesuada maximus id, euismod sed lorem. Cras sit amet porttitor massa."
    },
    {
        name: "Desert Mesa", 
        image: "https://farm6.staticflickr.com/5487/11519019346_f66401b6c1.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere condimentum mi ac commodo. Suspendisse ullamcorper scelerisque euismod. Nulla eu iaculis arcu, fermentum lacinia nisl. Nulla orci felis, varius non pretium sit amet, ornare sit amet quam. Morbi eu iaculis ipsum. Nam feugiat lobortis nisi, ut mattis mauris consequat non. Phasellus elementum lobortis ligula. Quisque a dui massa. Praesent hendrerit est ut magna facilisis fermentum vitae id ex. Aenean tempor ac leo vel pulvinar. Vivamus lacinia, ante nec dignissim suscipit, tellus dolor malesuada neque, eu auctor nisi dolor non tortor. In ex metus, viverra in ipsum eget, rhoncus congue erat. Maecenas facilisis, nibh quis fringilla laoreet, quam lorem hendrerit turpis, sit amet mollis libero nulla vitae odio. Phasellus massa erat, maximus malesuada maximus id, euismod sed lorem. Cras sit amet porttitor massa."
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque posuere condimentum mi ac commodo. Suspendisse ullamcorper scelerisque euismod. Nulla eu iaculis arcu, fermentum lacinia nisl. Nulla orci felis, varius non pretium sit amet, ornare sit amet quam. Morbi eu iaculis ipsum. Nam feugiat lobortis nisi, ut mattis mauris consequat non. Phasellus elementum lobortis ligula. Quisque a dui massa. Praesent hendrerit est ut magna facilisis fermentum vitae id ex. Aenean tempor ac leo vel pulvinar. Vivamus lacinia, ante nec dignissim suscipit, tellus dolor malesuada neque, eu auctor nisi dolor non tortor. In ex metus, viverra in ipsum eget, rhoncus congue erat. Maecenas facilisis, nibh quis fringilla laoreet, quam lorem hendrerit turpis, sit amet mollis libero nulla vitae odio. Phasellus massa erat, maximus malesuada maximus id, euismod sed lorem. Cras sit amet porttitor massa."
    }
]
 
function seedDB(){
   //Remove all campgrounds
   Campground.deleteMany({}, function(err){
        if(err){
            console.log(err);
        }
        console.log("removed campgrounds!");
        Comment.deleteMany({}, function(err) {
            if(err){
                console.log(err);
            }
            console.log("removed comments!");
             //add a few campgrounds
            data.forEach(function(seed){
                Campground.create(seed, function(err, campground){
                    if(err){
                        console.log(err)
                    } else {
                        console.log("added a campground");
                        //create a comment
                        Comment.create(
                            {
                                text: "This place is great, but I wish there was internet",
                                author: "Homer"
                            }, function(err, comment){
                                if(err){
                                    console.log(err);
                                } else {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        });
    }); 
    //add a few comments
}
 
module.exports = seedDB;