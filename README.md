Crafting AI-driven Quizz using ‘Gemini 2.0 Flash’

This Project is a product of the “Google Build and Blog Marathon” which happened on the 12 & 13th of December in Google, Bangalore Kyoto West Office

Harnessing AI to Elevate TestCreation
Artificial intelligence (AI) is revolutionizing the way we create and consume content. This blog post guides you through a hands-on Node.js project to build a web application backend that leverages AI to automate text, PDF, and image processing for generating engaging quizzes.

Issue:
It’s always been an issue to prepare tests for students by any teacher, it's a tedious job to do, and the tests need to be prepared meticulously based on topics they taught.

Since, the era of AI Gemini 2.0, has abilities beyond our imagination, I thought to use some capabilities of this AI to save precious time for any educational institution to focus more on education quality instead burdened with these tedious tasks.

Project Overview: Dynamic Quiz Generation from Images, PDFs, and Text

This project simplifies quiz creation by:

Accepting text or images or PDFs as input.
Utilizing AI to generate quiz questions, options, and answers based on difficulty levels.
Providing a streamlined method for managing and retrieving quiz data from a Firebase Firestore database.
We’ll delve into the project’s architecture, backend implementation, and key endpoints, empowering you to recreate and extend this foundation for your creative endeavors.

Features:

File Upload Support: Users can effortlessly upload text, multiple images, or PDF files for quiz generation.
AI Integration: Both text and images are seamlessly processed by a Gemini 2.0 Flash AI model for crafting quiz questions and answers.
Data Management: Firebase Firestore serves as the trusty database for storing and retrieving quiz-related data.
Tech Stack:

Node.js: The backend framework orchestrating the project’s operations.
Express: Responsible for routing requests and handling middleware.
Multer: Facilitates efficient file upload handling.
Firebase Firestore: The NoSQL database for storing and managing quiz data.
Gemini AI 2.0 API: This API interacts with the AI model to process uploaded data and generate quiz content.
File Structure:

project/
  |-- data/uploads/  # Stores uploaded files
  |-- index.js        # AI integration logic
  |-- geminiApi.js     # Manages communication with the AI API
  |-- server.js        # The main server file
  |-- package.json    # Project dependencies
  |-- src/
      |-- controllers/  # Controllers for managing data
      |-- models/     # Models representing data structures
      |-- routes/      # Routes for handling API requests



AI Integration Logic Breakdown

Setting Up Dependencies:
The code starts by importing the necessary libraries:

@google/generative-ai: Interacts with the Google Generative AI API for Gemini 2.0.
@google/generative-ai/server: Manages file uploads to Gemini.

dotenv: Loads environment variables for your API key.

fs: For file system operations.

path: For file path manipulation.

It retrieves your Gemini 2.0 API key from the .env file (ensure you create one and set the GEMINI_API_KEY variable).
It then initializes two objects:

genAI: Used to interact with the Generative AI API.

fileManager: Used to upload and manage files with Gemini.

File Upload Functionality:

The uploadToGemini function handles uploading files (images or PDFs) to Gemini:
It takes the file path and its mimeType as arguments.
It uses fileManager.uploadFile to upload the file, specifying the mimeType and a display name.
If successful, it returns the uploaded file information.
In case of errors, it logs an error message and returns null.
Waiting for File Processing:

The waitForFilesActive function handles waiting for uploaded files to be processed by Gemini:
It takes an array of uploaded files as input.
It iterates through each file and checks its processing state using fileManager.getFile.
If a file is still processing, it waits for 5 seconds and checks again.
While waiting, it displays a dot (.) to indicate progress.
It returns an array of only the active files (those that have finished processing).
If any file fails to become active, it logs an error and returns null.
AI Model Configuration:

The code defines the AI model to be used: gemini-2.0-flash-exp.
It also defines the generation config object, which specifies parameters for the AI generation process:

temperature: Controls the randomness of the generated text (higher = less random).
topP: Probability distribution over the most likely tokens to choose from.
top: Limits the number of possible tokens to consider at each step.
maxOutputTokens: Maximum number of tokens to generate in the response.
responseMimeType: Desired format of the response (here, JSON).
response schema: Defines the expected structure of the JSON response, including properties like questions, questions, options, and answers.


Generating Questions:
The generate questions function is the core of the AI integration:
It takes several arguments:
inputs: An array containing text, image paths, or PDF paths.
inputType: Indicates the type of input (text, image, or pdf).
numQuestions: Number of questions to generate.
numOptions: Number of options for each question.
level: Difficulty level (Easy, Medium, or Hard).
It first creates an empty parts array to hold the content for AI processing.
For image and PDF inputs:

It uses uploadToGemini to upload each input file to Gemini.
It calls waitForFilesActive to wait for the uploaded files to be processed.
If any upload or processing fails, it logs an error and returns null.
It iterates through the active files and adds them to the parts array, including their mimeType and URI.
For text input:

It directly adds the text to the parts array.
For any unsupported input type, it logs an error and returns null.
It then adds another part to the parts array, specifying the instructions for generating questions:
Analyze the provided data.
Generate the specified number of questions, options, and answer indices.
Set the difficulty level.
Finally, it uses the model.generateContent method to send the parts and configuration to Gemini for processing.
If the response is successful and contains JSON text, it attempts to parse the JSON and return the parsed question data.
Key Endpoints:

1. /submit (POST)

Accepts text or images as input.
Processes the input using the AI model.
Returns the generated quiz data.



UI:

You have two options either to create a test or participate in one
Let’s create one...

To create a test you can choose different file formats that include images with text, PDFs, or you can copy-paste the plain text itself to generate questions


Now you have options to configure the test as required, you can choose NoOf Questions, NoOfOptions per question, and difficulty level


You can preview or generate the test questions and save the ID to take the test for you or someone else


Enter the test ID to start your test and the results are displayed at the end


You can choose the valid answer and click next to for next question and can see the results at the end screen


To Take test

Results Screen
Optional:

The Enhancements are limitless, you can further provide the response tests in downloadable PDFs and make them available for offline testing.

You can further enhance the capabilities of this project by automation the correction process with a physical document and so on…

“Thanks to Ajay Raju, for being a wonderful teammate in this hackathon, this wouldn’t have been possible without his efforts.”

You can reach out to me on LinkedIn & check out my other works on GitHub.

To learn more about Google Cloud services and to create an impact for the work you do, get around to these steps right away:

Register for Code Vipassana sessions
Join the meetup group Datapreneur Social
Sign up to become a Google Cloud Innovator
Content Templates

Documentation

User Centricity
