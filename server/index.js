const express = require("express");

const PORT = process.env.PORT || 3001;
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});