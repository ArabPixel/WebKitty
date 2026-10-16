// Shared functions used by both index.html and exploit.html.

function sleep(ms) {
    ms = ms || 0;
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

// Taken from Feyzee61's ps4jb
// Pass isModule=true only for ES module scripts (.mjs).
function getScript(source, isModule, devMode) {
    return new Promise(function (resolve, reject) {
        var gs = document.createElement('script');
        gs.src = source;
        gs.type = isModule ? 'module' : 'text/javascript';
        gs.async = false;
        gs.onload = function () { resolve(); };
        gs.onerror = function () { reject(new Error('Script load failed: ' + source)); };
        document.body.appendChild(gs);
        if (devMode) log('[Debug] Script loaded as ' + gs.type + '; ' + source, "grey");
    });
}

// Taken from Feyzee61's ps4jb
// Loads a script and waits for it to signal readiness via window.script_loaded.
// The BadHoist exploit sets window.script_loaded = 1 when it is ready.
function loadScript(script_js, isModule, devMode) {
    window.script_loaded = 0;
    return getScript(script_js, isModule, devMode).then(function () {
        return new Promise(function (resolve) {
            function waitForLoad() {
                if (window.script_loaded >= 1) {
                    resolve();
                } else {
                    setTimeout(waitForLoad, 50);
                }
            }
            waitForLoad();
        });
    });
}

function isHttps() {
    return window.location.protocol === 'https:';
}

// Works in both index.html and exploit.html
function log(message, color, consoleEl) {
    var consoleEl = consoleEl ? consoleEl : ui.consoleElement;
    var consoleEl = (typeof ui !== 'undefined' && ui.consoleElement)
        ? ui.consoleElement
        : document.getElementById('console');

    if (typeof user !== 'undefined' && user.clearLog && consoleEl) {
        consoleEl.textContent = '';
        user.clearLog = false;
    }
    if (!consoleEl) return;

    var span = document.createElement('span');
    // break text into a new line to keep it visible
    span.style.whiteSpace = "pre-wrap";
    span.style.fontSize = "14px";
    span.textContent = message + '\n';
    if (color) span.style.color = color;
    consoleEl.appendChild(span);
}

function getReloadAfterJb() {
    return storage.getBoolean('reloadAfterJb', true);
}

/**
 * Increment jailbreak attempt/success counters in storage and update the UI.
 * @param {boolean} attempt   - true when a new jailbreak attempt starts.
 * @param {boolean} isSuccess - true when the jailbreak succeeds.
 * Passing both false refreshes the UI display without changing stored counts.
 */
function updateJbStats(attempt, isSuccess) {
    var total = storage.getNumber('jbTotal', 0);
    var success = storage.getNumber('jbSuccess', 0);

    if (attempt) {
        total++;
        storage.set('jbTotal', total);
    }
    if (isSuccess) {
        success++;
        storage.set('jbSuccess', success);
    }

    if (typeof ui !== 'undefined' && ui.successRateText && window.lang) {
        var rate = total > 0 ? ((success / total) * 100).toFixed(0) : '0';
        ui.successRateText.textContent =
            (window.lang.successRate || 'Success Rate: ') + rate + '% (' + success + '/' + total + ')';
    }
}

// Called by exploit implementations after a successful jailbreak.
function jailbreakSuccess(statusMessage) {
    if (storage.session.getBoolean('jailbreakNow', true)) {
        storage.session.remove('jailbreakNow');
    }
    storage.session.remove('autoJbRetry');
    storage.session.remove('payload_path');

    updateJbStats(0, 1);

    if (getReloadAfterJb()) {
        setTimeout(function () { window.location.href = mainPage; }, 5000);
    }

    if (typeof ui !== 'undefined' && ui.exploitState) {
        ui.exploitState.textContent = statusMessage
            || (window.lang && window.lang.jailbreakSuccess)
            || 'Jailbreak successful!';
    } else {
        var stateEl = document.getElementById('state');
        if (stateEl && statusMessage) {
            stateEl.textContent = statusMessage;
        }
    }
}

function isLocalIP(ip) {
    return /^(127\.|192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(ip);
}

/**
 * Sets the .hidden class to an element.
 * @param {string} id   - the element ID to hide/show
 * @param {boolean} show - true to show, false to hide. otherwise toggle.
 */
function toggleVisibility(id, show) {
    var el = document.getElementById(id);
    if (!el) return;

    if (show === undefined) {
        el.classList.toggle('hidden');
    } else if (show) {
        el.classList.remove('hidden');
    } else {
        el.classList.add('hidden');
    }
}


/**
 * HTTP payload sender to elfldr using GET (ES5 Compatible)
 * 
 * @param {string} payload_path path to the payload. e.g. /includes/payloads/HEN/nexHEN-ps4.elf
 * @param {function} log - The logging function to use
 * @param {number} timeoutMs - The timeout in milliseconds
 */
function sendToElfldr(payload_path, log) {
    if (payload_path.indexOf("nexHEN-ps4.bin") !== -1) payload_path = payload_path.replace('.bin', '.elf');
    var urlPrefix = window.location.protocol;
    var fullHostPath = urlPrefix + "//" + window.location.host + payload_path;

    var targetUrl = "http://127.0.0.1:9021/?uri=" + fullHostPath;
    log("Sending payload to elfldr...\nPayload Path: " + payload_path);
    return fetch(targetUrl, {
        method: 'GET'
    })
        .then(function (response) {
            return response.text().then(function (responseText) {
                if (response.status == 200 && responseText.indexOf("Error") != -1) {
                    log("elfldr returned an error: " + responseText, 'orange');
                }else {
                    log("Payload Sent successfully!\nStatus: " + response.status + " " + response.statusText + "\nResponse: " + responseText, 'green');
                }
                return true;
            });
        })
        .catch(function (error) {
            log("Error: " + error.message + "\n(elfldr looks to be inaccessible)", 'orange');
            return false;
        });
}