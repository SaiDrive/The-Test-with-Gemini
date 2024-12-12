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
  const noOfQustons = questionCountInput.value;
  const noOfOptions = optionCountInput.value;
  let hardness;
  difficultyRadios.forEach((radio) => {
    if (radio.checked) {
      hardness = radio.value;
    }
  });
  const testId = Math.floor(10000 + Math.random() * 90000);
  const id = Math.floor(100000 + Math.random() * 90000);
  const formData = new FormData(); // Use FormData

  formData.append("testId", id);
  formData.append("testId", testId);
  formData.append("noOfQustons", noOfQustons);
  formData.append("noOfOptions", noOfOptions);
  formData.append("hardness", hardness);

  if (testTextarea.value) {
    formData.append("textData", testTextarea.value); // Send text data
  }

  if (testFileUpload.files.length > 0) {
    for (let i = 0; i < testFileUpload.files.length; i++) {
      formData.append("files", testFileUpload.files[i]); // Send files
    }
  }

  fetch("YOUR_API_ENDPOINT", {
    method: "POST",
    body: formData, // Send FormData
  })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("Success:", responseData);
      // Handle successful API call
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle API error
    });
});
