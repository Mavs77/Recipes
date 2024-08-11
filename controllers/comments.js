// const Comment = require("../models/Comments");

// module.exports = {
//   createComment: async (req, res) => {
//     try {
//       await Comment.create({
//         comment: req.body.comment,
//         likes: 0,
//         post: req.params.id,
//       });
//       console.log("Comment has been added!");
//       res.redirect(`/post/${req.params.id}`);
//     } catch (err) {
//       console.log(err);
//       res.status(500).send("Failed to create comment.");
//     }
//   },
//   deleteComment: async (req, res) => {
//     try {
//       // Find post by id
//       const comment = await Comment.findById(req.params.id);
//       if (!comment) {return res.status(404).send("comment not found")}

//       //Get the post ID before deleting the comment
//       const postId = comment.post; 
//       // Delete comment from db
//       await Comment.deleteOne({ _id: req.params.id });
//       console.log("Deleted Comment");
//       res.redirect(`/post/${postId}`);
//     } catch (err) {
//       console.log(err);
//       res.status(500).send("Server Error");
//     }
//   }
// };

const Comment = require("../models/Comments"); // Import the Comment model to interact with the comments collection in the database.

module.exports = {
  // Method to handle the creation of a new comment
  createComment: async (req, res) => {
    try {
      // Create a new comment in the database with the data provided in the request
      await Comment.create({
        comment: req.body.comment, // The content of the comment comes from the request body
        likes: 0, // Initialize the number of likes to 0
        post: req.params.id, // Associate the comment with a specific post by storing the post ID (from the request parameters)
      });
      console.log("Comment has been added!"); // Log a message indicating the comment was successfully added
      res.redirect(`/post/${req.params.id}`); // Redirect the user back to the post page after the comment is added
    } catch (err) {
      console.log(err); // Log any errors that occur during the comment creation process
      res.status(500).send("Failed to create comment."); // Send a 500 status response if there is a server error
    }
  },

  // Method to handle the deletion of a comment
  deleteComment: async (req, res) => {
    try {
      // Find the comment in the database using the comment ID from the request parameters
      const comment = await Comment.findById(req.params.id);
      
      // If the comment does not exist, send a 404 status and a "Comment not found" message
      if (!comment) {
        return res.status(404).send("Comment not found");
      }
      
      // Store the ID of the post that this comment belongs to, so we can redirect back to it after deletion
      const postId = comment.post;

      // Delete the comment from the database
      await Comment.deleteOne({ _id: req.params.id });
      console.log("Deleted Comment"); // Log a message indicating the comment was successfully deleted

      // Redirect the user back to the post page after the comment is deleted
      res.redirect(`/post/${postId}`);
    } catch (err) {
      console.log(err); // Log any errors that occur during the comment deletion process
      res.status(500).send("Server Error"); // Send a 500 status response if there is a server error
    }
  }, 
   // Method to render the edit form for a comment
   editComment: async (req, res) => {
    try {
      // Extract comment ID from request parameters
      const commentId = req.params.id;

      // Extract new comment text and postId from request body
      const { comment, postId } = req.body;

      // Update the comment in the database
      await Comment.findByIdAndUpdate(commentId, { comment });

      console.log("Comment has been edited!");

      // Redirect to the post page where the comment was made
      res.redirect(`/post/${postId}`);
    } catch (err) {
      console.log(err);
      res.status(500).send("Failed to edit comment.");
    }
  },
};





