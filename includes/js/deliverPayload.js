// @ts-nocheck

var PAYLOAD_RECEIVER_TARGETS = [
    { name: "GoldHEN / nexHEN", port: 9090 },
];

var needsPayloadLoader = false;

function getPayload(payloadUrl, onLoadEndCallback) {
    var req = new XMLHttpRequest();
    req.open("GET", payloadUrl);
    req.responseType = "arraybuffer";
    req.onload = function (event) {
        if (onLoadEndCallback) onLoadEndCallback(req, event);
    };
    req.onerror = function (event) {
        if (onLoadEndCallback) onLoadEndCallback(req, event);
    };
    req.send();
}

function sendPayloadWithTimeout(url, data, timeoutMs, onResult) {
    var req = new XMLHttpRequest();
    var finished = false;
    var timer = null;

    function complete(success) {
        if (finished) return;
        finished = true;
        if (timer) clearTimeout(timer);
        onResult(success, req);
    }

    timer = setTimeout(function () {
        complete(false);
    }, timeoutMs || 8000);

    req.onload = function () {
        if (req.status === 200 || req.status == 202) {
            complete(true);
        } else {
            log("HTTP Status: " + req.status, "red");
            log("Response Body: " + req.responseText, "red");
            complete(false);
        }
    };

    req.onerror = function () {
        complete(false);
    };

    try {
        req.open("POST", url, true);
        req.send(data);
    } catch (e) {
        complete(false);
    }
}

/**
 * Sends a payload to the PS4 by trying available receivers (9090)
 * in sequence until one succeeds. If all fail, falls back to the online exploit runner.
 * 
 * @param {string} PLfile The path to the payload file.
 * @param {string} name The name of the payload.
 * @param {string} id The ID of the payload.
 * @param {string} needsPayloadLoader if the payload only loads with a payload loader e.g. through GoldHEN.
 * @param {number} [customPort] Optional custom port for the payload receiver.
 */
