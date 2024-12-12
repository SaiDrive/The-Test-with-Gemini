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
  
  window.addEventListener('DOMContentLoaded', () => {
    const loadingText = document.getElementById('lodingText');
    typeText(loadingText, "Loding..."); // Use the function
  });