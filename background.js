async function enableLockdown() {
  // Check storage to see if lockdown is already active. This is crucial
  // because the script can restart and lose its variables.
  const { lockdownActive } = await chrome.storage.session.get('lockdownActive');
  if (lockdownActive) {
    // console.log("Lockdown is already active.");
    return; // Don't run if already active.
  }

  console.log("Useless Lockdown: Activating...");
  
  // 1. Set the state in chrome.storage.session so it persists.
  await chrome.storage.session.set({ lockdownActive: true });

  // 2. Query all tabs to lock them.
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    // We still check for special URLs.
    if (tab.id && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
      // 3. Send the message with an error handler.
      // The empty callback function with a check for chrome.runtime.lastError
      // "handles" the error, preventing it from being logged to the console.
      chrome.tabs.sendMessage(tab.id, { action: 'activate_lockdown' }, () => {
        if (chrome.runtime.lastError) {
          // This error is expected for tabs that can't be scripted (e.g., web store).
          // We can ignore it or log a custom message.
        }
      });
    }
  }
}

//AUTOMATIC TRIGGERS

// 1. Activate when the extension is first installed or updated.
chrome.runtime.onInstalled.addListener(() => {
  enableLockdown();
});

// 2. Activate every time the browser starts up.
chrome.runtime.onStartup.addListener(() => {
  enableLockdown();
});

// 3. Ensure any new tabs opened or navigated to are also locked.
// The listener callback is async to allow for 'await'.
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  // Check the persistent state from storage.
  const { lockdownActive } = await chrome.storage.session.get('lockdownActive');

  // If lockdown is on and the tab has finished loading, lock it.
  if (lockdownActive && changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    chrome.tabs.sendMessage(tabId, { action: 'activate_lockdown' }, () => {
      if (chrome.runtime.lastError) { /* Error handled */ }
    });
  }
});

//LISTEN FOR TASK COMPLETION

// Listen for the 'task_completed' message from any content script.
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'task_completed' && sender.tab && sender.tab.id) {
    console.log(`Useless Lockdown: Unlocking single tab with ID: ${sender.tab.id}`);
    
    // Unlock only the tab that sent the message.
    chrome.tabs.sendMessage(sender.tab.id, { action: 'deactivate_lockdown' }, () => {
      if (chrome.runtime.lastError) { /* Error handled */ }
    });
  }
  
  return true; 
});