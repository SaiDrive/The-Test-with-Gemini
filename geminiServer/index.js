const {
    GoogleGenerativeAI,
    GoogleAIFileManager
} = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);
const fileManager = new GoogleAIFileManager(apiKey);

// ... (uploadToGemini and waitForFilesActive functions remain the same)

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    systemInstruction: "The user will provide some text or images that contain text information, our job is to analyse his or her understanding by providing a mutiple choice questions, based on his or her configuration, number of questions to generate, number of options to generate along with a valid answer index value, and the any one of the test hardness level Easy or Medium or Hard.",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
    responseSchema: { // ... (same schema as before)
    }
};

async function generateQuestions(files, numQuestions, numOptions, level) {
    try {
        const parts = [];

        // Add file parts
        files.forEach(file => {
            parts.push({
                fileData: {
                    mimeType: file.mimeType,
                    fileUri: file.uri
                }
            });
        });

        // Add text prompt with configuration
        parts.push({
            text: `Analyse the data provided through text or images, and \
generate - ${numQuestions} questions,\
generate - ${numOptions} options each,\
generate - index value of the correct answer\
level - ${level}`
        });

        const result = await model.generateContent({
            contents: [{ parts: parts }],
            generationConfig: generationConfig
        });

        if (result.response && result.response.text) {
          console.log(result.response.text())
            return JSON.parse(result.response.text);
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
    const files = [
        await uploadToGemini("Screenshot 2024-12-12 at 12.01.30 PM.png", "image/png"),
        await uploadToGemini("CroatMedJ_56_0169.pdf", "application/pdf")
    ];

    await waitForFilesActive(files);

    const questionsEasy = await generateQuestions([files[0]], 5, 4, "Easy");
    if (questionsEasy) {
        console.log("Easy Questions:", JSON.stringify(questionsEasy, null, 2));
    }

    const questionsMedium = await generateQuestions([files[0],files[1]], 5, 4, "Medium");
    if (questionsMedium) {
        console.log("Medium Questions:", JSON.stringify(questionsMedium, null, 2));
    }

    const questionsHard = await generateQuestions([files[1]], 10, 2, "Hard");
    if (questionsHard) {
        console.log("Hard Questions:", JSON.stringify(questionsHard, null, 2));
    }
}

run();