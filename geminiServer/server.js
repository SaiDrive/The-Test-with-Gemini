const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT;
const genApiKey = process.env.GEMINI_API;
console.log(genApiKey);
