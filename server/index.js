const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const multer = require('multer');
const MongoStore = require("connect-mongo");

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

const corsOptions = {
  origin: process.env.CLIENT_URL, // (https://your-client-app.com)
  credentials: true
};

app.use(cors(corsOptions)); // TODO: CHANGE DANGEROUS 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Multer configuration to handle file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Save files in the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname); // Use the current timestamp as the filename
  }
});

const upload = multer({ storage: storage });


const session = require('express-session');


app.use(
  session({
    secret: "your-secret",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_API_URL }),
    cookie: { secure: true, sameSite: "none" },
  })
);

app.use(cors({
  origin: 'https://hackduke2025.vercel.app', // Allow only your frontend
  credentials: true, // Allow cookies/auth headers
}));

// Routes
const user = require("./routes/user");
const product = require("./routes/product");
const theme = require("./routes/theme");

app.use("/user", user);
app.use("/product", product);
app.use("/theme", theme);

// Post route for file upload
app.post("/upload", upload.single('image'), (req, res) => {
  console.log(req.file); // Log the uploaded file object
  if (req.file) {
    res.json({ success: true, fileUrl: `/uploads/${req.file.filename}` }); // Respond with the file URL
  } else {
    res.status(400).json({ success: false, message: "Unable to add file" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
