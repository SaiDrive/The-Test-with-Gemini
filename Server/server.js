const express = require("express");
const multer = require("multer");
const { run } = require("./index.js");
const path = require("path");
const cors = require("cors");
const fs = require("fs").promises;
const {
  db,
  collection,
  addDoc,
  doc,
  setDoc,
  ref,
  uploadBytes,
  getDownloadURL,
  storage,
  updateDoc,
  getDocs,
  getDoc,
} = require("./firebase.config");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const imagesDir = path.join(__dirname, "data", "uploads");

const storageConfig = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imagesDir);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, fileExtension);
    cb(null, `${baseName}-${Date.now()}${fileExtension}`);
  },
});

const upload = multer({ storage: storageConfig });

app.post("/generate", upload.array("files"), async (req, res) => {
  try {
    let reqOptions;
    const { textData, testId, noOfQuestion, noOfOptions, hardness } = req.body;

    const files = req.files ? req.files.map((eachFile) => eachFile.path) : [];

    if (textData) {
      reqOptions = [textData, "text", noOfQuestion, noOfOptions, hardness];
    } else if (files.length > 0) {
      const fileTypes = files.every((file) =>
        file.toLowerCase().endsWith(".pdf")
      )
        ? "pdf"
        : "image";
      reqOptions = [files, fileTypes, noOfQuestion, noOfOptions, hardness];
    } else {
      return res.status(400).send("No text or files provided");
    }
    const questionsData = await run(reqOptions);
    const { questions } = JSON.parse(questionsData);

    const questionsObj = {
      id: testId,
      questions,
    };

    res.send({ questionsObj });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
});
app.post("/submitTest", upload.array("files"), async (req, res) => {
  try {
    const testId = req.query.testId;
    const { questions } = req.body;

    const files = req.files ? req.files.map((eachFile) => eachFile.path) : [];
    const uploadedFiles = await Promise.all(
      (req.files || []).map(async (file) => {
        const filePath = file.path;
        const fileName = file.filename;
        const fileBuffer = await fs.readFile(filePath);

        // Upload to Firebase Storage
        const storageRef = ref(storage, `test-images/${testId}/${fileName}`);
        const snapshot = await uploadBytes(storageRef, fileBuffer);
        const imageUrl = await getDownloadURL(snapshot.ref);

        // Delete local image file after it's been uploaded to storage
        await fs.unlink(filePath);

        return imageUrl;
      })
    );
    const testData = {
      testId: testId,
      questions: questions,
      images: uploadedFiles,
    };

    await setDoc(doc(db, "tests", testId), testData, { merge: true });

    res.send({ message: "success" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
});
app.post("/regenerate", upload.array("files"), async (req, res) => {
  try {
    let reqOptions;
    const { textData, testId, noOfQuestion, noOfOptions, hardness } = req.body;
    const files = req.files ? req.files.map((eachFile) => eachFile.path) : [];

    if (textData) {
      reqOptions = [textData, "text", noOfQuestion, noOfOptions, hardness];
    } else if (files.length > 0) {
      const fileTypes = files.every((file) =>
        file.toLowerCase().endsWith(".pdf")
      )
        ? "pdf"
        : "image";
      reqOptions = [files, fileTypes, noOfQuestion, noOfOptions, hardness];
    } else {
      return res.status(400).send("No text or files provided");
    }
    const questionsData = await run(reqOptions);
    const { questions } = JSON.parse(questionsData);
    const questionsObj = {
      id: testId,
      questions,
    };
    res.send({ id: testId, questions });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal server error");
  }
});
app.get("/getquestions", async (req, res) => {
  const testId = req.query.testId;

  if (!testId) {
    return res.status(400).send("Test ID is required.");
  }
  try {
    const docRef = doc(db, "tests", testId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return res.status(404).send("Test not found.");
    }
    const data = docSnap.data();

    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Error fetching from Firestore");
  }
});
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
