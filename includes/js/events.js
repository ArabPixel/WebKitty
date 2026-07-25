// Events
// Scroll snap for the PS4
ui.mainContainer.addEventListener('scroll', () => {
    // Only apply if using a PS4
    if (user.platform != "PS4" || !ui.initialScreen) return;
    if (ui.mainContainer.scrollTop > lastScrollY) {
        // scrolling down
        if (lastSection !== "exploit") {
            document.getElementById('exploitContainer').scrollIntoView({ block: "end" });
            lastSection = "exploit";
        }
    } else if (ui.mainContainer.scrollTop < lastScrollY) {
        // scrolling up
        if (lastSection !== "initial") {
            ui.initialScreen.scrollIntoView({ block: "end" });
            lastSection = "initial";
        }
    }
    lastScrollY = ui.mainContainer.scrollTop;
});

// Launch jailbreak
ui.exploitRunBtn.addEventListener('click', () => {
    if (user.blockJailbreak) return;
    user.blockJailbreak = true;
    chooseHEN();
    jailbreak();
});

ui.psLogoContainer.addEventListener('click', () => {
    if (user.blockJailbreak) return;
    user.blockJailbreak = true;
    chooseHEN();
    jailbreak();
});

// tabs switching
ui.toolsTab.addEventListener('click', () => {
    if (ui.toolsSection.classList.contains('hidden')) {
        ui.toolsSection.classList.remove('hidden');
        ui.linuxSection.classList.add('hidden');
        ui.advancedPayloadsSection.classList.add('hidden');
        ui.customPayloadsSection.classList.add('hidden');

        ui.toolsTab.setAttribute("aria-selected", "true");
        ui.linuxTab.setAttribute("aria-selected", "false");
        ui.advancedPayloadsTab.setAttribute("aria-selected", "false");
        ui.customPayloadsTab.setAttribute("aria-selected", "false");

        ui.toolsSection.innerHTML = '';
        renderPayloads(payloadsList.filter(p => p.category === 'tools'));
    }
    ui.payloadsList.scrollTop = 0;
    // Update lastTap
    saveLastTab('tools');
})

ui.linuxTab.addEventListener('click', () => {
    if (ui.linuxSection.classList.contains('hidden')) {
        ui.toolsSection.classList.add('hidden');
        ui.linuxSection.classList.remove('hidden');
        ui.advancedPayloadsSection.classList.add('hidden');
        ui.customPayloadsSection.classList.add('hidden');

        ui.toolsTab.setAttribute("aria-selected", "false");
        ui.linuxTab.setAttribute("aria-selected", "true");
        ui.advancedPayloadsTab.setAttribute("aria-selected", "false");
        ui.customPayloadsTab.setAttribute("aria-selected", "false");

        ui.linuxSection.innerHTML = '';
        renderPayloads(payloadsList.filter(p => p.category === 'linux'));
    }
    ui.payloadsList.scrollTop = 0;
    // Update lastTap
    saveLastTab('linux');
});

ui.advancedPayloadsTab.addEventListener('click', () => {
    if (ui.advancedPayloadsSection.classList.contains('hidden')) {
        ui.toolsSection.classList.add('hidden');
        ui.linuxSection.classList.add('hidden');
        ui.advancedPayloadsSection.classList.remove('hidden');
        ui.customPayloadsSection.classList.add('hidden');

        ui.toolsTab.setAttribute("aria-selected", "false");
        ui.linuxTab.setAttribute("aria-selected", "false");
        ui.advancedPayloadsTab.setAttribute("aria-selected", "true");
        ui.customPayloadsTab.setAttribute("aria-selected", "false");

        ui.advancedPayloadsSection.innerHTML = '';
        renderPayloads(payloadsList.filter(p => p.category === 'advanced'));
    }
    ui.payloadsList.scrollTop = 0;
    // Update lastTap
    saveLastTab('advanced');

});

