const express = require('express');
const bcrypt = require('bcryptjs');
const { mongoDb } = require('./db');
const { generateToken } = require('./utils/jwt');
const authMiddleware = require('./middleware/auth');

const router = express.Router();

// Models
const userSchema = require('./models/User');
const postSchema = require('./models/Post');
const messageSchema = require('./models/Message');

const User = mongoDb.model('User', userSchema);
const Post = mongoDb.model('Post', postSchema);
const Message = mongoDb.model('Message', messageSchema);

// Register Endpoint
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, name });
    await user.save();

    const token = generateToken(user._id.toString());
    res.status(201).json({ token, user: { id: user._id, email, name } });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login Endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id.toString());
    res.json({ token, user: { id: user._id, email, name: user.name } });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Get Profile Endpoint
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
});

// Update Profile Endpoint
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const updateData = { updatedAt: Date.now() };

    if (name) updateData.name = name;
    if (bio) updateData.bio = bio;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(req.userId, updateData, { new: true }).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
});

// Create Post Endpoint
router.post('/posts', authMiddleware, async (req, res) => {
  try {
    const { text, image } = req.body;

    if (!text) {
      return res.status(400).json({ message: 'Text is required for a post' });
    }

    const post = new Post({
      text,
      image: image || '',
      author: req.userId,
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create post', error: error.message });
  }
});

// Get Posts Feed Endpoint with Pagination
router.get('/posts', authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    res.json({
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch posts', error: error.message });
  }
});

// Send Message Endpoint
router.post('/messages', authMiddleware, async (req, res) => {
  try {
    const { receiverId, text } = req.body;

    if (!receiverId || !text) {
      return res.status(400).json({ message: 'Receiver ID and text are required' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    const message = new Message({
      text,
      sender: req.userId,
      receiver: receiverId,
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Failed to send message', error: error.message });
  }
});

// Get Messages with Specific User Endpoint
router.get('/messages', authMiddleware, async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    const messages = await Message.find({
      $or: [
        { sender: req.userId, receiver: userId },
        { sender: userId, receiver: req.userId },
      ],
    })
      .populate('sender', 'name avatar')
      .populate('receiver', 'name avatar')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
  }
});

module.exports = router;