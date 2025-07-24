//let chart;

function logDebug(message) {
  const debugOutput = document.getElementById('debug-output');
  const timestamp = new Date().toLocaleTimeString();
  //debugOutput.textContent += `[${timestamp}] ${message}\n`;

  if (debugOutput) {
    if (debugOutput.textContent === "No messages yet.") {
      debugOutput.textContent = "";
    }
    debugOutput.textContent += `[${timestamp}] ${message}\n`;
  } else {
    console.warn('Debug console element not found.');
  }
}

function resetZoom() {
  if (chart) {
    chart.resetZoom();
    logDebug("Reset the chart zoom.");
  }
}

function callBackendSanityCheck() {
  fetch('/sanity-check')
    .then(response => response.json())
    .catch(error => {
      logDebug(`Error calling sanity-check: ${error}`);
    });
}
