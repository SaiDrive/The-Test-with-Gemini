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
}, 2000);

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
  const testId = Math.floor(10000 + Math.random() * 90000); // Generate 5-digit unique ID

  const data = {
    testId: testId,
    noOfQustons: noOfQustons,
    noOfOptions: noOfOptions,
    hardness: hardness,
    Document:
      testTextarea.value ||
      (testFileUpload.files.length > 0 ? "File Uploaded" : ""), // Handle file upload case
  };

  fetch("YOUR_API_ENDPOINT", {
    // Replace with your API URL
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((responseData) => {
      console.log("Success:", responseData);
      // Handle successful API call (e.g., display a success message)
    })
    .catch((error) => {
      console.error("Error:", error);
      // Handle API error (e.g., display an error message)
    });
});
