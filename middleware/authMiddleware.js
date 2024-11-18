const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access Denied! No token provided.' });
    }

    const decoded = jwt.verify(token, 'your_jwt_secret_key');
    req.user = decoded; 
    next();
  } catch (err) {
    console.error('Authentication Error:', err.message);
    res.status(401).json({ error: 'Invalid or expired token!' });
  }
};

module.exports = authMiddleware;
