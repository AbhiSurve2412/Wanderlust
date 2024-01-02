const User = require("../models/user");

module.exports.renderSignUpForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.signUp = async (req, res) => {
    try {
      let { username, email, password } = req.body;
      let newUser = new User({ username, email });
      let registerUser = await User.register(newUser, password);
      console.log(registerUser);
      req.login(registerUser,(err)=>{
        if(err){
          return next(err);
        }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/signup");
    }
};

module.exports.renderLogInForm =  (req, res) => {
    res.render("users/login.ejs");
};

module.exports.logIn = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
    let redirectUrl = "/listings";
    if(res.locals.redirectUrl)
    {
      redirectUrl = res.locals.redirectUrl;
    }
    res.redirect(redirectUrl);
};

module.exports.logOut = (req, res,next) => {
    req.logout((err)=>{
      if(err){
        return next(err);
      }
      req.flash("success", "You are logged out!");
      res.redirect("/listings");
    })
};