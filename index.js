require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { authMiddleware } = require("./middleware");
const connectDB = require("./db");
const User = require("./models/User");
const Post = require("./models/Post");

connectDB();

const app = express();
app.use(express.json());
app.use(express.static("public"));

// GET all blogs
app.get("/allBlogs", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching blogs" });
  }
});

// SIGNUP
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;
    const userExists = await User.findOne({ username });
    if (userExists) {
      return res.status(411).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error signing up" });
  }
});

// SIGNIN
app.post("/signin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(404).json({ message: "Invalid password" });
    }
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
    );
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error signing in" });
  }
});

// CREATE BLOG
app.post("/createBlog", authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    const newPost = new Post({
      title,
      description,
      userId: req.userId,
    });
    await newPost.save();
    res.status(201).json({ message: "Blog created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error creating blog" });
  }
});

// UPDATE BLOG
app.put("/updateBlog/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "You are not the owner" });
    }
    post.title = title || post.title;
    post.description = description || post.description;
    await post.save();
    res.status(200).json({ message: "Blog updated successfully", post });
  } catch (error) {
    res.status(500).json({ message: "Error updating blog" });
  }
});

// DELETE BLOG
app.delete("/deleteBlog/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.userId.toString() !== req.userId) {
      return res.status(403).json({ message: "You are not the owner" });
    }
    await Post.findByIdAndDelete(id);
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting blog" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
