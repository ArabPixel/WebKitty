// @ts-nocheck
// Jailbreak-related functions
async function jailbreak() {
  if (!isPS4Console() && !devMode) return;

  // clear terminal
  ui.consoleElement.textContent = '';
  // stop counter
  if (autoJbInterval) clearInterval(autoJbInterval);

  // Make it retry until success
  storage.session.set('autoJbRetry', true);

  // Skip if payload was chosen, useful when a payload was chosen from deliverPayload.js
  var payloadPath = storage.session.getString('payload_path', null);
  if (!payloadPath || payloadPath == null) {
    // Choose HEN
    chooseHEN();
  }

  cleanUp();
  
  payloadPath = storage.session.getString('payload_path', null);
  log("Loading: " + payloadPath);

  // barebone exploit preferred? go to exploit file
  if (user.bareboneJB) {
    window.location.href = testModeUrl("./exploit.html");
    return;
  }

  // add one jailbreak attempt to stats
  // prevent double exploit attempt for 6.7x
  if (storage.session.getBoolean('jailbreakNow', null) !== true) {
    updateJbStats(1, 0);
  }

  // checkFw.js guarantees exploitChain is valid for the current firmware
  var handler = EXPLOIT_HANDLERS[user.exploitChain];
  if (typeof handler === 'function') {
    handler();
  } else {
    log("Error: Invalid exploit chain selected", "red");
  }
}

async function psfreeLapse() {
  if (user.exploitChain === EXPLOIT_CHAINS.PSFREE_MODULAR) { // modular lapse
    try {
      log("Loading Al-Azif's PSFree Lapse Modular implementation..");
      await getScript('./src/psfree-lapse/alert.mjs', true, devMode);
    } catch (e) {
      log("alert.mjs is not defined", "red");
    }
  } else { // bundle lapse
    log("Loading Feyzee61's PSFree Lapse Bundle implementation..");
    try {
      await loadScript('./src/psfree-lapse/bundle.js', false, devMode);

      if (typeof doJailBreak === "function") {
        doJailBreak();
      } else {
        log("Error: doJailBreak is not defined", "red");
      }
    } catch (e) {
      log("Failed to load bundle script: " + e.message, "red");
    }
  }
}

// Taken from Feyzee61 ps4jb
async function badHoistJailbreak() {
  log("Checking Userland Exploit Status...");
  var jailbreakNow = storage.session.getBoolean('jailbreakNow', false);
  if (!jailbreakNow) {
    // set jailbreakNow to true, on reload to load userland exploit
    storage.session.set('jailbreakNow', true);
    location.reload();
    return;
  }
  if (window.entrypoint672_result < 1) {
    log("An error occured during Bad Hoist Entrypoint\nReload and try again.", "orange");
    storage.session.remove('jailbreakNow');
    return;
  }
  else
    log("Bad Hoist Entrypoint succeeded");
  if (window.exploitsetup672_result < 1) {
    log("An error occured during Exploit Setup\nPlease refresh page and try again...", "red");
    storage.session.remove('jailbreakNow');
    return;
  }
  else
    log("Exploit Setup complete\n");
  log("Starting Kernel Exploit...");
  await sleep(200); // Wait 200ms

  await loadScript('./src/badhoist/672kexploit.js', false, devMode);
  var result = KernelExploit672();
  var payloadPath = storage.session.getString('payload_path', '');

  if (result === 0 || result === 91) {
    log("\nKernel exploit succeeded", "green");
    // Inject HEN payload
    log("Injecting payload: " + payloadPath);
    getPayload672(payloadPath);

    log("\nBad Hoist by Fire30, 6.7x Kernel Exploit by Sleirsgoevy");
    log("Implementation taken from Feyzee61");
    jailbreakSuccess();
  } else if (result === 179) {
    log("\nAlready jailbroken, skipping..", "green");
    log("Injecting payload: " + payloadPath);
    getPayload672(payloadPath);
    log("Payload injected successfully", "green");
    log("\nBad Hoist by Fire30, 6.7x Kernel Exploit by Sleirsgoevy");
    log("Implementation taken from Feyzee61");
    jailbreakSuccess();
  } else {
    log("\nAn error occured during Kernel Exploit\nPlease restart console and try again...", "red");
    storage.session.remove('jailbreakNow');
  }
}

