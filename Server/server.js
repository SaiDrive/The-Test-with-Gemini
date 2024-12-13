const express = require("express");
const admin = require("firebase-admin");
const multer = require("multer");
const { run } = require("./index.js"); // Assuming index.js is in the same directory
const { processImagesFromServer } = require("./geminiApi"); // Assuming geminiApi.js is in the same directory
const path = require("path");
const cors = require("cors");
const fs = require("fs").promises;
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json()); // To parse JSON request bodies

// Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert('path/to/your/serviceAccountKey.json')
// });

// const db = admin.firestore();

const imagesDir = path.join(__dirname, "data", "uploads");
const dataDir = path.join(__dirname, "data");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/submit", upload.array("files"), async (req, res) => {
  try {
    let reqOptions;
    const { textData, testId, noOfQuestion, noOfOptions, hardness } = req.body;
    if (textData) {
      reqOptions = [textData, "text", noOfOptions, noOfOptions, hardness];
    } else {
      const files = req.files.map((eachFile) => eachFile.path);
      reqOptions = [files, "image", noOfOptions, noOfOptions, hardness];
    }

    const questionsData = await run(reqOptions);
    const { questions } = JSON.parse(questionsData);
    const questionsObj = {
      id: Math.floor(10000 + Math.random() * 90000),
      questions,
    };

    const dataFilePath = path.join(dataDir, "data.json");

    let existingData = [];
    try {
      const rawData = await fs.readFile(dataFilePath, "utf-8");
      existingData = JSON.parse(rawData);
      if (!Array.isArray(existingData)) {
        existingData = [];
      }
    } catch (err) {
      // If file doesn't exist or is empty/invalid, start with an empty array
      console.log("data.json not found, creating an empty array");
    }

    const newData = [...existingData, questionsObj]; // Append the new data

    try {
      await fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2));
      console.log(`Data appended to ${dataFilePath}`);
    } catch (err) {
      console.error(`Error writing to data.json: ${err}`);
      return res.status(500).send("Error saving data to file");
    }

    res.send({ questionsData });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
});

app.get("/getquestions", async (req, res) => {
  const testId = parseInt(req.query.testId, 10); // Get testId from query params and parse it as int

  if (isNaN(testId)) {
    return res.status(400).send("Invalid testId. Must be a number.");
  }

  try {
    const dataFilePath = path.join(dataDir, "data.json");
    const rawData = await fs.readFile(dataFilePath, "utf-8");
    const jsonData = JSON.parse(rawData);

    if (!Array.isArray(jsonData)) {
      return res.status(404).send("No data found");
    }

    const foundData = jsonData.find((item) => item.id === testId);

    if (foundData) {
      res.json(foundData);
    } else {
      res.status(404).send("Test questions not found for the provided ID");
    }
  } catch (err) {
    console.error(`Error reading from data.json: ${err}`);
    return res.status(500).send("Error reading from data file");
  }
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/data", async (req, res) => {
  try {
    const dataFilePath = path.join(dataDir, "data.json");
    const rawData = await fs.readFile(dataFilePath, "utf-8");
    const jsonData = JSON.parse(rawData);
    res.json(jsonData);
  } catch (err) {
    console.error(`Error reading from data.json: ${err}`);
    return res.status(500).send("Error reading from data file");
  }
});

// Example of a simple "add data" endpoint (adjust as needed)
// app.post("/addData", async (req, res) => {
//   try {
//     const data = {
//       // Your data fields here
//       name: "John Doe",
//       age: 30,
//     };
//     await db.collection("yourCollectionName").add(data);
//     res.send("Data added successfully");
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error adding data");
//   }
// });

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
