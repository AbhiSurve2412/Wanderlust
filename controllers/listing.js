const Listing = require("../models/listing"); 

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("./Listings/index.ejs", { allListings });
};

module.exports.search = async (req, res) => {
    let country = req.query.country;
    console.log(country);
    try {
        let allListings = await Listing.find({ country: country });
        if(allListings.length === 0){
            req.flash('error',"Sorry,No Service available in this country....!");
            return res.redirect("/Listings");
        }
        res.render("./Listings/search.ejs", { allListings,country});
    }catch (e) {
        req.flash("error", "Invalid Category");
        res.render("error", { error: e });
    }    
};

module.exports.renderNewForm =  (req, res) => {
    res.render("./Listings/new.ejs");
}; 

module.exports.category = async (req, res,next) => {
    const isValidMongoID = (id) => {
        const objectIdPattern = /^[0-9a-fA-F]{24}$/;
        return objectIdPattern.test(id);
    };
    let { category } = req.params;
    if(!isValidMongoID(category))
    {
        try {
            category = category.charAt(0).toUpperCase() + category.slice(1);
            let allListings = await Listing.find({ category: category });
            return res.render("./Listings/category.ejs", { allListings,category});
        }catch (e) {
            req.flash("error", "Invalid Category");
            res.render("error", { error: e });
        }    
    }
    else{
        next();
    }
};

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    let list = await Listing.findById(id)
      .populate({ path: "review", populate: { path: "author" },})
      .populate("owner");
    if (!list) {
      req.flash("error", "Listing you requested for is deleted");
      return res.redirect("/listings");
    }
    res.render("./Listings/show.ejs", { list });
};

module.exports.createListing = async (req, res) => {
    let newList = new Listing(req.body.listing);
    let url = req.file.path;
    let filename = req.file.filename;
    newList.owner = req.user._id;
    newList.image = {url, filename};
    console.log(newList);
    await newList.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const List = await Listing.findById(id);
    if (!List) {
      req.flash("error", "Listing you requested for is deleted");
      return res.redirect("/listings");
    }
    let originalUrl = List.image.url;
    originalUrl = originalUrl.replace(/\/upload/g, "/upload/h_300,w_250");
    res.render("./Listings/edit.ejs", { List,originalUrl});
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }
    req.flash("success", "Listing Updated");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    console.log("Deleting listing with ID:", id);
    const result = await Listing.findByIdAndDelete(id);
    console.log("Deleted listing result:", result);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};


