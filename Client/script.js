const questions = [
  {
    question:
      "What is the result of the following arithmetic operation in JavaScript: (3 + 5) * 4 - 6?",
    options: ["26", "32", "30", "28"],
    answer: "1",
  },
  {
    question:
      "What is the value of x after this code executes: 'let x = 5; if (x > 3) { x = 10; } else { x = 0; }'?",
    options: ["5", "10", "3", "0"],
    answer: "2",
  },
  {
    question:
      "What value will 'result' hold after this switch case: 'let fruit = 'apple'; let result; switch (fruit) { case 'banana': result = 'yellow'; break; case 'apple': result = 'red'; break; default: result = 'unknown'; }'?",
    options: ["'yellow'", "'red'", "'apple'", "'unknown'"],
    answer: "2",
  },
  {
    question:
      "What will be the output of 'greet('Alice')' for the function: 'function greet(name) { return 'Hello, ' + name + '!'; }'?",
    options: [
      "'Hello, Alice!'",
      "'Hello, name!'",
      "'Hello, ' + name + '!'",
      "It will throw an error",
    ],
    answer: "1",
  },
  {
    question:
      "Given the code: 'let num = 7; let result; if (num > 5) { if (num < 10) { result = 'Between 5 and 10'; } else { result = 'Greater than 10'; } } else { result = 'Less than or equal to 5'; }', what is the value of 'result'?",
    options: [
      "'Less than or equal to 5'",
      "'Between 5 and 10'",
      "'Greater than 10'",
      "undefined",
    ],
    answer: "2",
  },
  {
    question:
      "What will 'calculate(3, 7)' return for the function: 'function calculate(a, b) { return (a * b) + (a / b); }'?",
    options: ["21.4285", "22", "24", "21"],
    answer: "1",
  },
];
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
let questionsData;
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

createTestNextBtn.addEventListener("click", () => {
  createTestContainer.style.display = "none";
  createTestOptionContainer.style.display = "block";
});

backBtn.addEventListener("click", () => {
  createTestOptionContainer.style.display = "none";
  createTestContainer.style.display = "block";
});

submitBtn.addEventListener("click", () => {
  createTestOptionContainer.style.display = "none"; // Hide option container

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
  formData.append("noOfQustons", noOfQustons);
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

  fetch("YOUR_API_ENDPOINT", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((responseData) => {
      questionsData = responseData;
      // displayQuestions(responseData);
    })
    .catch((error) => {
      displayQuestions(questions);

      // console.error("Error:", error);
      // Handle API error
    });
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
