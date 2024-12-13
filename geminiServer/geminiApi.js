const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyB3SDHwDHQrXJZ2H-Ls4pXx_XOSxehTuMY");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

// const prompt = "Explain how AI works";

// Wrap in an async function
// async function generateContent() {
//     try {
//         const result = await model.generateContent(prompt);
//         console.log(result.response.text());
//     } catch (error) {
//         console.error("Error generating content:", error);
//     }
// }

async function generateContentWithMultipleImages(imageBlobs) {
  try {
    const parts = [];

    // Add a text prompt
    parts.push({ text: "Describe these images." });

    // Add image parts
    imageBlobs.forEach((imageBlob) => {
      parts.push({
        inline_data: {
          data: imageBlob, // Base64 encoded image data
          mime_type: "image/jpeg", // Or 'image/png'
        },
      });
    });

    const request = {
      contents: [{ parts: parts }],
    };

    const result = await model.generateContent(request);
    console.log(result.response.text());
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

const fs = require("fs");
const path = require("path");

// Function to process images stored on the server
async function processImagesFromServer(imageFilePaths) {
  const imageBlobs = [];

  for (const imagePath of imageFilePaths) {
    try {
      // Read the image file and convert it to a Base64 string
      const imageBuffer = fs.readFileSync(path.resolve(__dirname, imagePath));
      const base64Image = imageBuffer.toString("base64");
      imageBlobs.push(base64Image);
    } catch (error) {
      console.error(`Error reading file ${imagePath}:`, error);
    }
  }

  await generateContentWithMultipleImages(imageBlobs);
}

processImagesFromServer(["./image.png", "./image1.png"]);

module.exports = { processImagesFromServer };

// generateContent();
