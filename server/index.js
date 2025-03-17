const express = require("express");
const passport = require('passport');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { S3Client, PutObjectCommand, CreateMultipartUploadCommand, UploadPartCommand, CompleteMultipartUploadCommand } = require("@aws-sdk/client-s3");
require("dotenv").config(); // Ensure you have your AWS credentials in .env
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
  allowedHeaders: "Content-Type,Authorization",
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


// Routes
const user = require("./routes/user");
const product = require("./routes/product");
const theme = require("./routes/theme");

app.use("/user", user);
app.use("/product", product);
app.use("/theme", theme);

// AWS S3 Configuration
const s3 = new S3Client({
  region: "us-east-2", // Set your AWS region
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

app.post("/upload", async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const fileBuffer = req.file.buffer;
    const fileName = `${Date.now()}-${req.file.originalname}`;
    const fileSize = req.file.size;
    
    const s3Params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      ContentType: req.file.mimetype,
    };

    if (fileSize <= 5 * 1024 * 1024) {
      // Use regular PutObjectCommand for files <= 5MB
      await s3.send(new PutObjectCommand({ ...s3Params, Body: fileBuffer }));
    } else {
      // Multipart Upload for large files
      const multipartUpload = await s3.send(new CreateMultipartUploadCommand(s3Params));

      const chunkSize = 5 * 1024 * 1024; // 5MB per chunk
      const numParts = Math.ceil(fileSize / chunkSize);
      const parts = [];

      for (let partNumber = 1; partNumber <= numParts; partNumber++) {
        const start = (partNumber - 1) * chunkSize;
        const end = Math.min(start + chunkSize, fileSize);
        const partBuffer = fileBuffer.slice(start, end);

        const uploadPart = await s3.send(
          new UploadPartCommand({
            Bucket: BUCKET_NAME,
            Key: fileName,
            UploadId: multipartUpload.UploadId,
            PartNumber: partNumber,
            Body: partBuffer,
          })
        );

        parts.push({ PartNumber: partNumber, ETag: uploadPart.ETag });
      }

      // Complete Multipart Upload
      await s3.send(
        new CompleteMultipartUploadCommand({
          Bucket: BUCKET_NAME,
          Key: fileName,
          UploadId: multipartUpload.UploadId,
          MultipartUpload: { Parts: parts },
        })
      );
    }

    const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;

    console.log("File Uploaded:", fileUrl);
    res.json({ success: true, fileUrl });

  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
});


// Start Server
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
