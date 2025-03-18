const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const User = require('../models/user');
var jwt = require('jsonwebtoken');
const passport = require('passport');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

router.use(cookieParser());


const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


// Function to validate password strength
function isStrongPassword(password) {
  const minLength = 8;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return password.length >= minLength && regex.test(password);
}

router.post("/register", async function (req, res) {
  try {
    const { email, username, password } = req.body;

    // Extract domain from email
    const emailDomain = email.split("@")[1];

    // Allow only @duke.edu emails
    if (emailDomain !== "duke.edu") {
      return res.json({ success: false, message: "Currently, only Duke users are allowed (email ending in @duke.edu)." });
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
      return res.json({ success: false, message: "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character." });
    }

    // Check if email is already taken
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.json({ success: false, message: "This email is already associated with an account." });
    }

    // Check if username is already taken
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.json({ success: false, message: "This username is already taken." });
    }

    // Register user
    User.register(new User({ email, username, campus: "Duke University" }), password, (err, user) => {
      if (err) {
        return res.json({ success: false, message: "Error registering user." });
      }

      // Login in user
      passport.authenticate("local", function (err, u, info) { 
        if (err) { 
            res.json({ success: false, message: "Error with authentication" }); 
        } 
        else { 
            if (!user) { 
                res.json({ success: false, message: "Incorrect username or password." }); 
            } 
            else { 
                const token = jwt.sign({ userId: user._id, username: username }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" }); 
                // Configure the `token` HTTPOnly cookie
                let options = {
                    maxAge: 1000 * 60 * 60 * 24, // expire after 24 hours
                    httpOnly: true, // Cookie will not be exposed to client side code
                    sameSite: "Strict", // If client and server origins are different
                    secure: process.env.SECURE // use with HTTPS only
                }
                res.cookie( "token", token, options );
                res.json({ success: true, message: "Authentication successful" }); 
            } 
        } 
    })(req, res); 
    });
  } catch (error) {
    return res.json({ success: false, message: "An error occurred. Please try again." });
  }
});

module.exports = router;



router.post("/login", function (req, res) { 
  if (!req.body.email) { 
      res.json({ success: false, message: "Email was not given" }) 
  } 
  else if (!req.body.password) { 
      res.json({ success: false, message: "Password was not given" }) 
  }
  else { 
      passport.authenticate("local", function (err, user, info) { 
          if (err) { 
              res.json({ success: false, message: "Error with authentication" }); 
          } 
          else { 
              if (!user) { 
                  res.json({ success: false, message: "Incorrect username or password." }); 
              } 
              else { 
                  const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: "24h" }); 
                  // Configure the `token` HTTPOnly cookie
                  let options = {
                      maxAge: 1000 * 60 * 60 * 24, // expire after 24 hours
                      httpOnly: true, // Cookie will not be exposed to client side code
                      sameSite: "Strict", // If client and server origins are different
                      secure: process.env.SECURE // use with HTTPS only
                  }
                  res.cookie( "token", token, options );
                  res.json({ success: true, message: "Authentication successful" }); 
              } 
          } 
      })(req, res); 
  } 
}); 

router.get("/logout", function (req, res) {  
  res.cookie('token', '', {maxAge: 0})
  res.redirect(process.env.CLIENT_URL + "/")
})

router.get("/userinfo", function (req, res) {
  const token = req?.cookies?.token
  if (!token) {
      res.json({ success: false, authenticated: false, message: "Unauthorized"})
  } else {
      decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      User.findOne({_id: decoded.userId })
          .then((user) => {
              res.json({success: true, authenticated: true, email: user.email, username: user.username, id: user._id, user: {
                email: user.email, 
                nickname: user.username,
                name: user.username,
              }})
          })
          .catch((err) => {
              res.json({success: false, authenticated: false, message: "Invalid user token."})
              console.log(err);
          });
  }
});


router.post('/forgot', async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({success: false, message: 'No user with that email'});
        }

        // Generate a reset token
        const token = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 7200000; // 2 hours

        await user.save();

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USER,
            subject: process.env.WEBSITE_NAME + ' Password Reset',
            text: `You are receiving this because you (or someone else) have requested the reset of the password for your ${process.env.WEBSITE_NAME} account.\n\n` +
                `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                `${process.env.CLIENT_URL}/reset/${token}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n`
        };

        await transporter.sendMail(mailOptions);
        res.json({success: true, message: 'An e-mail has been sent to ' + user.email + ' with further instructions.'});
    } catch (err) {
        console.log(err);
        res.json({success: false, message: 'Server Error, try again later.'});
    }
});


// post to reset password after email has been sent with token
router.post('/reset/:token', async (req, res) => {
    try {
        const user = await User.findOne({
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.json({success: false, message: 'Password reset token is invalid or has expired.'});
        }
        if (req.body.password === req.body.confirm) {
            await user.setPassword(req.body.password);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            await user.save();
            res.json({success: true, message: 'Password has been reset successfully.'});
        } else {
            res.json({success: false, message: 'Passwords do not match.'});
        }
    } catch (err) {
        res.json({sucess: false, message: 'Server error, try again later.'});
    }
});


module.exports = router;
