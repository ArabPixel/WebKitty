"use strict";

function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); } r ? i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n : (o("next", 0), o("throw", 1), o("return", 2)); }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// @ts-nocheck
// Jailbreak-related functions
function jailbreak() {
  return _jailbreak.apply(this, arguments);
}
function _jailbreak() {
  _jailbreak = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
    var payloadPath, success, handler, _t;
    return _regenerator().w(function (_context) {
      while (1) switch (_context.p = _context.n) {
        case 0:
          if (!(!isPS4Console() && !devMode)) {
            _context.n = 1;
            break;
          }
          return _context.a(2);
        case 1:
          // clear terminal
          ui.consoleElement.textContent = '';
          // stop counter
          if (autoJbInterval) clearInterval(autoJbInterval);

          // Make it retry until success
          storage.session.set('autoJbRetry', true);

          // Skip if payload was chosen, useful when a payload was chosen from deliverPayload.js
          payloadPath = storage.session.getString('`payload_path`', null);
          if (!payloadPath || payloadPath == null) {
            // Choose HEN
            chooseHEN();
          }
          cleanUp();
          payloadPath = storage.session.getString('payload_path', null);
          log("Loading: " + payloadPath);

          // Check if .elf is selected or nexHEN
          if (!(payloadPath && (payloadPath.indexOf('.elf') !== -1 || payloadPath.indexOf("nexHEN-ps4") !== -1))) {
            _context.n = 7;
            break;
          }
          if (payloadPath.indexOf("nexHEN-ps4") !== -1) {
            // elfldr expects .elf payloads
            payloadPath = payloadPath.replace('.bin', '.elf');
          }
          _context.p = 2;
          _context.n = 3;
          return sendToElfldr(payloadPath, log);
        case 3:
          success = _context.v;
          if (!success) {
            _context.n = 4;
            break;
          }
          return _context.a(2);
        case 4:
          _context.n = 6;
          break;
        case 5:
          _context.p = 5;
          _t = _context.v;
        case 6:
          _context.n = 7;
          return sleep(500);
        case 7:
          if (!user.bareboneJB) {
            _context.n = 8;
            break;
          }
          window.location.href = testModeUrl("./exploit.html");
          return _context.a(2);
        case 8:
          // add one jailbreak attempt to stats
          // prevent double exploit attempt for 6.7x
          if (storage.session.getBoolean('jailbreakNow', null) !== true) {
            updateJbStats(1, 0);
          }

          // checkFw.js guarantees exploitChain is valid for the current firmware
          handler = EXPLOIT_HANDLERS[user.exploitChain];
          if (typeof handler === 'function') {
            handler();
          } else {
            log("Error: Invalid exploit chain selected", "red");
          }
        case 9:
          return _context.a(2);
      }
    }, _callee, null, [[2, 5]]);
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
          if (!(user.exploitChain === EXPLOIT_CHAINS.PSFREE_MODULAR)) {
            _context2.n = 5;
            break;
          }
          _context2.p = 1;
          log("Loading Al-Azif's PSFree Lapse Modular implementation..");
          _context2.n = 2;
          return getScript('./src/psfree-lapse/alert.mjs', true, devMode);
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
          log("Loading Feyzee61's PSFree Lapse Bundle implementation..");
          _context2.p = 6;
          _context2.n = 7;
          return loadScript('./src/psfree-lapse/bundle.js', false, devMode);
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
    var jailbreakNow, result, payloadPath;
    return _regenerator().w(function (_context3) {
      while (1) switch (_context3.n) {
        case 0:
          log("Checking Userland Exploit Status...");
          jailbreakNow = storage.session.getBoolean('jailbreakNow', false);
          if (jailbreakNow) {
            _context3.n = 1;
            break;
          }
          // set jailbreakNow to true, on reload to load userland exploit
          storage.session.set('jailbreakNow', true);
          location.reload();
          return _context3.a(2);
        case 1:
          if (!(window.entrypoint672_result < 1)) {
            _context3.n = 2;
            break;
          }
          log("An error occured during Bad Hoist Entrypoint\nReload and try again.", "orange");
          storage.session.remove('jailbreakNow');
          return _context3.a(2);
        case 2:
          log("Bad Hoist Entrypoint succeeded");
        case 3:
          if (!(window.exploitsetup672_result < 1)) {
            _context3.n = 4;
            break;
          }
          log("An error occured during Exploit Setup\nPlease refresh page and try again...", "red");
          storage.session.remove('jailbreakNow');
          return _context3.a(2);
        case 4:
          log("Exploit Setup complete\n");
        case 5:
          log("Starting Kernel Exploit...");
          _context3.n = 6;
          return sleep(200);
        case 6:
          _context3.n = 7;
          return loadScript('./src/badhoist/672kexploit.js', false, devMode);
        case 7:
          result = KernelExploit672();
          payloadPath = storage.session.getString('payload_path', '');
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
        case 8:
          return _context3.a(2);
      }
    }, _callee3);
  }));
  return _badHoistJailbreak.apply(this, arguments);
}
function cssFontFaceJailbreak() {
  return _cssFontFaceJailbreak.apply(this, arguments);
}
function _cssFontFaceJailbreak() {
  _cssFontFaceJailbreak = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee4() {
    return _regenerator().w(function (_context4) {
      while (1) switch (_context4.n) {
        case 0:
          log("Loading ufm42's CSSFontFace exploit chain implementation..");
          _context4.n = 1;
          return getScript('src/cssfontface/main.js', false, devMode);
        case 1:
          doCssFontFaceJailbreak();
        case 2:
          return _context4.a(2);
      }
    }, _callee4);
  }));
  return _cssFontFaceJailbreak.apply(this, arguments);
}
function slopKit() {
  return _slopKit.apply(this, arguments);
}
function _slopKit() {
  _slopKit = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee5() {
    var _t4;
    return _regenerator().w(function (_context5) {
      while (1) switch (_context5.p = _context5.n) {
        case 0:
          log("Loading Raw-Game's SlopKit exploit chain implementation..");
          _context5.p = 1;
          if (!(user.exploitChain === EXPLOIT_CHAINS.SLOPKIT_NETCTRL)) {
            _context5.n = 3;
            break;
          }
          _context5.n = 2;
          return getScript("src/slopkit/chain_poops.js", true, devMode);
        case 2:
          _context5.n = 4;
          break;
        case 3:
          _context5.n = 4;
          return getScript("src/slopkit/chain_lapse.js", true, devMode);
        case 4:
          _context5.n = 6;
          break;
        case 5:
          _context5.p = 5;
          _t4 = _context5.v;
          log(_t4, "red");
        case 6:
          return _context5.a(2);
      }
    }, _callee5, null, [[1, 5]]);
  }));
  return _slopKit.apply(this, arguments);
}
function relapseJailbreak() {
  return _relapseJailbreak.apply(this, arguments);
}
function _relapseJailbreak() {
  _relapseJailbreak = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee6() {
    var _t5;
    return _regenerator().w(function (_context6) {
      while (1) switch (_context6.p = _context6.n) {
        case 0:
          log("Loading Raw Game's Relapse exploit chain implementation..");
          _context6.p = 1;
          _context6.n = 2;
          return getScript("src/relapse/jb.js?v=10", true, devMode);
        case 2:
          _context6.n = 4;
          break;
        case 3:
          _context6.p = 3;
          _t5 = _context6.v;
          log(_t5, "red");
        case 4:
          return _context6.a(2);
      }
    }, _callee6, null, [[1, 3]]);
  }));
  return _relapseJailbreak.apply(this, arguments);
}
function bpfDoubleFree() {
  return _bpfDoubleFree.apply(this, arguments);
} // Apply language after loading the language file
function _bpfDoubleFree() {
  _bpfDoubleFree = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee7() {
    var _t6;
    return _regenerator().w(function (_context7) {
      while (1) switch (_context7.p = _context7.n) {
        case 0:
          log("Loading bpf double free exploit chain implementation..");
          _context7.p = 1;
          _context7.n = 2;
          return getScript("src/bpf-double-free/main.js", false, devMode);
        case 2:
          loadBpfDoubleFree();
          _context7.n = 4;
          break;
        case 3:
          _context7.p = 3;
          _t6 = _context7.v;
          log(_t6, "red");
        case 4:
          return _context7.a(2);
      }
    }, _callee7, null, [[1, 3]]);
  }));
  return _bpfDoubleFree.apply(this, arguments);
}
function initLanguage() {
  return _initLanguage.apply(this, arguments);
} // Load settings
function _initLanguage() {
  _initLanguage = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee8() {
    var _t7;
    return _regenerator().w(function (_context8) {
      while (1) switch (_context8.p = _context8.n) {
        case 0:
          _context8.p = 0;
          _context8.n = 1;
          return loadLanguage();
        case 1:
          applyLanguage(user.currentLanguage);
          updateJbStats(false, false);
          _context8.n = 3;
          break;
        case 2:
          _context8.p = 2;
          _t7 = _context8.v;
          console.error(_t7);
        case 3:
          return _context8.a(2);
      }
    }, _callee8, null, [[0, 2]]);
  }));
  return _initLanguage.apply(this, arguments);
}
function loadSettings() {
  return _loadSettings.apply(this, arguments);
}
function _loadSettings() {
  _loadSettings = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee9() {
    var _t8;
    return _regenerator().w(function (_context9) {
      while (1) switch (_context9.p = _context9.n) {
        case 0:
          _context9.p = 0;
          CheckFW();
          loadJbFlavor();
          _context9.n = 1;
          return initLanguage();
        case 1:
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
          _context9.n = 3;
          break;
        case 2:
          _context9.p = 2;
          _t8 = _context9.v;
          alert("Error in loadSettings: " + _t8.message);
        case 3:
          return _context9.a(2);
      }
    }, _callee9, null, [[0, 2]]);
  }));
  return _loadSettings.apply(this, arguments);
}
function ipGuess() {
  return _ipGuess.apply(this, arguments);
}
function _ipGuess() {
  _ipGuess = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee0() {
    return _regenerator().w(function (_context0) {
      while (1) switch (_context0.n) {
        case 0:
          _context0.n = 1;
          return getScript("./includes/js/goldhenScanner.js", false, devMode);
        case 1:
          guessIp();
        case 2:
          return _context0.a(2);
      }
    }, _callee0);
  }));
  return _ipGuess.apply(this, arguments);
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
  if (isRtl()) {
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
