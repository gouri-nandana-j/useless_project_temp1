// This variable will track the lockdown state.
let lockdownActive = false;

// --- Function to activate the lockdown and lock all existing tabs ---
function enableLockdown() {
  if (lockdownActive) return; // Don't run if already active
  console.log("Useless Lockdown: Activating...");
  lockdownActive = true;
  
  chrome.tabs.query({}, (tabs) => {
    for (const tab of tabs) {
      // Send the lockdown message to each tab
      if (tab.id && !tab.url.startsWith('chrome://')) {
        chrome.tabs.sendMessage(tab.id, {action: 'activate_lockdown'});
      }
    }
  });
}

// --- AUTOMATIC TRIGGERS ---

// 1. Activate when the extension is first installed or updated.
chrome.runtime.onInstalled.addListener(() => {
  enableLockdown();
});

// 2. Activate every time the browser starts up.
chrome.runtime.onStartup.addListener(() => {
  enableLockdown();
});

// 3. Ensure any new tabs opened or navigated to are also locked.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // If lockdown is active and the tab has finished loading, lock it.
  if (lockdownActive && changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    chrome.tabs.sendMessage(tabId, {action: 'activate_lockdown'});
  }
});

// --- Listen for the 'task_completed' message from any tab ---
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // Check if the message is 'task_completed' and that it came from a tab
  if (msg.action === 'task_completed' && sender.tab && sender.tab.id) {
    
    // THE FIX: Instead of unlocking all tabs, we only unlock the one that sent the message.
    console.log(`Useless Lockdown: Unlocking single tab with ID: ${sender.tab.id}`);
    chrome.tabs.sendMessage(sender.tab.id, { action: 'deactivate_lockdown' });
    
    // We intentionally DO NOT set lockdownActive to false here, because other tabs are still locked.
  }
});