import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Officer from '../models/Officer.js';

const router = express.Router();

// @route   POST /api/auth/login
// @desc    Authenticate officer & get token
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find officer
    const officer = await Officer.findOne({ username });
    if (!officer) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, officer.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create JWT payload
    const payload = {
      officer: {
        id: officer.id,
        username: officer.username,
        role: officer.role,
      },
    };

    // Sign token
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: { id: officer.id, username: officer.username, role: officer.role },
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;