function Loadpayloadlocal(PLfile, name, id, needsPayloadLoader, customPort) {
    var ps4Ip = (typeof user !== "undefined" && user.ip) ? user.ip : "127.0.0.1";

    var handleFallback = function () {
        if (name === "Elf Loader") {
            PLfile = "./includes/payloads/Bins/elfldr.bin";
        }

        if (isFirmwareSupported(user.ps4Fw)) {
            if (!isHttps()) {
                if (requiresPayloadServer(needsPayloadLoader)) {
                    return;
                }
                if (confirm(window.lang.disabledBinloader)) {
                    Loadpayloadonline(PLfile);
                }
            } else {
                Loadpayloadonline(PLfile);
            }
        } else {
            alert(window.lang.binLoaderNotDetected);
        }
    };

    // Helper to fetch payload binary and send via GoldHEN port 9090
    var sendViaGoldHen = function (binPath, onComplete) {
        getPayload(binPath, function (fetchReq) {
            if (!fetchReq || (fetchReq.status !== 200 && fetchReq.status !== 304) || !fetchReq.response) {
                onComplete(false);
                return;
            }

            var payloadData = fetchReq.response;
            var targets = customPort ? [{ name: "Custom Port", port: customPort }] : PAYLOAD_RECEIVER_TARGETS;
            var currentTargetIndex = 0;

            function tryNextTarget() {
                if (currentTargetIndex >= targets.length) {
                    onComplete(false);
                    return;
                }

                var target = targets[currentTargetIndex];
                currentTargetIndex++;

                var targetUrl = "http://" + ps4Ip + ":" + target.port + "/";
                sendPayloadWithTimeout(targetUrl, payloadData, 5000, function (success) {
                    if (success) {
                        onComplete(true);
                    } else {
                        tryNextTarget();
                    }
                });
            }

            tryNextTarget();
        });
    };

    // If the payload is an ELF file and not a Linux payload, attempt to send it to elfldr first
    if (PLfile.indexOf(".elf") !== -1 && PLfile.indexOf("linux") == -1) {
        sendToElfldr(PLfile, log).then(function (success) {
            if (success) {
                return; // Successfully sent to elfldr directly
            }

            // log("elfldr is not running, checking for GoldHEN payload server...", "orange");

            // Ensure we have a valid IP or try scanning/guessing it if not set locally
            var checkAndLoadElfLdr = function () {
                ps4Ip = (typeof user !== "undefined" && user.ip) ? user.ip : "127.0.0.1";

                var elfldrBinPath = "./includes/payloads/Bins/elfldr.bin";
                // log("Loading elfldr.bin via GoldHEN...", "orange");

                sendViaGoldHen(elfldrBinPath, function (goldHenSuccess) {
                    if (!goldHenSuccess) {
                        if (!needsPayloadLoader){
                            log("GoldHEN payload loader not responding. Falling back to exploit...", "red");
                        }
                        handleFallback();
                        return;
                    }

                    log("elfldr.bin sent via GoldHEN. Waiting for elfldr to start...");

                    // Wait 5 seconds for elfldr to boot up on port 9021
                    setTimeout(function () {
                        sendToElfldr(PLfile, log).then(function (retrySuccess) {
                            if (retrySuccess) {
                                log("Payload sent successfully to elfldr!", "green");
                            } else {
                                log("Failed to send payload to elfldr. Falling back to exploit...", "red");
                                handleFallback();
                            }
                        });
                    }, 5000);
                });
            };

            // If user.ip isn't set or is localhost while testing externally, try guessing IP first
            if (ps4Ip === "127.0.0.1" && !isPS4Console() && !isLocalIP(window.location.hostname)) {
                guessIp().then(function () {
                    checkAndLoadElfLdr();
                }).catch(function () {
                    handleFallback();
                });
            } else {
                checkAndLoadElfLdr();
            }
        });
    } else {
        // load using GoldHEN / nexHEN payload loader directly
        getPayload(PLfile, function (fetchReq) {
            if (fetchReq && fetchReq.status === 404) {
                log(window.lang.payloadNotFound.replace("{payload}", name) + " " + PLfile, "red");
                return;
            }

            if (!fetchReq || (fetchReq.status !== 200 && fetchReq.status !== 304) || !fetchReq.response) {
                handleFallback();
                return;
            }

            log(window.lang.payloadSending.replace("{payload}", name));

            var payloadData = fetchReq.response;
            var targets = customPort ? [{ name: "Custom Port", port: customPort }] : PAYLOAD_RECEIVER_TARGETS;
            var currentTargetIndex = 0;

            function tryNextTarget() {
                if (currentTargetIndex >= targets.length) {
                    var errorMsg = window.lang.failedToSendToPayLoader.replace("{payload}", name) + ps4Ip;
                    log(errorMsg, "red");
                    if (requiresPayloadServer(needsPayloadLoader)) {
                        return;
                    }
                    setTimeout(function () {
                        handleFallback();
                    }, 500);
                    return;
                }

                var target = targets[currentTargetIndex];
                currentTargetIndex++;

                var targetUrl = "http://" + ps4Ip + ":" + target.port + "/";
                sendPayloadWithTimeout(targetUrl, payloadData, 5000, function (success) {
                    if (success) {
                        var msg = window.lang.payloadSentToPayLoader.replace("{payload}", name) + ps4Ip + " (" + target.name + ")";
                        log(msg);
                        if (getPs4FwVersion() == 4.74) log("Payloads work on this firmware, however no notifications are shown!", "grey");
                    } else {
                        tryNextTarget();
                    }
                });
            }

            tryNextTarget();
        });
    }
}

/**
 * Loads a payload directly via WebKit exploit / session storage.
 */
function Loadpayloadonline(PLfile) {
    if (PLfile == null) {
        // Run BinLoader
        storage.session.set("binloader", 1);
    } else {
        storage.session.set("payload_path", PLfile);
    }

    if (isPS4Console()) {
        jailbreak();
    }
}

// Custom Uploaded Payload
function customPayload(payloadFile) {
    if (!payloadFile) {
        alert("Empty file");
        return;
    }
    Loadpayloadlocal(URL.createObjectURL(payloadFile), payloadFile.name, payloadFile.id);
    log(window.lang.customPayloadLoaded + payloadFile.name);
}


function payloadRouter(payload) {
    if (!isPayloadSupported(payload)) {
        alert(window.lang.unsupportedFirmware + user.ps4Fw);
        return;
    }
    // It's a BinLoader
    if (payload.src == null && payload.legacySrc == null) {
        Loadpayloadonline(null);
    } else {
        // check for firmware to load a legacy payload instead
        if (getPs4FwVersion() <= 4.74 && payload.legacySrc != undefined) {
            payload.src = payload.legacySrc;
        }

        Loadpayloadlocal(payload.src, payload.name, payload.id, payload.needsPayloadLoader);
        // install both base and update for psvue
        if (payload.id == 'PSVue'){
            payload.src = payload.src.replace('base', '124');
            Loadpayloadlocal(payload.src, payload.name, payload.id, payload.needsPayloadLoader);
        }
    }
}

function requiresPayloadServer(needsPayloadLoader) {
    if (needsPayloadLoader) {
        alert(window.lang.binLoaderNotDetected + "\n\n" + window.lang.payloadRequiresPayloader);
        return true;
    }
    return false;
}