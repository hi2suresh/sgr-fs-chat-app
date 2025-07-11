import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
export const signup = async (req, res) => {
  // Handle signup logic here
  const { email, fullName, password } = req.body;
  console.log('Signup request received:', req.body);
  if (!email || !fullName || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    // Validate input data
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: 'Password must be at least 6 characters long' });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      email,
      fullName,
      password: hashedPassword,
    });
    if (newUser) {
      // generate jwt token
      generateToken(newUser._id, res);
      // Save user to the database
      await newUser.save();
      console.log('User created successfully:', newUser);
      return res.status(201).json({
        message: 'User created successfully',
        user: {
          id: newUser._id,
          email: newUser.email,
          fullName: newUser.fullName,
          profilePic: newUser.profilePic,
        },
      });
    } else {
      return res.status(400).json({ error: 'User creation failed' });
    }
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  // Handle login logic here
  const { email, password } = req.body;
  console.log('Login request received:', req.body);
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    // Generate JWT token
    generateToken(user._id, res);
    console.log('User logged in successfully:', user);
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        profilePic: user.profilePic,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const logout = (req, res) => {
  // Handle logout logic here
  try {
    // Clear the JWT token from the response
    res.cookie('jwt', '', { maxAge: 0 });
  } catch (error) {
    console.error('Logout error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
  res.json({ message: 'Logout successful' });
};

export const updateProfile = async (req, res) => {
  // Handle profile update logic here
  console.log('Profile update request received:', req.body);
  try {
    const { profilePic } = req.body;

    const userId = req.user.id;
    if (!profilePic) {
      return res.status(400).json({ error: 'Profile picture is required' });
    }
    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );
    res.status(200).json({
      message: 'Profile picture updated successfully',
      user: updatedUser,
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const checkAuth = (req, res) => {
  // Check if user is authenticated
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error('Check authcontroller error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
