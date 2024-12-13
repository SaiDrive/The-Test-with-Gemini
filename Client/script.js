const loadingOverlay = document.getElementById("loadingOverlay");
const loadingText = document.getElementById("loadingText");
const mainContent = document.getElementById("mainContent");
const createTestContainer = document.getElementById("createTestContainer");
const createTestOptionContainer = document.getElementById(
  "createTestOptionContainer"
);
const testTextarea = document.getElementById("testTextarea");
const testFileUpload = document.getElementById("testFileUpload");
const createTestNextBtn = document.getElementById("createTestNextBtn");
const backBtn = document.getElementById("backBtn");
const submitBtn = document.getElementById("submitBtn");
const questionCountInput = document.getElementById("questionCount");
const optionCountInput = document.getElementById("optionCount");
const difficultyRadios = document.querySelectorAll('input[name="difficulty"]');
const questionPreviewContainer = document.getElementById(
  "questionPreviewContainer"
);

const initialButtons = document.getElementById("initialButtons");
const takeTestButton = document.getElementById("takeTestButton");
const createTestButton = document.getElementById("createTestButton");
const takeTestContainer = document.getElementById("takeTestContainer");
const testIdInput = document.getElementById("testIdInput");
const startTestBtn = document.getElementById("startTestBtn");
const testQuestionContainer = document.getElementById("testQuestionContainer");
let questionsData;
let questionTypeSpeed = 50;
let optionDisplaySpeed = 200;
let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let testQuestions = [];
setTimeout(() => {
  loadingOverlay.style.display = "none";
  mainContent.style.display = "block";
}, 100);

testTextarea.addEventListener("input", () => {
  testFileUpload.disabled = testTextarea.value.trim() !== "";
});

testFileUpload.addEventListener("change", () => {
  testTextarea.disabled = testFileUpload.files.length > 0;
});
createTestButton.addEventListener("click", () => {
  initialButtons.style.display = "none";
  createTestContainer.style.display = "block";
});

takeTestButton.addEventListener("click", () => {
  initialButtons.style.display = "none";
  takeTestContainer.style.display = "block";
});
createTestNextBtn.addEventListener("click", () => {
  createTestContainer.style.display = "none";
  createTestOptionContainer.style.display = "block";
});

backBtn.addEventListener("click", () => {
  createTestOptionContainer.style.display = "none";
  createTestContainer.style.display = "block";
});
startTestBtn.addEventListener("click", () => {
  const testId = testIdInput.value;
  fetch("YOUR_API_ENDPOINT?testId=" + testId, {
    method: "GET",
  })
    .then((response) => response.json())
    .then((responseData) => {
      testQuestions = responseData;
      takeTestContainer.style.display = "none";
      displayTestQuestion();
    })
    .catch((error) => {
      testQuestions = [
        {
          id: 345,
          question: "What is the capital of France?",
          options: ["Berlin", "Madrid", "Paris", "Rome"],
          answer: 3,
        },
        {
          id: 346,
          question: "Which planet is known as the Red Planet?",
          options: ["Earth", "Mars", "Jupiter", "Saturn"],
          answer: 2,
        },
        {
          id: 347,
          question: "Who wrote 'Romeo and Juliet'?",
          options: ["Shakespeare", "Dickens", "Hemingway", "Fitzgerald"],
          answer: 1,
        },
        {
          id: 348,
          question: "What is the largest ocean on Earth?",
          options: ["Atlantic", "Pacific", "Indian", "Arctic"],
          answer: 2,
        },
        {
          id: 349,
          question: "What is the square root of 64?",
          options: ["6", "7", "8", "9"],
          answer: 3,
        },
      ];
      takeTestContainer.style.display = "none";
      displayTestQuestion();
      // Handle API error
    });
});

submitBtn.addEventListener("click", async () => {
  const noOfQustons = questionCountInput.value;
  const noOfOptions = optionCountInput.value;
  let hardness;
  difficultyRadios.forEach((radio) => {
    if (radio.checked) {
      hardness = radio.value;
    }
  });
  const testId = Math.floor(10000 + Math.random() * 90000);
  const formData = new FormData();

  formData.append("testId", testId); // Corrected: Only one testId
  formData.append("noOfQuestion", noOfQustons);
  formData.append("noOfOptions", noOfOptions);
  formData.append("hardness", hardness);

  if (testTextarea.value) {
    formData.append("textData", testTextarea.value);
  }

  if (testFileUpload.files.length > 0) {
    for (let i = 0; i < testFileUpload.files.length; i++) {
      formData.append("files", testFileUpload.files[i]);
    }
  }

  const options = {
    method: "POST",
    body: formData,
  };
  const response = await fetch("http://localhost:3000/submit", options);
  const { questionsData } = await response.json();
  const { questions } = JSON.parse(questionsData);
  displayQuestions(questions);
  createTestOptionContainer.style.display = "none"; // Hide option container
});

