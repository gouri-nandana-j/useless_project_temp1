let lockdownActive = false;

// Listen for popup activation
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'activate_lockdown') {
    lockdownActive = true;
    lockAllTabs();
  } else if (msg.action === 'deactivate_lockdown') {
    lockdownActive = false;
    unlockAllTabs();
  } else if (msg.action === 'task_completed') {
    // When a tab completes the task, unlock all tabs
    lockdownActive = false;
    unlockAllTabs();
  }
});

function lockAllTabs() {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {action: 'activate_lockdown'});
      }
    }
  });
}

function unlockAllTabs() {
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      if (tab.id) {
        chrome.tabs.sendMessage(tab.id, {action: 'deactivate_lockdown'});
      }
    }
  });
}
