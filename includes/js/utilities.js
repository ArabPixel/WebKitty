// Shared functions used by both index.html and exploit.html.

function sleep(ms) {
    ms = ms || 0;
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

// Exploit timer - shows elapsed time during jailbreak to indicate progress
var exploitTimerInterval = null;
var exploitTimerStart = 0;

// Elf Loader status check - prevents sending payloads before jailbreak is active
function checkElfLoaderStatus() {
    return new Promise(function (resolve) {
        var xhr = new XMLHttpRequest();
        xhr.timeout = 2000;
        xhr.onload = function () {
            resolve(xhr.status === 200);
        };
        xhr.onerror = function () { resolve(false); };
        xhr.ontimeout = function () { resolve(false); };
        xhr.open('GET', 'http://127.0.0.1:9021/', true);
        xhr.send();
    });
}

function updateElfLoaderStatusUI() {
    var statusEl = document.getElementById('elfLoaderStatus');
    if (!statusEl) return;
    
    checkElfLoaderStatus().then(function (ready) {
        if (ready) {
            statusEl.classList.add('hidden');
        } else {
            statusEl.classList.remove('hidden');
        }
    });
}

// Periodically check Elf Loader status when on exploit screen
function startElfLoaderStatusPolling() {
    updateElfLoaderStatusUI();
    setInterval(updateElfLoaderStatusUI, 5000); // Check every 5 seconds
}

function startExploitTimer() {
    var timerEl = document.getElementById('exploitTimer');
    if (!timerEl) return;
    
    exploitTimerStart = Date.now();
    timerEl.classList.remove('hidden');
    timerEl.textContent = 'Tempo: 0s';
    
    if (exploitTimerInterval) clearInterval(exploitTimerInterval);
    exploitTimerInterval = setInterval(function () {
        var elapsed = Math.floor((Date.now() - exploitTimerStart) / 1000);
        timerEl.textContent = 'Tempo: ' + elapsed + 's';
    }, 1000);
}

function stopExploitTimer() {
    if (exploitTimerInterval) {
        clearInterval(exploitTimerInterval);
        exploitTimerInterval = null;
    }
    var timerEl = document.getElementById('exploitTimer');
    if (timerEl) {
        timerEl.classList.add('hidden');
    }
}

// Copy log to clipboard for easy debugging/sharing
function copyLog() {
    var consoleEl = document.getElementById('console');
    if (!consoleEl) return;
    
    var logText = consoleEl.textContent || consoleEl.innerText || '';
    if (!logText.trim() || logText.trim() === '--') {
        log('Nessun log da copiare', 'orange');
        return;
    }
    
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(logText).then(function () {
            log('Log copiato negli appunti!', 'green');
        }).catch(function () {
            fallbackCopy(logText);
        });
    } else {
        fallbackCopy(logText);
    }
}

function fallbackCopy(text) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        log('Log copiato negli appunti!', 'green');
    } catch (e) {
        log('Impossibile copiare: ' + e.message, 'red');
    }
    document.body.removeChild(textarea);
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

        // Show copy log button when there's actual content (not just initial "--")
        var copyBtn = document.getElementById('copyLogBtn');
        if (copyBtn && consoleEl.textContent.trim() !== '--') {
            copyBtn.classList.remove('hidden');
        }
    }

