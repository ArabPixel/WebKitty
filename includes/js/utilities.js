function sleep(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Taken from Feyzee61's ps4jb
function getScript(source) {
    return new Promise((resolve, reject) => {
        const gs = document.createElement('script');
        gs.src = source;
        gs.async = false;
        gs.onload = () => resolve();
        gs.onerror = () => reject(new Error("Script load failed: " + source));
        document.body.appendChild(gs);
    });
}

// Taken from Feyzee61's ps4jb
async function loadScript(script_js) {
    window.script_loaded = 0;
    await getScript(script_js);
    // Wait for script to be loaded
    while (window.script_loaded < 1) {
        await sleep(50); // Wait 50ms
    }
}

function isHttps() {
    return window.location.protocol === 'https:';
}

function log(message, color) {
    // In index.html context, use ui.consoleElement; in exploit.html, fall back to bare element
    var consoleEl = (typeof ui !== 'undefined' && ui.consoleElement)
        ? ui.consoleElement
        : document.getElementById('console');

    if (typeof user !== 'undefined' && user.clearLog && consoleEl) {
        consoleEl.textContent = '';
        user.clearLog = false;
    }
    if (!consoleEl) return;
    const span = document.createElement('span');
    span.textContent = message + '\n';
    if (color) span.style.color = color;
    consoleEl.appendChild(span);
}

/**
 * A Function to add an attempt and/or a success exploit and update the localStorage.
 * @param {boolean} attemp - Set to true if a jailbreak attempt was made.
 * @param {boolean} isSuccess - Set to true if the jailbreak was successful.
 * - Set both to false will only update the stats, useful when reloading the page.
 */
function updateJbStats(attemp, isSuccess) {
    let total = parseInt(localStorage.getItem('jbTotal') || 0);
    let success = parseInt(localStorage.getItem('jbSuccess') || 0);

    if (attemp) {
        total++;
        localStorage.setItem('jbTotal', total);
    }
    if (isSuccess) {
        success++;
        localStorage.setItem('jbSuccess', success);
    }

    // Update UI element only if in index.html context (ui/lang present)
    if (typeof ui !== 'undefined' && ui.successRateText && window.lang) {
        let rate = ((success / total) * 100).toFixed(0);
        rate = isNaN(rate) ? "0" : rate; // Handle NaN case when total is 0
        ui.successRateText.textContent = (window.lang.successRate || "Success Rate: ") + rate + "%" + ` (${success}/${total})`;
    }
}

function jailbreakSuccess(fwValue) {
    var fw = (typeof user !== 'undefined') ? user.ps4Fw : fwValue;
    if (sessionStorage.getItem('jailbreakNow') == "true" && fw >= 6.70 && fw <= 6.72) {
        sessionStorage.removeItem('jailbreakNow');
        localStorage.setItem("userlandOnlyOnJB67x", "false");
    }
    sessionStorage.setItem('autoJbRetry', 'false');
    updateJbStats(0, 1);
    setTimeout(() => { window.location.href = "./"; }, 5000);
}