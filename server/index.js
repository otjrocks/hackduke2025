const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require('cookie-parser');

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
  origin: "http://localhost:3000",//(https://your-client-app.com)
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json()) //Add it first then others follow
app.use(express.urlencoded({ extended: true }))

app.use(require('cookie-parser')());
// Routes
const user = require("./routes/user");
const product = require("./routes/product");

app.use("/user", user);
app.use("/product", product);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
