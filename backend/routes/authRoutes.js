const express = require('express');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const router = express.Router();

const User = require('../models/User');


// REGISTER
router.post('/register', async (req, res) => {

  try {

    const {
      name,
      email,
      password
    } = req.body;

    // CHECK EMAIL
    const existingUser =
      await User.findOne({ email });

    if (existingUser) {

      return res.status(400).json({
        message: 'Email already exists'
      });
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // CREATE USER
    const user = new User({

      name,

      email,

      password: hashedPassword

    });

    await user.save();

    res.json({

      message: 'Register success'

    });

  } catch (err) {

    res.status(500).json({

      message: 'Server error'

    });
  }
});


// LOGIN
router.post('/login', async (req, res) => {

  try {

    const {
      email,
      password
    } = req.body;

    // FIND USER
    const user =
      await User.findOne({ email });

    if (!user) {

      return res.status(400).json({

        message: 'User not found'

      });
    }

    // CHECK PASSWORD
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({

        message: 'Wrong password'

      });
    }
    // thiếu refresh endpoint và auto refresh ở frontend
    // ACCESS TOKEN
    const accessToken = jwt.sign(

      {
        id: user._id,
        role: user.role
      },

      process.env.JWT_SECRET,

      {
        expiresIn: '1d'
      }
    );

    // REFRESH TOKEN
    const refreshToken = jwt.sign(

      {
        id: user._id
      },

      process.env.REFRESH_SECRET,

      {
        expiresIn: '7d'
      }
    );

    // RESPONSE
    res.json({

      accessToken,

      refreshToken,

      user: {

        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role

      }

    });

  } catch (err) {

    res.status(500).json({

      message: err.message

    });
  }
});

module.exports = router;