const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Reviews = require('./reviews.js');

const listingSchema = new Schema({
    title : {
        type : String,
        required : true,
    },
    description : String,
    image : {
        url : String,
        filename : String,
    },
    price : Number,
    location : String,
    country : String,
    review : [{
        type : Schema.Types.ObjectId,
        ref : "Review"
    }],
    owner : {
        type : Schema.Types.ObjectId,
        ref : "User"
    },
    category : {
        type : String,
        enum : ["Trending","Room","Iconiccities","Mountains","Castles","Amazingpools","Camping","Farms","Arctic"],
        required :false,
    }
});

listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing)
    {
        await Reviews.deleteMany({_id : {$in : listing.review}});
    }
});

const Listing = mongoose.model('Listing',listingSchema);

module.exports = Listing;