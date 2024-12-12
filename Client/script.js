const hideElement = (element) => {
  element.classList.add("display-none");
};

// script.js
function typeText(element, text, speed = 50) {
  let i = 0;
  const timer = setInterval(() => {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
    } else {
      clearInterval(timer);
    }
  }, speed);
  return timer; // Important: Return the timer ID
}

const loadingText = document.getElementById("loadingText");
typeText(loadingText, "loading..."); // Use the function
setTimeout(() => {
  hideElement(loadingText);
}, 2000);
