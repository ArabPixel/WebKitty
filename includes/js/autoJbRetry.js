function setAutoJbRetry(checked) {
    localStorage.setItem('autoJbRetry', checked);
    sessionStorage.setItem('autoJbRetry', checked);

    if (!checked) return;
    if (confirm(window.lang.autoJbRetryConfirm)) jailbreak();
}

// When jailbreak succeds, this will be stopped
function autoJailbreak() {
    // used for 6.7x jailbreak when userland is loaded on jailbreak only.
    if (sessionStorage.getItem('jailbreakNow') == "true") {
        jailbreak();
        return;
    }
    var checked = (localStorage.getItem('autoJbRetry') || 'true') === 'true'; // default to true if not set
    var sessionChecked = sessionStorage.getItem('autoJbRetry') == 'true';
    ui.autoJbRetry.checked = checked;
    // check if supported ps4
    if (window.ps4Fw < webKitMin || window.ps4Fw > webKitMax || !window.ps4Fw) return;
    // If auto jb is checked and previous jailbreak attempt was unsuccessful, retry jailbreak with a timer
    if (checked && sessionChecked) {
        autoJailbreakTimer();
    }
}

// localStorage retry value true but no sessionStorage value? use timer.
function autoJailbreakTimer() {
    var timer = 3; // Start a longer countdown immediately
    ui.stopAutoJbBtn.classList.toggle('hidden');
    autoJbInterval = setInterval(() => {

        ui.clickToStartText.textContent = window.lang.jailbreakCountDown.replace('{seconds}', timer);
        ui.clickToStartText.style.fontSize = "15px";
        if (timer <= 0) {
            clearInterval(autoJbInterval);
            jailbreak();
        }
        timer--;
    }, 1000);
}
