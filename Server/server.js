const express = require("express");
const admin = require("firebase-admin");
const multer = require("multer");
const { run } = require("./index.js");
const { processImagesFromServer } = require("./geminiApi");
const path = require("path");
const cors = require("cors");
const fs = require("fs").promises; // Use fs.promises for async file operations
const app = express();
const port = 3000;

app.use(cors());
// Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert('path/to/your/serviceAccountKey.json')
// });

// const db = admin.firestore();

const imagesDir = path.join(__dirname, "data", "uploads");
const dataDir = path.join(__dirname, "data"); // Define the data directory path

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Endpoint to handle file uploads and prompt
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

    // Write the questionsObj to data.json
    try {
      await fs.writeFile(dataFilePath, JSON.stringify(questionsObj, null, 2));
      console.log(`Data saved to ${dataFilePath}`);
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
// app.get("/data", async (req, res) => {
//   try {
//     const snapshot = await db.collection("yourCollectionName").get();
//     const data = [];
//     snapshot.forEach((doc) => {
//       data.push(doc.data());
//     });
//     res.json(data);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Error fetching data");
//   }
// });

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
