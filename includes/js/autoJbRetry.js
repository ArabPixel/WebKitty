// Handles automatic jailbreak retry logic and countdown timers.

function setAutoJbRetry(checked) {
    storage.set('autoJbRetry', checked);
    storage.session.set('autoJbRetry', checked);

    if (!checked) return;
    if (confirm(window.lang.autoJbRetryConfirm)) jailbreak();
}

function setAutoJb(checked) {
    storage.set('autoJb', checked);
    storage.session.set('autoJb', checked);
}

// When jailbreak succeeds, this will be stopped
function autoJailbreak() {
    // used for 6.7x jailbreak when userland is loaded
    var jbNow = storage.session.getBoolean('jailbreakNow', false);
    if (jbNow) {
        jailbreak();
        return;
    }

    // Auto jailbreak retry logic
    var autoJbRetryChecked = storage.getBoolean('autoJbRetry', true);
    var autoJbRetrySessionChecked = storage.session.getBoolean('autoJbRetry', false);
    if (ui.autoJbRetry) ui.autoJbRetry.checked = autoJbRetryChecked;

    // Auto jailbreak logic
    var autoJbChecked = storage.getBoolean('autoJb', false);
    var autoJbSessionChecked = storage.session.getBoolean('autoJb', true);
    if (ui.autoJb) ui.autoJb.checked = autoJbChecked;

    // check if supported ps4
    var isSupported = isFirmwareSupported(window.ps4Fw);
    if (!isSupported || !window.ps4Fw) return;

    // If auto jb retry is checked and previous jailbreak attempt was unsuccessful, retry jailbreak with a timer
    if (autoJbRetryChecked && autoJbRetrySessionChecked) {
        autoJailbreakTimer();
    }

    // If auto jb is checked and autoJb session value is false, execute jailbreak with a timer
    if (autoJbChecked && autoJbSessionChecked) {
        autoJailbreakTimer(true);
    }
}

// Storage retry value true but no sessionStorage value? use timer.
function autoJailbreakTimer(permanentJb) {
    var timer = 3; // Start a longer countdown immediately
    if (ui.stopAutoJbBtn) toggleVisibility(ui.stopAutoJbBtn.id);
    // check if language values are available, if not, use default values
    var autoJbRetryText = lang.autoJbRetry || "Retrying in {seconds} seconds...";
    var autoJbText = lang.autoJb || "Auto-Jailbreak enabled. Executing in {seconds} seconds...";
    var message = permanentJb ? autoJbText : autoJbRetryText;

    // paste this again so it displays immediately on page load
    if (ui.clickToStartText) {
        ui.clickToStartText.textContent = message.replace('{seconds}', timer);
        ui.clickToStartText.style.fontSize = "15px";
    }
    autoJbInterval = setInterval(function () {
        timer--;
        if (ui.clickToStartText) {
            ui.clickToStartText.textContent = message.replace('{seconds}', timer);
            ui.clickToStartText.style.fontSize = "15px";
        }
        if (timer < 0) {
            clearInterval(autoJbInterval);
            jailbreak();
        }
    }, 1000);
}

function setReloadAfterJb(checked) {
    storage.set('reloadAfterJb', checked);
}

function getReloadAfterJb() {
    var checked = getReloadAfterJbValue();
    var input = document.getElementById('reloadAfterJbInput');
    if (input) input.checked = checked;
    return checked;
}