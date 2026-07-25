//------BIG THANKS TO SISTRO FOR THIS !!!!!--------
// @ts-nocheck
var needsGoldHEN = false;   // check if the payload requires GoldHEN's PayLoader because of .elf format

var getPayload = function (payload, onLoadEndCallback) {
    var req = new XMLHttpRequest();
    req.open('GET', payload);
    req.responseType = "arraybuffer";
    req.send();
    req.onload = function (event) {
        if (onLoadEndCallback) onLoadEndCallback(req, event);
    };
}

var sendPayload = function (url, data, onLoadEndCallback) {
    var req = new XMLHttpRequest();
    req.open("POST", url, true);
    req.send(data);

    req.onload = function (event) {
        if (onLoadEndCallback) onLoadEndCallback(req, event);
    };
}

//Load payloads with GoldHEN

function Loadpayloadlocal(PLfile, name) { //Loading Payload via Payload Param.
    var PS4IP = user.ip;
    // First do an initial check to see if the PayLoader server is running, ready or busy.
    var req = new XMLHttpRequest();
    var port = 9090;
    if (PS4IP == "127.0.0.1") {
        req.open("POST", "http://" + PS4IP + ":" + port + "/status");
    } else {
        req.open("GET", "http://" + PS4IP + ":" + port + "/status");
    }
    req.send();
    req.onerror = function () {
        // If its elfldr, change to .bin 
        if (name == "ElfLoader") PLfile = "./includes/payloads/Bins/elfldr.bin";

        if (user.ps4Fw >= webKitMin && user.ps4Fw <= webKitMax && user.platform == "PS4") {
            if (!isHttps()) {
                if (confirm(window.lang.disabledBinloader)) {
                    Loadpayloadonline(PLfile);
                }
            } else Loadpayloadonline(PLfile);
        } else {
            alert(window.lang.binLoaderNotDetected);
            return;
        }

        return;
    };
    req.onload = function () {
        var responseJson = JSON.parse(req.responseText);
        if (responseJson.status == "ready") {
            getPayload(PLfile, function (req) {
                if ((req.status === 200 || req.status === 304) && req.response) {
                    //Sending bins via IP POST Method
                    sendPayload("http://" + PS4IP + ":" + port, req.response, function (req) {
                        if (req.status === 200) {
                            var msg = window.lang.payloadSentToPayLoader.replace("{payload}", name) + user.ip;
                            log(msg);
                        } else {
                            var msg = window.lang.failedToSendToPayLoader.replace("{payload}", name) + user.ip;
                            log(msg, "red");
                            setTimeout(function () {
                                Loadpayloadonline(PLfile);
                            }, 3000); // 3 seconds delay
                            return;
                        }
                    })
                }
            });
        } else {
            alert(window.lang.busyBinLoader);//<<If server is busy, alert message.
            return;
        }
    };
}

//--------------------------------------------------

//------Payloads--------

// Load Payloads with exploit

function Loadpayloadonline(PLfile) {
    if (PLfile == undefined) {
        // run BinLoader
        sessionStorage.setItem('binloader', 1);
        if (user.exploitChain == 2 || user.exploitChain == 3 || user.exploitChain == 4){
            PLfile = "./includes/payloads/Bins/elfldr.bin";
            sessionStorage.setItem("payload_path", PLfile);
        }
        // Check if Linux payload is selected
    } else if (needsGoldHEN) {
        alert(window.lang.payloadOnlyWithGoldHEN);
        needsGoldHEN = false;
        return;

    } else {
        sessionStorage.setItem('payload_path', PLfile);
    }

    // Jailbreak
    if (user.platform == "PS4") jailbreak();
}

// Payloads
// -----------------
// Dumpers

function load_AppDumper(name) {
    Loadpayloadlocal("./includes/payloads/Bins/Dumper/ps4-app-dumper.bin", name);
}

function load_KernelDumper(name) {
    Loadpayloadlocal("./includes/payloads/Bins/Dumper/ps4-kernel-dumper.bin", name);
}


function load_ModuleDumper(name) {
    Loadpayloadlocal("./includes/payloads/Bins/Dumper/ps4-module-dumper.bin", name);
}

// Tools

function load_BinLoader(name) {
    if (user.ps4Fw >= 7.00 && user.ps4Fw <= 9.60) {
        Loadpayloadonline(undefined);
    } else alert(window.lang.unsupportedFirmware + user.ps4Fw);
}

