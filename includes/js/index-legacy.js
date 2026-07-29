"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// @ts-nocheck
var user = {
  currentLanguage: localStorage.getItem('language') || 'en',
  currentJbFlavor: localStorage.getItem('jailbreakFlavor') || 'GoldHEN',
  platform: "PS4",
  // PS4/PC/Mobile etc..
  lastTab: localStorage.getItem('lastTab') || 'tools',
  advancedPayloads: localStorage.getItem('advancedPayloads') || false,
  // True/false
  ip: localStorage.getItem('PayLoaderIp') || window.location.hostname,
  ps4Fw: localStorage.getItem('ps4Fw'),
  // Used for the case of sending the payload over the network
  clearLog: true,
  bareboneJB: localStorage.getItem('bareboneJB') === 'true',
  exploitChain: parseFloat(localStorage.getItem('exploitChain')),
  //Exploit chain method
  blockJailbreak: false // Prevent double jailbreak execution
};
var autoJbInterval;
var lastScrollY = 0;
var lastSection = "initial";
var devMode = false; // Dev mode for PC debugging
var rtlLangs = ["ar", "fa"];
var webKitMin = 6.00;
var webKitMax = 11.02;
var ui = {
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
  langRadios: document.querySelectorAll('#chooselang input[name="language"]')
};
function userlandOnlyOnJB67x() {
  var value = localStorage.getItem('userlandOnlyOnJB67x') == "true";
  ui.userlandOnlyOnJB67x.checked = value;
}

