const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Comment = require("../models/Comments");

module.exports = {
  getProfile: async (req, res) => {
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts, user: req.user });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  },

  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      res.render("feed.ejs", { posts });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({ post: req.params.id }).sort({ createdAt: "desc" }).lean();
      res.render("post.ejs", { post, user: req.user, comments });
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  },

  createPost: async (req, res) => {
    try {
      // Upload image to Cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  },

  likePost: async (req, res) => {
    try {
      await Post.findByIdAndUpdate(
        req.params.id,
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  },

  deletePost: async (req, res) => {
    try {
      // Find post by id
      const post = await Post.findById(req.params.id);

      // Delete image from Cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);

      // Delete post from db
      await Post.deleteOne({ _id: req.params.id });
      console.log("Deleted Post");
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