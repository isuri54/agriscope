import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  // Get token from Authorization header (Bearer <token>)
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if token exists
  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    // Verify token using your secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded officer info to the request
    req.officer = decoded.officer;

    // Proceed to the next middleware/route handler
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};

export default auth;