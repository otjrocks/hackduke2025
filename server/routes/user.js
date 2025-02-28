const express = require('express');
const router = express.Router();
const cookieParser = require('cookie-parser');
const User = require('../models/user');
var jwt = require('jsonwebtoken');
const passport = require('passport');

router.use(cookieParser());


router.post("/register", function (req, res) { 
  // Extract domain from email
  const emailDomain = req.body.email.split("@")[1];
  
  // Allow only @duke.edu emails
  if (emailDomain !== "duke.edu") {
    return res.json({ success: false, message: "Currently, Campus Closet is only allows Duke University email addresses (@duke.edu)." });
  }

  User.register(new User({ email: req.body.email, username: req.body.username, campus: "Duke University" }), req.body.password, async function (err, user) {
    if (err) { 
        // Check if the email is already taken
        const findEmail = await User.findOne({ email: req.body.email });
        if (findEmail) {
            res.json({ success: false, message: "This email is already associated with an account." });
        } else {
            // Check if the username is already taken
            const findUsername = await User.findOne({ username: req.body.username });
            if (findUsername) {
                res.json({ success: false, message: "This username is already taken." });
            } else {
                res.json({ success: false, message: "Invalid password." });
            }
        }
    } else { 
        req.login(user, (er) => { 
            if (er) { 
                res.json({ success: false, message: "Invalid username or password, try again" });
            } else { 
                res.json({ success: true, message: "Your account has been saved" });
            }
        }); 
    }
}); 
 
}); 


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
                      secure: false // use with HTTPS only
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
  res.json({ success: true, message: 'Logout successful' })
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


module.exports = router;
