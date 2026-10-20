// Exploit Settings
var devkit = false;                                                            // Is this a Devkit (Not a Testkit)

// The following will determine what the exploit will do. It will only do one of these and they will be checked in the order they are listed
//   ex. If both kernel_dump and bin_loader is true it will only dump the kernel and will not listen for payloads.

var dump_method = 'socket';                                                    // What method do you want to use to dump the module ("socket" or "http")?
//   If you select "socket" you cannot select "all" in the option below for module dumping.
var dump_ip = '0.0.0.0';                                                       // What IP should it be dumped to? (Used for "socket")
var dump_port = 9023;                                                          // What port should it be dumped to? (Used for "socket")
var dump_url = 'http://0.0.0.0/dump';                                          // What URL should it be dumped to? (Used for "http")

var module_dump = false;                                                       // Do you want to dump the webkit modules?
var module_dump_name = 'libSceWebKit2';                                        // Which module to dump ("libSceWebKit2", "libkernel", "libSceLibcInternal", or "all")

var kernel_dump = false;                                                       // Do you want to dump the kernel?
var kernel_dump_size = 0x69B8000;                                              // How big of a dump should be made?

// the '1' comes from deliverPayloads.js inside Loadpayloadonline
var bin_loader = sessionStorage.getItem("binloader") === "1";                  // Do you want to listen for payloads on port 9020?
var embedded_payload = true;                                                   // Do you want to load an embedded payload?
var payload_location = sessionStorage.getItem('payload_path') || undefined;         // What location do you want to load the payload from?

function iframeMessage(message) {
    try {
        if (window.self !== window.top) {
            parent.exploitDone(message);
        }
    } catch (e) {
        parent.exploitDone(message);
    }
}
function allset() {
    jailbreakSuccess();
    log("Success!", 'green')
}

function awaitpl() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', './success', true);
    xhr.send();
    if (typeof jailbreakSuccess === "function") {
        jailbreakSuccess();
    }
    log('\nAwaiting Payload on port 9020...', 'green');
}

function fail(info) {
    log("The Exploit Failed! ", 'red')
    log(info, 'red')
}

window.onerror = function (e) {
    if (e.slice(0, 6) == 'Error:') {
        fail(e);
    }
};

// This should detect the current FW, even if spoofed, as long as it uses the predetermined values, this can be removed after the HMD patch is used vs spoofing SDK version
// var spoofedFW = {
//     9.00: 4.05,
//     9.01: 4.55,
//     9.02: 4.74,
//     9.03: 5.01,
//     9.04: 5.03,
//     9.05: 5.05,
// };
var fwFromUA = getPs4FwVersion();
// if (fwFromUA in spoofedFW) {
//     fwFromUA = spoofedFW[fwFromUA];
// }

function kernelExploit() {
    try {
        /*
        if (fwFromUA <= 3.70) {
          kernelExploit_bpf_race_old();
        } else if (fwFromUA <= 4.07) {
          kernelExploit_namedobj();
        } else if (fwFromUA <= 4.55) {
          kernelExploit_bpf_race();
        } else
        */
        if (fwFromUA <= 5.07) {
            kernelExploit_bpf_double_free();
        }
    } catch (e) {
        throw new Error(e.message);
    }
};

function stage2() {
    try {
        userland();
    } catch (e) {
        throw new Error(e.message);
    }
};

function postWebkitExploit() {
    try {
        setTimeout(stage2, 1);
    } catch (e) {
        throw new Error(e.message);
    }
};

function startbpfDoubleFree() {
    try {
        log('Starting the exploit...');
        if (fwFromUA >= 3.50 && fwFromUA <= 5.07) {
            if (fwFromUA <= 4.07) {
                setTimeout(webkitExploit_stackUnitializedRead, 1);
                //} else if (fwFromUA >= 4.50 && fwFromUA <= 5.01) {
                //  setTimeout(exploit_setAttributeNodeNS, 1);
            } else if (fwFromUA >= 4.50 && fwFromUA <= 5.56) {
                setTimeout(webkitExploit_haveABadTime, 1);
            } else if (fwFromUA >= 6.00 && fwFromUA <= 6.20) {
                setTimeout(webkitExploit_shiftCountWithArrayStorage, 1);
            } else if (fwFromUA >= 6.50 && fwFromUA <= 6.72) {
                setTimeout(webkitExploit_badHoist, 1);
            }
        } else {
            throw new Error('Unsupported Firmware!');
        }
    } catch (e) {
        throw new Error(e.message);
    }
};

// Load exploit files
function loadBpfDoubleFree() {
    log("Setting up bpf double free...");
    return _loadBpfDoubleFree.apply(this, arguments);
}
function _loadBpfDoubleFree() {
    _loadBpfDoubleFree = _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee1() {
        return _regenerator().w(function (_context1) {
            while (1) switch (_context1.n) {
                case 0:
                    _context1.n = 1;
                    return getScript("./src/bpf-double-free/common.js", false);
                case 1:
                    _context1.n = 2;
                    return getScript("./src/bpf-double-free/rop.js", false);
                case 2:
                    _context1.n = 3;
                    return getScript("./src/bpf-double-free/offsets.js", false);
                case 3:
                    _context1.n = 4;
                    return getScript("./src/bpf-double-free/kernelExploit_bpf_double_free.js", false);
                case 4:
                    _context1.n = 5;
                    return getScript("./src/bpf-double-free/userland.js", false);
                case 5:
                    _context1.n = 6;
                    return getScript("./src/bpf-double-free/webkitExploit_stackUnitializedRead.js", false);
                case 6:
                    _context1.n = 7;
                    return getScript("./src/bpf-double-free/webkitExploit_haveABadTime.js", false);
                case 7:
                    startbpfDoubleFree(0);
                case 8:
                    return _context1.a(2);
            }
        }, _callee1);
    }));
    return _loadBpfDoubleFree.apply(this, arguments);
}