// Jailbreak-related functions
function jailbreak() {
  return _jailbreak.apply(this, arguments);
}
function _jailbreak() {
  _jailbreak = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var payloadPath, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.n) {
        case 0:
          if (!(user.platform !== "PS4")) {
            _context.n = 1;
            break;
          }
          return _context.a(2);
        case 1:
          // clear terminal
          ui.consoleElement.textContent = '';
          // stop counter
          if (autoJbInterval) clearInterval(autoJbInterval);

          // Make it retry untill success
          sessionStorage.setItem('autoJbRetry', 'true');

          // Skip if payload were chosen, useful when a payload were chosen from payloads.js
          payloadPath = sessionStorage.getItem('payload_path');
          if (!payloadPath || payloadPath === "null" || payloadPath === "undefined") {
            // Choose HEN
            chooseHEN();
          }
          cleanUp();

          // barebone exploit prefered? go to exploit file
          if (!user.bareboneJB) {
            _context.n = 2;
            break;
          }
          location.href = "./exploit.html";
          return _context.a(2);
        case 2:
          // add one jailbreak attempt to stats
          updateJbStats(1, 0);

          // checkFw.js already guarantees exploitChain is valid for the current firmware
          _t = user.exploitChain;
          _context.n = _t === 0 ? 3 : _t === 1 ? 3 : _t === 2 ? 4 : _t === 3 ? 5 : _t === 4 ? 5 : 6;
          break;
        case 3:
          // bundle psfree lapse
          psfreeLapse();
          return _context.a(3, 6);
        case 4:
          // badhoist (6.70 - 6.72 only)
          badHoistJailbreak();
          return _context.a(3, 6);
        case 5:
          // cssfontface lapse
          cssFontFaceJailbreak();
          return _context.a(3, 6);
        case 6:
          return _context.a(2);
      }
    }, _callee);
  }));
  return _jailbreak.apply(this, arguments);
}
function psfreeLapse() {
  return _psfreeLapse.apply(this, arguments);
} // Taken from Feyzee61 ps4jb
function _psfreeLapse() {
  _psfreeLapse = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee2() {
    var _t2, _t3;
    return _regenerator().w(function (_context2) {
      while (1) switch (_context2.p = _context2.n) {
        case 0:
          if (!(user.exploitChain == 0)) {
            _context2.n = 5;
            break;
          }
          _context2.p = 1;
          _context2.n = 2;
          return getScript('./src/psfree-lapse/alert.mjs');
        case 2:
          _context2.n = 4;
          break;
        case 3:
          _context2.p = 3;
          _t2 = _context2.v;
          log("alert.mjs is not defined", "red");
        case 4:
          _context2.n = 9;
          break;
        case 5:
          // bundle lapse
          log("Loading Feyzee61's PSFree Lapse implementation..");
          _context2.p = 6;
          _context2.n = 7;
          return loadScript('./src/psfree-lapse/bundle.js');
        case 7:
          if (typeof doJailBreak === "function") {
            doJailBreak();
          } else {
            log("Error: doJailBreak is not defined", "red");
          }
          _context2.n = 9;
          break;
        case 8:
          _context2.p = 8;
          _t3 = _context2.v;
          log("Failed to load bundle script: " + _t3.message, "red");
        case 9:
          return _context2.a(2);
      }
    }, _callee2, null, [[6, 8], [1, 3]]);
  }));
  return _psfreeLapse.apply(this, arguments);
}
function badHoistJailbreak() {
  return _badHoistJailbreak.apply(this, arguments);
}
function _badHoistJailbreak() {
  _badHoistJailbreak = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee3() {
    var value, result;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          log("Initializing Exploit...");
          value = localStorage.getItem('userlandOnlyOnJB67x') == "true";
          if (!value) {
            _context3.n = 1;
            break;
          }
          // set userlandOnlyOnJB67x to false, on reload to load userland exploit
          localStorage.setItem('userlandOnlyOnJB67x', "false");
          // set jailbreakNow to true to automatically launch jailbreak function
          sessionStorage.setItem("jailbreakNow", 'true');
          location.reload();
          return _context3.a(2);
        case 1:
          if (!(window.entrypoint672_result < 1)) {
            _context3.n = 3;
            break;
          }
          log("An error occured during Bad Hoist Entrypoint\nRetrying..", "orange");
          _context3.n = 2;
          return sleep(2000);
        case 2:
          location.reload();
          return _context3.a(2);
        case 3:
          log("Bad Hoist Entrypoint succeeded");
        case 4:
          if (!(window.exploitsetup672_result < 1)) {
            _context3.n = 5;
            break;
          }
          log("An error occured during Exploit Setup\nPlease refresh page and try again...", "red");
          return _context3.a(2);
        case 5:
          log("Exploit Setup complete\n");
        case 6:
          log("Starting Kernel Exploit...");
          _context3.n = 7;
          return sleep(200);
        case 7:
          _context3.n = 8;
          return loadScript('./src/badhoist/672kexploit.js');
        case 8:
          result = KernelExploit672();
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
        case 9:
          return _context3.a(2);
      }
    }, _callee3);
  }));
  return _badHoistJailbreak.apply(this, arguments);
}
function cssFontFaceJailbreak() {
  return _cssFontFaceJailbreak.apply(this, arguments);
} // Apply lanuage after loading the language file
function _cssFontFaceJailbreak() {
  _cssFontFaceJailbreak = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          _context4.n = 1;
          return getScript('src/cssfontface/main.js');
        case 1:
          doCssFontFaceJailbreak();
        case 2:
          return _context4.a(2);
      }
    }, _callee4);
  }));
  return _cssFontFaceJailbreak.apply(this, arguments);
}
function initLanguage() {
  return _initLanguage.apply(this, arguments);
} // Load settings
function _initLanguage() {
  _initLanguage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
    var _t4;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          _context5.p = 0;
          _context5.n = 1;
          return loadLanguage();
        case 1:
          applyLanguage(user.currentLanguage);
          updateJbStats(false, false);
          _context5.n = 3;
          break;
        case 2:
          _context5.p = 2;
          _t4 = _context5.v;
          console.error(_t4);
        case 3:
          return _context5.a(2);
      }
    }, _callee5, null, [[0, 2]]);
  }));
  return _initLanguage.apply(this, arguments);
}
function loadSettings() {
  return _loadSettings.apply(this, arguments);
}
function _loadSettings() {
  _loadSettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
    var _t5;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          _context6.p = 0;
          CheckFW();
          loadJbFlavor();
          _context6.n = 1;
          return initLanguage();
        case 1:
          loadTheme();
          loadColor();
          renderPayloads(payloadsList);
          loadAdvancedPayloads();
          loadLastTab();
          loadGoldHENVer();
          autoJailbreak();
          updateBareboneJB();
          loadExploitChain();
          _context6.n = 3;
          break;
        case 2:
          _context6.p = 2;
          _t5 = _context6.v;
          alert("Error in loadSettings: " + _t5.message);
        case 3:
          return _context6.a(2);
      }
    }, _callee6, null, [[0, 2]]);
  }));
  return _loadSettings.apply(this, arguments);
}
function ipGuess() {
  return _ipGuess.apply(this, arguments);
} // A try to free up some memory to improve success rate
function _ipGuess() {
  _ipGuess = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.n) {
        case 0:
          _context7.n = 1;
          return getScript("./includes/js/goldhenScanner.js");
        case 1:
          guessIp();
        case 2:
          return _context7.a(2);
      }
    }, _callee7);
  }));
  return _ipGuess.apply(this, arguments);
}
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
  var toDestroy = ['settingsBtn', 'aboutBtn', 'initialScreen', 'chooseGoldHEN', 'psLogoContainer', 'clickToStartText', 'ps4FwStatus', 'stopAutoJbBtn', 'payloadsSection', 'payloadsList', 'payloadsSectionTitle', 'ps4IpInput', 'ps4FwSelect', 'scanGoldHENPayLoader', 'shutdownServerBtn', 'aboutPopup', 'settingsPopup', 'chooseFanThreshold', 'autoJbRetry', 'chooselang', 'toolsSection', 'toolsTab', 'linuxSection', 'linuxTab', 'advancedPayloadsSection', 'advancedPayloadsTab', 'advancedPayloadsContainer', 'advancedPayloadsInput', 'customPayloadsSection', 'customPayloadsTab', 'customPayloadInput', 'sendCustomPayloadBtn', 'exploitRunBtn', 'secondHostBtn', 'aboutPopupOverlay', 'settingsPopupOverlay', 'chooseFanThresholdOverlay', 'exploitChainTitle'];
  toDestroy.forEach(function (key) {
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
  var radioElement = document.querySelector("input[name=\"exploitChain\"][value=\"".concat(user.exploitChain, "\"]"));
  if (radioElement) {
    radioElement.checked = true;
  }
}
