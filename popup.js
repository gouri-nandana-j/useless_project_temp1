document.getElementById('lockdown-btn').addEventListener('click', () => {
  chrome.runtime.sendMessage({action: 'activate_lockdown'});
  window.close();
});
