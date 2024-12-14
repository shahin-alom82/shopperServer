import jwt from 'jsonwebtoken';

const adminAuth = async (req, res, next) => {
      try {
            const { token } = req.headers;

            if (!token) {
                  return res.json({ success: false, message: 'Not Authorized, try again!' });
            }

            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                  if (err) {
                        return res.json({ success: false, message: 'Invalid token, try again!' });
                  }
                  req.user = decoded;
                  next();
            });
      } catch (error) {
            console.log('Admin Auth Error', error);
            return res.json({ success: false, message: error?.message });
      }
};

export default adminAuth;



