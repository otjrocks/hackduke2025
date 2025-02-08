const express = require("express");

const PORT = process.env.PORT || 3001;
const dotenv = require('dotenv');
const mongoose = require("mongoose");

dotenv.config();

// mongoose setup
mongoose.set("strictQuery", false);
const mongoDB = process.env.MONGODB_API_URL;
main().then(console.log("MongoDB connected")).catch((err) => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}


const app = express();

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});