const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

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

app.use(cors());

// Routes
const user = require("./routes/user");
const product = require("./routes/product");

app.use("/user", user);
app.use("/product", product);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
