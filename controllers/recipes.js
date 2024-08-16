const cloudinary = require("../middleware/cloudinary");
const Recipe = require("../models/Recipe");
const Favorite = require("../models/Favorite");


//ignore
const Comment = require("../models/Comments");

module.exports = {
  getProfile: async (req, res) => {
    try {
      //since we have a session each request (req) contains the logged-in user info: req.user 
      //console.log(req.user) to see everything 
      //Grabbing just the posts of the logged-in user
      const recipes = await Recipe.find({ user: req.user.id });
      //Sending data from mongodb and user data to ejs template
      res.render("profile.ejs", { recipes, user: req.user }); 
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  },
  getFavorites: async (req, res) => {
    try {
      //since we have a session each request (req) contains the logged-in user info: req.user 
      //console.log(req.user) to see everything 
      //Grabbing just the posts of the logged-in user
      const recipes = await Favorite.find({ user: req.user.id }).populate('recipe');
      //Sending data from mongodb and user data to ejs template
      res.render("favorites.ejs", { recipes: recipes, user: req.user }); 
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  },
  getFeed: async (req, res) => {
    try {
      //since we have a session, each request contains the logged in user's info: req.user
      //grabbing just the posts of the logged in user
      //console.log(req.user) to see everything 
      const recipes = await Recipe.find().sort({ createdAt: "desc" }).lean();
      //sendig post data from mongodb and user data to ejs emplate 
      res.render("feed.ejs", { recipes });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  },

  getRecipe: async (req, res) => {
    try {
      //id parameter comes from the post routes
      //router.get("/:id", ensureAuth, postsController.getPost); 
      const recipes = await Recipe.findById(req.params.id);
      const comments = await Comment.find({ post: req.params.id }).sort({ createdAt: "desc" }).lean();
      res.render("recipes.ejs", { recipes, user: req.user, comments });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  },

  //media is stored in cloudinary - the above request responds w/ URL to media and media id that we will need when deleting content 
  createRecipe: async (req, res) => {
    try {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      // we are consolidating data from many different sources (cloudinary, mongo, form, passport) and uploading it tour database. 
      await Recipe.create({
        name: req.body.name,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        ingredients: req.body.ingredients,
        directions: req.body.directions,
        likes: 0,
        user: req.user.id,
      });
      console.log("Recipe has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
      console.log('make sure all fields in your post entry are filled. Images included. No Exceptions!!!!')
      res.status(500).send("Server Error");
    }
  },
  favoriteRecipe: async (req, res) => {
    try {
      // we are consolidating data from many different sources (cloudinary, mongo, form, passport) and uploading it tour database. 
      await Favorite.create({
        user: req.user.id,
        recipe: req.params.id,
      });
      console.log("Recipe has been favorited!");
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  },
  likeRecipe: async (req, res) => {
    try {
      await Recipe.findByIdAndUpdate(
        req.params.id,
        { $inc: { likes: 1 } }
      );
      console.log("Likes +1");
      res.redirect(`/recipe/${req.params.id}`);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  },
  deleteRecipe: async (req, res) => {
    try {
      // Find post by id
      const recipe = await Recipe.findById(req.params.id);

      // Delete image from Cloudinary
      await cloudinary.uploader.destroy(Recipe.cloudinaryId);

      // Delete post from db
      await Recipe.deleteOne({ _id: req.params.id });
      console.log("Deleted Recipe");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  },
};


// Exported Methods:
// getProfile: Fetches and renders posts for the logged-in user.
// getFeed: Fetches and renders all posts.
// getPost: Fetches and renders a single post.
// createPost: Uploads an image to Cloudinary and creates a new post.
// likePost: Increments the like count of a post.
// deletePost: Deletes a post and its image from Cloudinary.