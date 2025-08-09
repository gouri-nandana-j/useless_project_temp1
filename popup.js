// Runs automatically when the popup opens.
chrome.runtime.sendMessage({action: 'activate_lockdown'});
window.close(); // Closes the popup immediately after sending the message