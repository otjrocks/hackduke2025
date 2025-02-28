const jwt = require('jsonwebtoken');
const User = require('./models/user');  // Adjust the path as necessary

// Middleware to check if the user is authenticated and return user info
const checkAuthentication = (req, res, next) => {
    const token = req.cookies.token; // Assuming token is stored in cookies

    if (!token) {
        return res.json({ success: false, authenticated: false, message: "Unauthorized" });
    }

    try {
        // Verify the token and decode it
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        
        // Find the user by decoded userId
        User.findOne({ _id: decoded.userId })
            .then((user) => {
                if (!user) {
                    return res.json({ success: false, authenticated: false, message: "User not found." });
                }

                // Attach user data to req.user so it can be accessed by other middleware or routes
                req.user = {
                    email: user.email,
                    username: user.username,
                    id: user._id,
                    name: user.username // Customize as per your requirements
                };

                // Proceed to the next middleware or route handler
                next();
            })
            .catch((err) => {
                console.log(err);
                return res.json({ success: false, authenticated: false, message: "Invalid user token." });
            });
    } catch (err) {
        console.log(err);
        return res.json({ success: false, authenticated: false, message: "Failed to verify token." });
    }
};

module.exports = checkAuthentication;