function getReloadAfterJbValue() {
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
    var isBinLoader = storage.session.getBoolean('binloader', false);
    if (storage.session.getBoolean('jailbreakNow', true)) {
        storage.session.remove('jailbreakNow');
    }
    storage.session.remove('autoJbRetry');
    storage.session.remove('payload_path');
    storage.session.remove('binloader');

    // Stop exploit timer on success
    stopExploitTimer();

    // Re-enable exploit run button
    resetJailbreakUI(true);

    updateJbStats(0, 1);

    if (getReloadAfterJbValue() && !isBinLoader) {
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

// Called when jailbreak fails - re-enables UI for retry
function jailbreakFailure() {
    // Stop exploit timer on failure
    stopExploitTimer();
    
    // Re-enable exploit run button for retry
    resetJailbreakUI(false);
    
    // Clear the auto-retry flag so user can manually retry
    storage.session.remove('autoJbRetry');
    user.blockJailbreak = false;
}

// Reset jailbreak UI state (button, etc.)
function resetJailbreakUI(success) {
    user.blockJailbreak = false;
    if (typeof ui !== 'undefined' && ui.exploitRunBtn) {
        ui.exploitRunBtn.disabled = false;
        ui.exploitRunBtn.style.opacity = '';
        ui.exploitRunBtn.style.cursor = '';
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
 * HTTP payload sender to the Elf Loader using GET (ES5 Compatible)
 * 
 * @param {string} payload_path path to the payload. e.g. ./includes/payloads/HEN/nexHEN-ps4.elf
 * @param {function} log - The logging function to use
 * @param {number} retryForMs - How long to retry connection failures while the receiver starts
 */
function sendToElfldr(payload_path, log, retryForMs) {
    if (payload_path.indexOf("nexHEN-ps4.bin") !== -1) payload_path = payload_path.replace('.bin', '.elf');
    var payloadLink = document.createElement('a');
    payloadLink.href = payload_path;
    var targetUrl = "http://127.0.0.1:9021/?uri=" + payloadLink.href;
    var retryWindow = Math.max(0, Number(retryForMs) || 0);
    var deadline = Date.now() + retryWindow;
    var lang = window.lang || {};

    function message(key, fallback) {
        return lang[key] || fallback;
    }

    log(message("elfLoaderSending", "Sending payload to the Elf Loader..."));
    return new Promise(function (resolve) {
        function attempt() {
            var request;
            var finished = false;
            var requestTimeout = retryWindow
                ? Math.max(1, Math.min(1500, deadline - Date.now()))
                : 5000;

            function finish(success) {
                if (finished) return;
                finished = true;
                resolve(success);
            }

            function retryOrFail() {
                if (finished) return;
                finished = true;
                if (Date.now() < deadline) {
                    setTimeout(function () {
                        if (Date.now() < deadline) {
                            attempt();
                        } else {
                            log(message("elfLoaderNetworkError", "Error: Network request failed"), 'orange');
                            resolve(false);
                        }
                    }, Math.min(250, deadline - Date.now()));
                } else {
                    log(message("elfLoaderNetworkError", "Error: Network request failed"), 'orange');
                    resolve(false);
                }
            }

            try {
                request = new XMLHttpRequest();
                request.timeout = requestTimeout;
                request.onload = function () {
                    if (finished) return;
                    var responseText = request.responseText || '';
                    // HTTP 200 means the receiver accepted the request.
                    if (request.status !== 200 || responseText.indexOf("Error") !== -1) {
                        log(message("elfLoaderError", "The Elf Loader returned an error: {status} {body}")
                            .replace("{status}", request.status)
                            .replace("{body}", responseText), 'orange');
                        finish(false);
                        return;
                    }
                    log(message("elfLoaderResponse", "Payload sent successfully through the Elf Loader!\nStatus: {status} {statusText}\nResponse: {body}")
                        .replace("{status}", request.status)
                        .replace("{statusText}", request.statusText)
                        .replace("{body}", responseText), 'green');
                    finish(true);
                };
                request.onerror = retryOrFail;
                request.ontimeout = retryOrFail;
                request.onabort = function () {
                    if (finished) return;
                    log(message("elfLoaderRequestAborted", "Error: Network request aborted"), 'orange');
                    finish(false);
                };
                request.open('GET', targetUrl, true);
                request.send();
            } catch (error) {
                log(message("elfLoaderError", "The Elf Loader returned an error: {status} {body}")
                    .replace("{status}", request ? request.status || 0 : 0)
                    .replace("{body}", error.message || error), 'orange');
                finish(false);
            }
        }

        attempt();
    });
}

function sendNexHENAfterElfLoader(payload_path, log) {
    if (!/(?:^|\/)nexHEN-ps4\.bin(?:[?#]|$)/i.test(payload_path || "")) {
        return Promise.resolve(null);
    }

    return new Promise(function (resolve) {
        setTimeout(resolve, 3000);
    }).then(function () {
        return sendToElfldr("./includes/payloads/HEN/nexHEN-ps4.elf", log, 5000);
    });
}
