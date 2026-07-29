// @ts-nocheck
var user = {
  currentLanguage: localStorage.getItem('language') || 'en',
  currentJbFlavor: localStorage.getItem('jailbreakFlavor') || 'GoldHEN',
  platform: "PS4", // PS4/PC/Mobile etc..
  lastTab: localStorage.getItem('lastTab') || 'tools',
  advancedPayloads: localStorage.getItem('advancedPayloads') || false, // True/false
  ip: localStorage.getItem('PayLoaderIp') || window.location.hostname,
  ps4Fw: localStorage.getItem('ps4Fw'),  // Used for the case of sending the payload over the network
  clearLog: true,
  bareboneJB: localStorage.getItem('bareboneJB') === 'true',
  exploitChain: parseFloat(localStorage.getItem('exploitChain')), //Exploit chain method
  blockJailbreak: false,  // Prevent double jailbreak execution
}
var autoJbInterval;
let lastScrollY = 0;
let lastSection = "initial";
var devMode = false;   // Dev mode for PC debugging
var rtlLangs = ["ar", "fa"];
var webKitMin = 6.00;
var webKitMax = 11.02;

const ui = {
  mainContainer: document.querySelector('.mainContainer'),

  // Sections
  initialScreen: document.getElementById('initial-screen'),
  exploitScreen: document.getElementById('exploit-main-screen'),

  // Initial screen elements
  settingsBtn: document.getElementById("settings-btn"),
  aboutBtn: document.getElementById("about-btn"),
  psLogoContainer: document.getElementById('ps-logo-container'),
  clickToStartText: document.getElementById('click-to-start-text'),
  ps4FwStatus: document.getElementById('PS4FW'),
  stopAutoJbBtn: document.getElementById('stopAutoJb'),

  // Exploit screen elements
  consoleElement: document.getElementById('console'),
  toolsSection: document.getElementById('tools'),
  toolsTab: document.getElementById('tools-tab'),
  linuxSection: document.getElementById('linux'),
  linuxTab: document.getElementById('linux-tab'),
  advancedPayloadsSection: document.getElementById('advanced'),
  advancedPayloadsTab: document.getElementById('advanced-tab'),
  advancedPayloadsContainer: document.querySelector('.advancedPayloadsTab'),
  advancedPayloadsInput: document.getElementById('advancedPayloadsInput'),
  customPayloadsSection: document.getElementById('custom'),
  customPayloadsTab: document.getElementById('custom-tab'),
  customPayloadInput: document.getElementById('customPayloadInput'),
  sendCustomPayloadBtn: document.getElementById('sendCustomPayloadBtn'),
  successRateText: document.getElementById('successRate'),

  payloadsSection: document.getElementById('payloadsSection'),
  payloadsList: document.getElementById("payloadsGrid"),
  payloadsSectionTitle: document.getElementById('payloads-section-title'),
  exploitRunBtn: document.getElementById('exploitRun'),
  secondHostBtn: document.querySelectorAll('.secondHostBtn'),
  ps4IpInput: document.getElementById('ps4IpInput'),
  ps4FwSelect: document.getElementById('ps4FwSelect'),
  // Popups
  aboutPopupOverlay: document.getElementById('about-popup-overlay'),
  aboutPopup: document.getElementById('about-popup'),
  settingsPopupOverlay: document.getElementById('settings-popup-overlay'),
  settingsPopup: document.getElementById('settings-popup'),
  chooseFanThresholdOverlay: document.getElementById('choose-fanThreshold-overlay'),
  chooseFanThreshold: document.getElementById('choose-fanThreshold'),
  scanGoldHENPayLoader: document.getElementById('scanPayLoader'),
  shutdownServerBtn: document.getElementById('shutdownServerBtn'),
  autoJbRetry: document.getElementById('autoJbRetry'),
  bareboneJbBtn: document.getElementById('bareboneJB'),
  bareboneJBInput: document.getElementById('bareboneJBInput'),
  exploitChainTitle: document.getElementById('exploitChainTitle'),
  userlandOnlyOnJB67x: document.getElementById('userlandOnlyOnJB67xInput'),

  // Settings elements
  langRadios: document.querySelectorAll('#chooselang input[name="language"]'),
};

function userlandOnlyOnJB67x() {
  var value = localStorage.getItem('userlandOnlyOnJB67x') == "true";
  ui.userlandOnlyOnJB67x.checked = value;
}

// Jailbreak-related functions
async function jailbreak() {
  if (user.platform !== "PS4") return;

  // clear terminal
  ui.consoleElement.textContent = '';
  // stop counter
  if (autoJbInterval) clearInterval(autoJbInterval);

  // Make it retry untill success
  sessionStorage.setItem('autoJbRetry', 'true');

  // Skip if payload were chosen, useful when a payload were chosen from payloads.js
  const payloadPath = sessionStorage.getItem('payload_path');
  if (!payloadPath || payloadPath === "null" || payloadPath === "undefined") {
    // Choose HEN
    chooseHEN();
  }

  cleanUp();

  // barebone exploit prefered? go to exploit file
  if (user.bareboneJB) {
    location.href = "./exploit.html";
    return;
  }
  // add one jailbreak attempt to stats
  updateJbStats(1, 0);

  // checkFw.js already guarantees exploitChain is valid for the current firmware
  switch (user.exploitChain) {
    case 0: // modular psfree lapse
    case 1: // bundle psfree lapse
      psfreeLapse();
      break;
    case 2: // badhoist (6.70 - 6.72 only)
      badHoistJailbreak();
      break;
    case 3: // cssfontface netctrl
    case 4: // cssfontface lapse
      cssFontFaceJailbreak();
      break;
  }
}