async function cssFontFaceJailbreak() {
  log("Loading ufm42's CSSFontFace exploit chain implementation..");
  await getScript('src/cssfontface/main.js', false, devMode);
  doCssFontFaceJailbreak();
}

async function slopKit() {
  log("Loading Raw-Game's SlopKit exploit chain implementation..");
  try {
    if (user.exploitChain === EXPLOIT_CHAINS.SLOPKIT_NETCTRL) {
      await getScript("src/slopkit/chain_poops.js", true, devMode);
    } else {
      await getScript("src/slopkit/chain_lapse.js", true, devMode);
    }
  } catch (error) {
    log(error, "red");
  }
}

async function relapseJailbreak() {
  log("Loading Raw Game's Relapse exploit chain implementation..");
  try {
    await getScript("src/relapse/jb.js?v=10", true, devMode);
  } catch (error) {
    log(error, "red");
  }
}

async function bpfDoubleFree() {
  log("Loading bpf double free exploit chain implementation..");
  try {
    await getScript("src/bpf-double-free/main.js", false, devMode);
    loadBpfDoubleFree();
  } catch (error) {
    log(error, "red");
  }
}

// Apply language after loading the language file
async function initLanguage() {
  try {
    await loadLanguage();
    applyLanguage(user.currentLanguage);
    updateJbStats(false, false);
  } catch (e) {
    console.error(e);
  }
}

// Load settings
async function loadSettings() {
  try {
    CheckFW();
    loadJbFlavor();
    await initLanguage();
    loadTheme();
    loadLayout();
    renderPayloads(payloadsList);
    loadAdvancedPayloads();
    loadLastTab();
    loadGoldHENVer();
    getReloadAfterJb();
    autoJailbreak();
    updateBareboneJB();
    loadExploitChain();
  } catch (e) {
    alert("Error in loadSettings: " + e.message);
  }
}

async function ipGuess() {
  await getScript("./includes/js/goldhenScanner.js", false, devMode);
  guessIp();
}

function cleanUp() {
  if (autoJbInterval) {
    clearInterval(autoJbInterval);
    autoJbInterval = null;
  }

  // clear logs
  ui.consoleElement.textContent = '';

  if (ui.initialScreen) {
    toggleVisibility(ui.initialScreen.id, 0);
  }

  // if RTL language, keep text from left to right
  if (isRtl()){
    document.getElementById('DebugConsole').style.textAlign = 'end';
  }

  // Ensure the exploit status console is displayed
  var exploitContainer = document.getElementById('exploitContainer');
  var payloadsSection = document.getElementById('payloadsSection');
  var playButton = document.getElementById('exploitRun');
  var exploitStatusPanel = document.getElementById('exploit-status-panel');
  if (exploitContainer && payloadsSection) {
    exploitContainer.style.display = 'block';
    toggleVisibility(payloadsSection.id, 0);
    if (playButton) toggleVisibility(playButton.id, 0);
    if (exploitStatusPanel) exploitStatusPanel.style.setProperty("width", "100%", "important");
  }
}

// Exploit dispatch handler map
EXPLOIT_HANDLERS[EXPLOIT_CHAINS.PSFREE_MODULAR] = psfreeLapse;
EXPLOIT_HANDLERS[EXPLOIT_CHAINS.PSFREE_BUNDLE] = psfreeLapse;
EXPLOIT_HANDLERS[EXPLOIT_CHAINS.BADHOIST] = badHoistJailbreak;
EXPLOIT_HANDLERS[EXPLOIT_CHAINS.CSSFONTFACE_NETCTRL] = cssFontFaceJailbreak;
EXPLOIT_HANDLERS[EXPLOIT_CHAINS.CSSFONTFACE_LAPSE] = cssFontFaceJailbreak;
EXPLOIT_HANDLERS[EXPLOIT_CHAINS.SLOPKIT_LAPSE] = slopKit;
EXPLOIT_HANDLERS[EXPLOIT_CHAINS.SLOPKIT_NETCTRL] = slopKit;
EXPLOIT_HANDLERS[EXPLOIT_CHAINS.RELAPSE] = relapseJailbreak;
EXPLOIT_HANDLERS[EXPLOIT_CHAINS.BPF_DOUBLE_FREE] = bpfDoubleFree;