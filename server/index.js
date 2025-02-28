const express = require("express");
const passport = require('passport');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const { put } = require("@vercel/blob");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const User = require('./models/user');
const LocalStrategy = require('passport-local').Strategy;


dotenv.config();

const PORT = process.env.PORT || 3001;
const mongoDB = process.env.MONGODB_API_URL;

// MongoDB setup
mongoose.set("strictQuery", false);
async function main() {
  await mongoose.connect(mongoDB);
  console.log("MongoDB connected");
}
main().catch(err => console.log("MongoDB connection error:", err));

const app = express();

// CORS Configuration
const corsOptions = {
  origin: process.env.CLIENT_URL, // Allow only your frontend
  credentials: true, // Allow cookies/auth headers
};
app.use(cors(corsOptions)); // Apply CORS early

// Built-in Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use("/uploads", express.static("uploads"));

// Session Store (MongoDB-based)
const store = new MongoDBStore({
  uri: process.env.MONGODB_API_URL,
  collection: "sessions",
});

store.on("error", function (error) {
  console.log("SESSION STORE ERROR:", error);
});

// Use express-session properly
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store, // Store sessions in MongoDB
  })
);

// Passport Middleware (AFTER session setup)
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({
  usernameField: 'email'
}, User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Multer Storage (for file uploads)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Routes
const user = require("./routes/user");
const product = require("./routes/product");
const theme = require("./routes/theme");

app.use("/user", user);
app.use("/product", product);
app.use("/theme", theme);

// Upload Route (File Uploads)
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const fileBuffer = req.file.buffer;
    const fileName = `${Date.now()}-${req.file.originalname}`;

    // Upload file to Vercel Blob
    const blob = await put(fileName, fileBuffer, {
      access: "public", // Makes the file publicly accessible
    });

    console.log("File Uploaded:", blob.url);
    res.json({ success: true, fileUrl: blob.url });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