function load_Elfldr(name) {
    Loadpayloadlocal("./includes/payloads/Bins/elfldr.elf", name)
}

function load_PS4Debug(name) {
    if (user.ps4Fw <= 12.02) {
        Loadpayloadlocal("./includes/payloads/Bins/ps4debug.bin", name);
    } else alert(window.lang.unsupportedFirmware + user.ps4Fw);
}

function load_App2USB(name) {
    Loadpayloadlocal("./includes/payloads/Bins/ps4-app2usb.bin", name);
}


function load_BackupDB(name) {
    Loadpayloadlocal("./includes/payloads/Bins/ps4-backup.bin", name);
}

function load_RestoreDB(name) {
    Loadpayloadlocal("./includes/payloads/Bins/ps4-restore.bin", name);
}

function load_DisableASLR(name) {
    Loadpayloadlocal("./includes/payloads/Bins/ps4-disable-aslr.bin", name);
}

function load_DisableUpdates(name) {
    Loadpayloadlocal("./includes/payloads/Bins/ps4-disable-updates.bin", name);
}

function load_EnableUpdates(name) {
    Loadpayloadlocal("./includes/payloads/Bins/ps4-enable-updates.bin", name);
}

function load_ExitIDU(name) {
    Loadpayloadlocal("./includes/payloads/Bins/ps4-exit-idu.bin", name);
}

function load_FTP(name) {
    Loadpayloadlocal("./includes/payloads/Bins/ps4-ftp.bin", name);
}

function load_HistoryBlocker(name) {
    Loadpayloadlocal("./includes/payloads/Bins/ps4-history-blocker.bin", name);
}

function load_RIFRenamer(name) {
    Loadpayloadlocal("./includes/payloads/Bins/ps4-rif-renamer.bin", name);
}

function load_Orbis(name) {
    if (user.ps4Fw != 5.05 && user.ps4Fw != 6.72 && user.ps4Fw != 7.02 && user.ps4Fw != 7.55 && user.ps4Fw != 9.00) {
        alert(window.lang.unsupportedFirmware + user.ps4Fw);
    } else Loadpayloadlocal("./includes/payloads/Bins/Orbis-Toolbox-900.bin", name);
}

function load_WebRTE(name) {
    if (user.ps4Fw != 5.05 && user.ps4Fw != 6.72 && (user.ps4Fw < 7.00 || user.ps4Fw > 11.00)) {
        //  5.05, 6.72 And 7.00 - 11.00
        alert(window.lang.unsupportedFirmware + user.ps4Fw);
    } else Loadpayloadlocal("./includes/payloads/Bins/WebRTE.bin", name);
}

function load_PermanentUART(name) {
    Loadpayloadlocal("./includes/payloads/Bins/ps4-permanent-uart.bin", name);
}

function load_PUPDecrypt(name) {
    Loadpayloadlocal("./includes/payloads/Bins/ps4-pup-decrypt.bin", name);
}

function load_FanThreshold(name) {
    var temp = sessionStorage.getItem('fanTemp');
    Loadpayloadlocal("./includes/payloads/Bins/fan-thresholds/ps4-fan-threshold" + temp + ".bin", name);
}

// Linux
function load_Linux(name, payloadId) {
    var sliceIndex = name.indexOf('MB');
    var size;
    // name contains MB? slice it to grab the size, otherwise from payloadId
    if (sliceIndex !== -1) {
        sliceIndex = -6;
        size = name.slice(sliceIndex).replace(" ", "-").toLowerCase();
    } else {
        sliceIndex = -7;
        size = payloadId.slice(sliceIndex).replace("x", "-").toLowerCase();
    }

    Loadpayloadlocal("./includes/payloads/Linux/linux" + size + ".elf", name);
    needsGoldHEN = true;
}

function load_npFakeSignin(name) {
    Loadpayloadlocal("./includes/payloads/Bins/np-fake-signin-ps4.elf", name);
}

function load_WebSrv(name) {
    Loadpayloadlocal("./includes/payloads/Bins/ps4-websrv.bin", name);
}

// Custom uploaded Payload
function custom(payloadFile) {
    if (!payloadFile) {
        alert("Empty file");
        return;
    }
    Loadpayloadlocal(URL.createObjectURL(payloadFile), payloadFile.name);
    log(window.lang.customPayloadLoaded + payloadFile.name);
}
