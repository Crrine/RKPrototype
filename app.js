const os = require('os');

console.log("console log test");

// Demonstration of a function (os.freemem()) that is not available in a web browser
setInterval(function() {
  document.getElementById('freemem').textContent = os.freemem();
}, 500);
