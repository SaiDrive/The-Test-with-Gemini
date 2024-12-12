const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyB3SDHwDHQrXJZ2H-Ls4pXx_XOSxehTuMY");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

const prompt = "Explain how AI works";

// Wrap in an async function
async function generateContent() {
    try {
        const result = await model.generateContent(prompt);
        console.log(result.response.text());
    } catch (error) {
        console.error("Error generating content:", error);
    }
}
console.log("Hi");

generateContent();