ui.customPayloadsTab.addEventListener('click', () => {
    if (ui.customPayloadsSection.classList.contains('hidden')) {
        ui.toolsSection.classList.add('hidden');
        ui.linuxSection.classList.add('hidden');
        ui.advancedPayloadsSection.classList.add('hidden');
        ui.customPayloadsSection.classList.remove('hidden');

        ui.toolsTab.setAttribute("aria-selected", "false");
        ui.linuxTab.setAttribute("aria-selected", "false");
        ui.advancedPayloadsTab.setAttribute("aria-selected", "false");
        ui.customPayloadsTab.setAttribute("aria-selected", "true");
    }
    ui.payloadsList.scrollTop = 0;
    // Update lastTap
    saveLastTab('custom');

});

// Save ps4Fw from select element (Only for communicating external device -> PS4 for local network)
ui.ps4FwSelect.addEventListener('change', function () {
    user.ps4Fw = ui.ps4FwSelect.value;
    localStorage.setItem('ps4Fw', ui.ps4FwSelect.value);
    ui.ps4FwSelect.style.border = "1px solid white";
    if (typeof CheckFW === "function") {
        CheckFW();
    }
})

// Stop the auto jailbreak retry on button click
ui.stopAutoJbBtn.addEventListener('click', () => {
    clearInterval(autoJbInterval);
    sessionStorage.setItem('autoJbRetry', false);
    ui.stopAutoJbBtn.classList.toggle('hidden');
    if (localStorage.getItem("theme") == "compact") {
        ui.clickToStartText.textContent = window.lang.title || "PSFree Enhanced";
    } else ui.clickToStartText.textContent = window.lang.clickToStart;
});

// turn off auto settings tab clicker after the user clicks close for the first time.
document.getElementById("close-settings").addEventListener('click', function () {
    if (localStorage.getItem("NewUser") != "0") {
        localStorage.setItem("NewUser", "0");
    }
});

// Popups
function aboutPopup() {
    ui.aboutPopupOverlay.classList.toggle('hidden');
}

function settingsPopup() {
    ui.settingsPopupOverlay.classList.toggle('hidden');
}

function chooseFanThreshold() {
    ui.chooseFanThresholdOverlay.classList.toggle('hidden');
}

// display settings panel for new users to explore the options :)
if (localStorage.getItem("NewUser") != "0") {
    settingsPopup();
}

function setAdvancedPayloads(inputState) {
    // Update variable/localstorage value
    user.advancedPayloads = inputState;
    localStorage.setItem("advancedPayloads", inputState)
    if (inputState == true) {
        // Its true, show tab and render payloads
        ui.advancedPayloadsContainer.classList.remove('hidden')
        renderPayloads(payloadsList.filter(p => p.category === 'advanced'));
    } else {
        // its false, hide payloads' tab and move to tools' tab
        ui.advancedPayloadsContainer.classList.add('hidden')
        ui.toolsTab.click();
    }
}

// save exploit chain method to localStorage
function exploitChain(value) {
    localStorage.setItem('exploitChain', value);
    user.exploitChain = parseFloat(value);
}

function setBareboneJB(checked) {
    if (user.ps4Fw >= 6.70 && user.ps4Fw <= 6.72 && checked) {
        alert("Jailbreak now?");
        cleanUp();
        location.replace('./exploit.html');
    }
    localStorage.setItem("bareboneJB", checked);
    user.bareboneJB = checked;
}

function updateUserlandOnlyOnJB67x(checked) {
    localStorage.setItem('userlandOnlyOnJB67x', checked);
}

function clearStats() {
    if (!confirm(window.lang.clearStatsConfirm)) return;
    localStorage.removeItem('jbTotal');
    localStorage.removeItem('jbSuccess');
    ui.successRateText.textContent = window.lang.successRate + "0% (0/0)";
}

// To be only used when this project is served on a PS4-Websrv payload on a PS4.
// Send shutdown request to the server
function shutdownServer() {
    if (!confirm(window.lang.shutdownServerConfirm)) return;

    fetch('/shutdown')
        .then(() => {
            alert("Server is shutting down. The page will now reload.");
            window.location.reload();
        })
        .catch(err => {
            alert("Server stopped? (connection lost).");
            window.location.reload();
        });
}