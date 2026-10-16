// Handles automatic jailbreak retry logic and countdown timers.

function setAutoJbRetry(checked) {
    storage.set('autoJbRetry', checked);
    storage.session.set('autoJbRetry', checked);

    if (!checked) return;
    if (confirm(window.lang.autoJbRetryConfirm)) jailbreak();
}

// When jailbreak succeeds, this will be stopped
function autoJailbreak() {
    // used for 6.7x jailbreak when userland is loaded on jailbreak only.
    var jbNow = storage.session.getBoolean('jailbreakNow', false);
    if (jbNow) {
        jailbreak();
        return;
    }

    var checked = storage.getBoolean('autoJbRetry', true);
    var sessionChecked = storage.session.getBoolean('autoJbRetry', false);

    if (ui.autoJbRetry) ui.autoJbRetry.checked = checked;

    // check if supported ps4
    var isSupported = isFirmwareSupported(window.ps4Fw);
    if (!isSupported || !window.ps4Fw) return;

    // If auto jb is checked and previous jailbreak attempt was unsuccessful, retry jailbreak with a timer
    if (checked && sessionChecked) {
        autoJailbreakTimer();
    }
}

// Storage retry value true but no sessionStorage value? use timer.
function autoJailbreakTimer() {
    var timer = 3; // Start a longer countdown immediately
    if (ui.stopAutoJbBtn) toggleVisibility(ui.stopAutoJbBtn.id);
    autoJbInterval = setInterval(function () {
        if (ui.clickToStartText) {
            ui.clickToStartText.textContent = (window.lang.jailbreakCountDown || 'Retrying in {seconds} seconds...').replace('{seconds}', timer);
            ui.clickToStartText.style.fontSize = "15px";
        }
        if (timer <= 0) {
            clearInterval(autoJbInterval);
            jailbreak();
        }
        timer--;
    }, 1000);
}

function setReloadAfterJb(checked) {
    storage.set('reloadAfterJb', checked);
}

function getReloadAfterJb() {
    var checked = storage.getBoolean('reloadAfterJb', false);
    var input = document.getElementById('reloadAfterJbInput');
    if (input) input.checked = checked;
    return checked;
}