function displayQuestions(questions) {
  questionPreviewContainer.innerHTML = "";
  questionPreviewContainer.style.display = "block";

  questions.forEach((questionData, index) => {
    const questionContainer = document.createElement("div");
    questionContainer.classList.add("question-container");

    const questionText = document.createElement("p");
    questionText.textContent = `${index + 1}. ${questionData.question}`;
    questionContainer.appendChild(questionText);

    const optionsContainer = document.createElement("div");
    optionsContainer.classList.add("options-container");

    questionData.options.forEach((option, optionIndex) => {
      const optionElement = document.createElement("div");
      optionElement.classList.add("option");
      optionElement.textContent = option;
      optionsContainer.appendChild(optionElement);
    });

    questionContainer.appendChild(optionsContainer);

    const keyContainer = document.createElement("div");
    keyContainer.classList.add("key-container");
    keyContainer.textContent = `Key : ${questionData.answer}`;
    questionContainer.appendChild(keyContainer);

    questionPreviewContainer.appendChild(questionContainer);
  });
  const buttonContainer = document.createElement("div");
  const regenerateBtn = document.createElement("button");
  regenerateBtn.textContent = "Regenerate";
  regenerateBtn.classList.add("regenerate-btn");
  regenerateBtn.addEventListener("click", handleRegenerate);

  const submitTest = document.createElement("button");
  submitTest.textContent = "Submit Test";
  submitTest.classList.add("submit");
  submitTest.addEventListener("click", () => {
    console.log("submitted");
  });
  buttonContainer.appendChild(regenerateBtn);
  buttonContainer.appendChild(submitTest);
  questionPreviewContainer.appendChild(buttonContainer);
}

function handleRegenerate() {
  fetch("YOUR_API_ENDPOINT", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((responseData) => {
      questionsData = responseData;
      displayQuestions(responseData);
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle API error
    });
}

function displayTestQuestion() {
  testQuestionContainer.innerHTML = "";
  testQuestionContainer.style.display = "block";

  if (currentQuestionIndex < testQuestions.length) {
    const questionData = testQuestions[currentQuestionIndex];

    const questionContainer = document.createElement("div");
    questionContainer.classList.add("question-container", "fade-in");

    const questionText = document.createElement("p");
    questionContainer.appendChild(questionText);

    // Typewriter effect for the question
    typeWriter(
      questionText,
      `${currentQuestionIndex + 1}. ${questionData.question}`,
      0
    );

    const optionsContainer = document.createElement("div");
    optionsContainer.classList.add("options-container");
    let optionIndex = 0;
    const displayOption = () => {
      if (optionIndex < questionData.options.length) {
        const optionInput = document.createElement("input");
        optionInput.type = "radio";
        optionInput.name = `question-${currentQuestionIndex}`;
        optionInput.value = optionIndex + 1; // Correct answer will match this
        const optionLabel = document.createElement("label");
        optionLabel.textContent = questionData.options[optionIndex];
        // Wrap input and label in a div
        const optionDiv = document.createElement("div");
        optionDiv.classList.add("option", "fade-in");
        optionDiv.appendChild(optionLabel);
        optionDiv.appendChild(optionInput);
        // Add an event listener to the option div to select the radio button when clicked
        optionDiv.addEventListener("click", () => {
          optionInput.checked = true;
        });
        // Append the optionDiv to the container
        optionsContainer.appendChild(optionDiv);
        optionIndex++;
        // Recursively call displayOption with delay
        setTimeout(displayOption, optionDisplaySpeed);
      }
    };

    displayOption();

    questionContainer.appendChild(optionsContainer);
    testQuestionContainer.appendChild(questionContainer);

    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.classList.add("submit");
    nextButton.addEventListener("click", () => handleTestNext(questionData));
    testQuestionContainer.appendChild(nextButton);
  } else {
    testQuestionContainer.innerHTML = "";
    const resultDiv = document.createElement("div");
    resultDiv.textContent = `Test Complete! You answered ${correctAnswersCount} out of ${testQuestions.length} questions correctly.`;
    testQuestionContainer.appendChild(resultDiv);
  }
}
function handleTestNext(questionData) {
  const selectedOption = document.querySelector(
    `input[name="question-${currentQuestionIndex}"]:checked`
  );
  if (selectedOption) {
    const selectedAnswer = parseInt(selectedOption.value);
    if (selectedAnswer === questionData.answer) {
      correctAnswersCount++;
    }
    currentQuestionIndex++;
    displayTestQuestion();
  } else {
    alert("Please select an answer.");
  }
}
function typeWriter(element, text, charIndex) {
  if (charIndex < text.length) {
    element.textContent += text.charAt(charIndex);
    setTimeout(
      () => typeWriter(element, text, charIndex + 1),
      questionTypeSpeed
    );
  }
}
