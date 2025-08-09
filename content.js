// If already injected, do nothing
if (!window.__uselessTabLockerInjected) {
  window.__uselessTabLockerInjected = true;

  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === 'activate_lockdown') {
      showOverlay();
    } else if (msg.action === 'deactivate_lockdown') {
      removeOverlay();
    }
  });

  let overlay = null;
  let countdownInterval = null;

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
    overlay.style.fontFamily = 'Inter, Arial, sans-serif';

    const blockerType = Math.floor(Math.random() * 4);

    switch (blockerType) {
      case 0:
        createFormBlocker(overlay);
        break;
      case 1:
        createUpdateBlocker(overlay);
        break;
      case 2:
        createVirusBlocker(overlay);
        break;
      case 3:
        createExplosionBlocker(overlay);
        break;
    }

    document.body.appendChild(overlay);
  }

  // --- Blocker 1: The Original Form ---
  function createFormBlocker(overlay) {
    overlay.style.fontSize = '1.1rem';
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
      <div id="useless-result" style="margin-top:2rem;white-space:pre-line;max-width:90vw;"></div>`;

    // **FIXED**: Search inside the overlay, not the whole document
    overlay.querySelector('#useless-form').onsubmit = function(e) {
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
      
      // **FIXED**: Search inside the overlay
      overlay.querySelector('#useless-form').style.display = 'none';

      const minAccepts = 20, maxAccepts = 30;
      const requiredAccepts = Math.floor(Math.random() * (maxAccepts - minAccepts + 1)) + minAccepts;
      let acceptCount = 0;
      let currentScale = 1.0;
      const growthFactor = 0.05;
      
      overlay.querySelector('#useless-result').innerHTML = result + `<br><button id="accept-btn" style="margin-top:2rem;font-size:1.1rem;padding:0.7rem 2rem;border-radius:6px;background:#3a3f47;color:#fff;border:none;cursor:pointer;transition: all 0.2s ease;">Accept</button>`;
      
      const acceptBtn = overlay.querySelector('#accept-btn');
      acceptBtn.onclick = function() {
        acceptCount++;
        if (acceptCount < requiredAccepts) {
          currentScale += growthFactor;
          this.style.transform = `scale(${currentScale})`;
          this.textContent = `Accept`;
        } else {
          this.style.transform = `scale(1)`;
          this.textContent = 'Unlocking...';
          setTimeout(() => {
            removeOverlay();
            chrome.runtime.sendMessage({action: 'task_completed'});
          }, 400);
        }
      };
    };
  }

  // --- Blocker 2: Infinite Update Screen ---
  function createUpdateBlocker(overlay) {
    overlay.style.background = '#0078d7';
    overlay.style.fontSize = '2rem';
    overlay.innerHTML = `
      <style>
        .spinner { border: 8px solid #f3f3f3; border-top: 8px solid #0078d7; border-radius: 50%; width: 60px; height: 60px; animation: spin 2s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      </style>
      <div class="spinner"></div>
      <div style="margin-top: 2rem; text-align: center;">
        <p>Working on updates</p>
        <p style="font-size: 4rem; font-weight: 200; margin: 0;">${Math.floor(Math.random() * 99)}% complete</p>
        <p>Don't turn off your PC. This will take a while.</p>
      </div>
    `;
  }

  // --- Blocker 3: Fake Virus Scanner (with sound) ---
  function createVirusBlocker(overlay) {
    const alarmSound = new Audio(chrome.runtime.getURL('alarm.mp3'));
    alarmSound.loop = true;
    alarmSound.play();

    const virusCount = Math.floor(Math.random() * 40) + 5;
    const imageUrl = chrome.runtime.getURL('warning.png');
    overlay.style.background = '#111';
    overlay.style.color = '#ff4d4d';
    overlay.style.fontSize = '1.2rem';
    overlay.innerHTML = `
      <div style="text-align:center; background: #222; padding: 2rem 4rem; border: 2px solid #ff4d4d; border-radius: 8px; box-shadow: 0 0 30px #ff0000;">
        <img src="${imageUrl}" alt="Warning" style="width: 64px; height: 64px;">
        <h1 style="color: #ff4d4d; margin-top: 1rem;">System Alert!</h1>
        <p style="color: #fff;">Your system is infested with <strong style="font-size: 1.5rem;">${virusCount} viruses!</strong></p>
        <p style="color: #fff;">Immediate action is required to prevent data loss.</p>
        <button id="virus-remover-btn" style="margin-top:1.5rem;font-size:1.2rem;padding:0.8rem 1.5rem;border-radius:6px;background:#ff4d4d;color:#fff;border:none;cursor:pointer;">Remove all viruses now</button>
      </div>
    `;

    // **FIXED**: Search inside the overlay for the button
    overlay.querySelector('#virus-remover-btn').onclick = function() {
        alarmSound.pause();
        this.textContent = 'Removing viruses...';
        setTimeout(() => {
            removeOverlay();
            chrome.runtime.sendMessage({action: 'task_completed'});
        }, 1500);
    };
  }
  
  // --- Blocker 4: System Explosion Countdown ---
  function createExplosionBlocker(overlay) {
    overlay.style.background = '#000';
    overlay.style.textTransform = 'uppercase';
    overlay.style.textAlign = 'center';
    
    overlay.innerHTML = `
      <div style="border: 4px solid #f00; padding: 2rem 4rem;">
        <h1 style="color: #f00; font-size: 3rem; letter-spacing: 4px;">Warning</h1>
        <h2 style="color: #ff0; font-size: 2rem;">System Core Failure Imminent</h2>
        <div id="countdown-timer" style="color: #f00; font-size: 8rem; font-weight: bold; margin: 2rem 0;"></div>
        <p style="color: #ff0;">All systems will be terminated.</p>
      </div>
    `;

    const timerElement = overlay.querySelector('#countdown-timer');
    let timeLeft = Math.floor(Math.random() * 10) + 5;
    
    countdownInterval = setInterval(() => {
      if (timeLeft <= 0) {
        clearInterval(countdownInterval);
        overlay.innerHTML = '';
        overlay.style.background = '#000';
      } else {
        timerElement.textContent = timeLeft;
        timeLeft--;
      }
    }, 1000);
  }

  // --- Utility to remove any overlay ---
  function removeOverlay() {
    if (overlay) {
      clearInterval(countdownInterval);
      overlay.remove();
      overlay = null;
    }
  }
}