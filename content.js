// If already injected, do nothing
if (!window.__uselessTabLockerInjected) {
  window.__uselessTabLockerInjected = true;

  // Listen for messages from background to activate/deactivate overlay
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'activate_lockdown') {
      showOverlay();
    } else if (msg.action === 'deactivate_lockdown') {
      removeOverlay();
    }
  });

  let overlay = null;
  let clickCount = 0;

  function showOverlay() {
    if (overlay) return;
    overlay = document.createElement('div');
    overlay.id = 'useless-tab-locker-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'linear-gradient(135deg, #232526 0%, #414345 100%)';
    overlay.style.zIndex = '999999999';
    overlay.style.display = 'flex';
    overlay.style.flexDirection = 'column';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.color = '#f5f5f5';
    overlay.style.fontSize = '1.1rem';
    overlay.style.fontFamily = 'Inter, Arial, sans-serif';
    overlay.innerHTML = `
      <form id="useless-form" style="background:#222;box-shadow:0 4px 24px rgba(0,0,0,0.3);border-radius:12px;padding:2rem 2.5rem;display:flex;flex-direction:column;gap:1rem;min-width:300px;max-width:90vw;">
        <div style="font-size:1.3rem;font-weight:600;text-align:center;margin-bottom:0.5rem;">Welcome to the Useless Project!</div>
        <label style="display:flex;flex-direction:column;gap:0.3rem;">Name: <input name="name" required style="padding:0.5rem;border-radius:6px;border:1px solid #444;background:#333;color:#f5f5f5;"></label>
        <label style="display:flex;flex-direction:column;gap:0.3rem;">What are you currently studying? <input name="study_status" required style="padding:0.5rem;border-radius:6px;border:1px solid #444;background:#333;color:#f5f5f5;"></label>
        <label style="display:flex;flex-direction:column;gap:0.3rem;">List your achievements (if any): <input name="achievements" style="padding:0.5rem;border-radius:6px;border:1px solid #444;background:#333;color:#f5f5f5;"></label>
        <label style="display:flex;flex-direction:column;gap:0.3rem;">What do you want to achieve in your life? <input name="life_goal" required style="padding:0.5rem;border-radius:6px;border:1px solid #444;background:#333;color:#f5f5f5;"></label>
        <label style="display:flex;flex-direction:column;gap:0.3rem;">Do you have any relationship? <select name="relationship" style="padding:0.5rem;border-radius:6px;border:1px solid #444;background:#333;color:#f5f5f5;"><option value="yes">Yes</option><option value="no">No</option></select></label>
        <label style="display:flex;flex-direction:column;gap:0.3rem;">How is your college life going? <input name="college_life" required style="padding:0.5rem;border-radius:6px;border:1px solid #444;background:#333;color:#f5f5f5;"></label>
        <button type="submit" style="margin-top:0.5rem;font-size:1.1rem;padding:0.7rem 0;border-radius:6px;background:#3a3f47;color:#fff;border:none;cursor:pointer;transition:background 0.2s;">Submit</button>
      </form>
      <div id="useless-result" style="margin-top:2rem;white-space:pre-line;max-width:90vw;"></div>
    `;
    document.body.appendChild(overlay);
    clickCount = 0;
    document.getElementById('useless-form').onsubmit = function(e) {
      e.preventDefault();
      const form = e.target;
      const name = form.name.value;
      const study_status = form.study_status.value;
      const achievements = form.achievements.value;
      const life_goal = form.life_goal.value;
      const relationship = form.relationship.value;
      const college_life = form.college_life.value;
      let result = `\n--- Useless Project Result ---\n\n`;
      result += `Hello ${name},\n`;
      result += `You're currently studying ${study_status}, but let's be honest, does it even matter?\n`;
      if (achievements.trim()) {
        result += `You say your achievements are: ${achievements}. But in the grand scheme, do they really count?\n`;
      } else {
        result += `No achievements? Well, that's not surprising.\n`;
      }
      result += `You hope to achieve '${life_goal}', but the world is a tough place and dreams often remain just that—dreams.\n`;
      if (relationship.toLowerCase() === "yes") {
        result += `At least you have a relationship, but happiness is fleeting, isn't it?\n`;
      } else {
        result += `No relationship? Loneliness is a faithful companion.\n`;
      }
      result += `Your college life is '${college_life}', but soon it'll just be a memory, probably not a good one.\n`;
      result += `\nIn summary: Life is hard, dreams are distant, and nothing really matters. Have a nice day!\n`;
      document.getElementById('useless-form').style.display = 'none';
      // Accept button logic
      const minAccepts = 20, maxAccepts = 30;
      const requiredAccepts = Math.floor(Math.random() * (maxAccepts - minAccepts + 1)) + minAccepts;
      let acceptCount = 0;
      document.getElementById('useless-result').innerHTML = result + `<br><button id="accept-btn" style="margin-top:2rem;font-size:1.1rem;padding:0.7rem 2rem;border-radius:6px;background:#3a3f47;color:#fff;border:none;cursor:pointer;transition:background 0.2s;">Accept</button>`;
      document.getElementById('accept-btn').onclick = function() {
        acceptCount++;
        if (acceptCount < requiredAccepts) {
          this.textContent = `Accept`; //Check later for englarging the button/ additional text
        } else {
          this.textContent = 'Unlocking...';
          setTimeout(() => {
            removeOverlay();
            chrome.runtime.sendMessage({action: 'task_completed'});
          }, 400);
        }
      };
    };
  }

  function removeOverlay() {
    if (overlay) {
      overlay.remove();
      overlay = null;
    }
  }
}