async function psfreeLapse() {
  // Exploit chain method check
  if (user.exploitChain == 0) { // modular lapse
    try {
      await getScript('./src/psfree-lapse/alert.mjs');
    } catch (e) {
      log("alert.mjs is not defined", "red");
    }
  } else { // bundle lapse
    log("Loading Feyzee61's PSFree Lapse implementation..");
    try {
      await loadScript('./src/psfree-lapse/bundle.js');

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
  log("Initializing Exploit...");
  var value = localStorage.getItem('userlandOnlyOnJB67x') == "true";
  if (value) {
    // set userlandOnlyOnJB67x to false, on reload to load userland exploit
    localStorage.setItem('userlandOnlyOnJB67x', "false");
    // set jailbreakNow to true to automatically launch jailbreak function
    sessionStorage.setItem("jailbreakNow", 'true');
    location.reload();
    return;
  }
  if (window.entrypoint672_result < 1) {
    log("An error occured during Bad Hoist Entrypoint\nRetrying..", "orange");
    await sleep(2000);
    location.reload();
    return;
  }
  else
    log("Bad Hoist Entrypoint succeeded");
  if (window.exploitsetup672_result < 1) {
    log("An error occured during Exploit Setup\nPlease refresh page and try again...", "red");
    return;
  }
  else
    log("Exploit Setup complete\n");
  log("Starting Kernel Exploit...");
  await sleep(200); // Wait 200ms

  await loadScript('./src/badhoist/672kexploit.js');
  var result = KernelExploit672();

  if (result === 0 || result === 91) {
    log("\nKernel exploit succeeded", "green");
    // Inject HEN payload
    getPayload672(sessionStorage.getItem('payload_path'));

    log("\nBad Hoist by Fire30, 6.7x Kernel Exploit by Sleirsgoevy");
    log("Implementation taken from Feyzee61");
    jailbreakSuccess();
  } else if (result === 179) {
    getPayload672(sessionStorage.getItem('payload_path'));

    log("\nAlready jailbroken, skipping..", "green");
    jailbreakSuccess();
  } else {
    log("\nAn error occured during Kernel Exploit\nPlease restart console and try again...", "red");
  }
}

async function cssFontFaceJailbreak(){
  await getScript('src/cssfontface/main.js');
  doCssFontFaceJailbreak();
}

// Apply lanuage after loading the language file
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
    loadColor();
    renderPayloads(payloadsList);
    loadAdvancedPayloads();
    loadLastTab();
    loadGoldHENVer();
    autoJailbreak();
    updateBareboneJB();
    loadExploitChain();
  } catch (e) {
    alert("Error in loadSettings: " + e.message);
  }
}

async function ipGuess(){
  await getScript("./includes/js/goldhenScanner.js");
  guessIp();
}

// A try to free up some memory to improve success rate
function cleanUp() {
  // terminateCache(); Still not sure if this drops the success rate and makes more crashes
  if (!window.ps4Fw) return;

  // Stop auto-jailbreak counter
  if (autoJbInterval) {
    clearInterval(autoJbInterval);
    autoJbInterval = null;
  }

  // Empty payloads sections
  if (ui.payloadsList) {
    ui.payloadsList.innerHTML = '';
  }


  // Wipe individual refs
  const toDestroy = [
    'settingsBtn', 'aboutBtn', 'initialScreen', 'chooseGoldHEN',
    'psLogoContainer', 'clickToStartText',
    'ps4FwStatus', 'stopAutoJbBtn', 'payloadsSection', 'payloadsList', 'payloadsSectionTitle',
    'ps4IpInput', 'ps4FwSelect', 'scanGoldHENPayLoader', 'shutdownServerBtn',
    'aboutPopup', 'settingsPopup', 'chooseFanThreshold', 'autoJbRetry', 'chooselang',
    'toolsSection', 'toolsTab', 'linuxSection', 'linuxTab', 'advancedPayloadsSection', 'advancedPayloadsTab',
    'advancedPayloadsContainer', 'advancedPayloadsInput', 'customPayloadsSection', 'customPayloadsTab', 'customPayloadInput',
    'sendCustomPayloadBtn', 'exploitRunBtn', 'secondHostBtn', 'aboutPopupOverlay', 'settingsPopupOverlay', 'chooseFanThresholdOverlay',
    'exploitChainTitle'
  ];
  toDestroy.forEach(key => {
    if (ui[key]) {
      if (typeof ui[key].remove === 'function') ui[key].remove();
      ui[key] = null;
    }
  });

  // Null the payload arrays — forces GC eligibility on their objects
  if (typeof payloadsList !== 'undefined' && Array.isArray(payloadsList)) {
    payloadsList.length = 0;
  }

  // Make console full screen
  document.getElementById('exploitContainer').style.display = "block";
}

function updateBareboneJB() {
  if (ui.bareboneJBInput) {
    ui.bareboneJBInput.checked = user.bareboneJB;
  }
}

// select exploit option when loading the page
function loadExploitChain() {
  // Protective check
  var radioElement = document.querySelector(`input[name="exploitChain"][value="${user.exploitChain}"]`);
  if (radioElement) {
    radioElement.checked = true;
  }
}
