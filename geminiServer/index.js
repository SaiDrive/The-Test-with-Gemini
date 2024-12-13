const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GoogleAIFileManager } = require("@google/generative-ai/server");
const dotenv = require("dotenv");
dotenv.config();

const fs = require('fs').promises;
const path = require('path');

const apiKey = process.env.GEMINI_API_KEY ; // Make sure you set this environment variable
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

async function uploadToGemini(filePath, mimeType) {
    try {
        const uploadResult = await fileManager.uploadFile(filePath, {
            mimeType,
            displayName: path.basename(filePath),
        });
        const file = uploadResult.file;
        console.log(`Uploaded file ${file.displayName} as: ${file.name}`);
        return file;
    } catch (error) {
        console.error("Error uploading file:", error);
        return null;
    }
}

async function waitForFilesActive(files) {
    if (!files || files.length === 0) return []; // Return empty array if no files
    console.log("Waiting for file processing...");
    const activeFiles = [];
    for (const file of files) {
        if (!file) continue;
        let currentFile = await fileManager.getFile(file.name);
        while (currentFile.state === "PROCESSING") {
            process.stdout.write(".");
            await new Promise((resolve) => setTimeout(resolve, 5000));
            currentFile = await fileManager.getFile(file.name);
        }
        if (currentFile.state !== "ACTIVE") {
            console.error(`File ${currentFile.name} failed to process with state: ${currentFile.state}`);
            return null; // Return null to indicate failure
        }
        activeFiles.push(currentFile);
    }
    console.log("...all files ready\n");
    return activeFiles; // Return array of active files
}


const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction: "The user will provide one or more images or one or more PDFs. Analyze the provided data and generate multiple choice questions based on the configuration: number of questions, number of options per question, correct answer index, and difficulty level (Easy, Medium, or Hard).",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
    responseSchema: {
        type: "object",
        properties: {
            questions: {
                type: "array",
                items: {
                    type: "object",
                    properties: {
                        question: { type: "string" },
                        options: { type: "array", items: { type: "string" } },
                        answer: { type: "number" }
                    },
                    required: ["question", "options", "answer"]
                }
            }
        },
        required: ["questions"]
    }
};

async function generateQuestions(inputs, inputType, numQuestions, numOptions, level) {
    try {
        const parts = [];
        let activeFiles = [];

        if (inputType === "image" || inputType === "pdf") {
            const uploadPromises = inputs.map(inputPath => uploadToGemini(inputPath, inputType === "image" ? "image/png" : "application/pdf"));
            const uploadedFiles = await Promise.all(uploadPromises);
            const validUploadedFiles = uploadedFiles.filter(file => file !== null); // Filter out failed uploads
            if (validUploadedFiles.length === 0 && inputs.length > 0) {
                console.error("All file uploads failed.");
                return null;
            }

            activeFiles = await waitForFilesActive(validUploadedFiles);
            if (!activeFiles) {
                console.error("Some files failed to become active.");
                return null;
            }

            activeFiles.forEach(file => {
                parts.push({
                    fileData: {
                        mimeType: file.mimeType,
                        fileUri: file.uri
                    }
                });
            });
        } else if (inputType === "text") {
            parts.push({ text: inputs });
        } else {
            console.error("Invalid input type. Must be 'text', 'image', or 'pdf'.");
            return null;
        }

        parts.push({
            text: `Analyse the data provided and generate - ${numQuestions} questions, generate - ${numOptions} options each, generate - index value of the correct answer, level - ${level}`
        });

        const result = await model.generateContent({
            contents: [{ parts }],
            generationConfig
        });

        if (result && result.response && result.response.text) {
            try {
                return JSON.parse(result.response.text);
            } catch (jsonError) {
                console.error("Error parsing JSON response:", jsonError);
                console.error("Raw response text:", result.response.text);
                return null;
            }
        } else {
            console.error("Unexpected API response:", result);
            return null;
        }
    } catch (error) {
        console.error("Error generating questions:", error);
        return null;
    }
}

async function run() {
    try {
        const imagePaths = [
            path.join(__dirname, 'Screenshot 2024-12-12 at 12.01.30 PM.png'),
            path.join(__dirname, 'Screenshot 2024-12-12 at 12.03.01 PM.png'),
        ];
        const pdfPaths = [
            path.join(__dirname, 'CroatMedJ_56_0169.pdf'),
        ];
        const textInput = "Today people expect advanced state-of-the-art diagnostic tools... (rest of your text)";

        const questionsFromText = await generateQuestions(textInput, "text", 3, 4, "Medium");
        if (questionsFromText) console.log("Questions from Text:\n", JSON.stringify(questionsFromText, null, 2));

        const questionsFromImages = await generateQuestions(imagePaths, "image", 4, 2, "Easy");
        if (questionsFromImages) console.log("Questions from Images:\n", JSON.stringify(questionsFromImages, null, 2));

        const questionsFromPdfs = await generateQuestions(pdfPaths, "pdf", 5, 4, "Hard");
        if (questionsFromPdfs) console.log("Questions from PDFs:\n", JSON.stringify(questionsFromPdfs, null, 2));
    } catch (error) {
        console.error("A top-level error occurred:", error);
    }
}

run();