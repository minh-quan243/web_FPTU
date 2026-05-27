const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {

  // GET TOKEN
  const token =
    req.headers.authorization?.split(' ')[1];

  // NO TOKEN
  if (!token) {
    return res.status(401).json({
      message: 'No token'
    });
  }

  try {

    // VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // SAVE USER DATA
    req.user = decoded;

    next();

  } catch (err) {

    res.status(401).json({
      message: 'Invalid token'
    });
  }
};

module.exports = auth;