const Comment = require("../models/Comments");

module.exports = {
  createComment: async (req, res) => {
    try {
      await Comment.create({
        comment: req.body.comment,
        likes: 0,
        post: req.params.id,
      });
      console.log("Comment has been added!");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
      res.status(500).send("Failed to create comment.");
    }
  },
  deleteComment: async (req, res) => {
    try {
      // Find post by id
      const post = await Comment.findById(req.params.id);
      // Delete comment from db
      await Comment.deleteOne({ _id: req.params.id });
      console.log("Deleted Comment");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  }
};




