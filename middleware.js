const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const { listingSchema,reviewSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError.js");


module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in to create a new List");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) =>{
    const { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
      req.flash("error","You are not an Owner!!!!");
      return  res.redirect(`/listings/${id}`);
    }
    next();
};

// Listing server-side validation
module.exports.validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
      let errMsg = error.details.map((el) => el.message).join(",");
      next(new ExpressError(400, errMsg));
    } else {
      next();
    }
  };

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    next(new ExpressError(400, errMsg)); // Use next() to pass errors to the error handler
  } else {
    next();
  }
};

module.exports.isReviewAuthor = async (req, res, next) =>{
  const { id,reviewId} = req.params;
  let review = await Review.findById(reviewId);
  if(!review.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not an Author!!!!");
    return  res.redirect(`/listings/${id}`);
  }
  next();
};