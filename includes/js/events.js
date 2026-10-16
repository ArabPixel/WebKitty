// DOM event listeners and popup toggle functions.

// Scroll snap (PS4 only)
ui.mainContainer.addEventListener('scroll', function () {
    if (!isPS4Console() || !ui.initialScreen) return;

    if (ui.mainContainer.scrollTop > lastScrollY) {
        if (lastSection !== 'exploit') {
            document.getElementById('exploitContainer').scrollIntoView({ block: 'end' });
            lastSection = 'exploit';
        }
    } else if (ui.mainContainer.scrollTop < lastScrollY) {
        if (lastSection !== 'initial') {
            ui.initialScreen.scrollIntoView({ block: 'end' });
            lastSection = 'initial';
        }
    }
    lastScrollY = ui.mainContainer.scrollTop;
});

// Jailbreak launch
ui.exploitRunBtn.addEventListener('click', function () {
    if (user.blockJailbreak) return;
    user.blockJailbreak = true;
    chooseHEN();
    jailbreak();
});

ui.psLogoContainer.addEventListener('click', function () {
    if (user.blockJailbreak) return;
    user.blockJailbreak = true;
    chooseHEN();
    jailbreak();
});

// Tab switching
var TAB_SECTIONS = {
    'tools': ui.toolsSection,
    'homebrew': ui.homebrewSection,
    'linux': ui.linuxSection,
    'advanced': ui.advancedPayloadsSection,
    'custom': ui.customPayloadsSection,
};
var TAB_BUTTONS = {
    'tools': ui.toolsTab,
    'homebrew': ui.homebrewTab,
    'linux': ui.linuxTab,
    'advanced': ui.advancedPayloadsTab,
    'custom': ui.customPayloadsTab,
};

function switchTab(tabName) {
    // Hide all sections and deselect all tab buttons
    for (var key in TAB_SECTIONS) {
        if (TAB_SECTIONS.hasOwnProperty(key)) {
            var section = TAB_SECTIONS[key];
            var button = TAB_BUTTONS[key];
            if (section) toggleVisibility(section.id, 0);
            if (button) button.setAttribute('aria-selected', 'false');
        }
    }

    // Show the target section and mark its button selected
    var targetSection = TAB_SECTIONS[tabName];
    var targetButton = TAB_BUTTONS[tabName];
    if (targetSection) toggleVisibility(targetSection.id, 1);
    if (targetButton) targetButton.setAttribute('aria-selected', 'true');

    // Render payload cards for the active tab (skip 'custom' — it has static HTML)
    if (tabName !== 'custom') {
        var filtered = [];
        if (typeof payloadsList !== 'undefined') {
            for (var i = 0; i < payloadsList.length; i++) {
                if (payloadsList[i].category === tabName) {
                    filtered.push(payloadsList[i]);
                }
            }
        }
        renderPayloads(filtered);
    }

    if (ui.payloadsList) ui.payloadsList.scrollTop = 0;
    saveLastTab(tabName);
}

ui.toolsTab.addEventListener('click', function () {
    if (!ui.toolsSection.classList.contains('hidden')) return;
    switchTab('tools');
});

ui.homebrewTab.addEventListener('click', function () {
    if (!ui.homebrewSection.classList.contains('hidden')) return;
    switchTab('homebrew');
});

ui.linuxTab.addEventListener('click', function () {
    if (!ui.linuxSection.classList.contains('hidden')) return;
    switchTab('linux');
});

ui.advancedPayloadsTab.addEventListener('click', function () {
    if (!ui.advancedPayloadsSection.classList.contains('hidden')) return;
    switchTab('advanced');
});

ui.customPayloadsTab.addEventListener('click', function () {
    if (!ui.customPayloadsSection.classList.contains('hidden')) return;
    switchTab('custom');
});

// PS4 firmware manual selector (local-server / phone mode)
ui.ps4FwSelect.addEventListener('change', function () {
    user.ps4Fw = ui.ps4FwSelect.value;
    storage.set('ps4Fw', ui.ps4FwSelect.value);
    ui.ps4FwSelect.style.border = '1px solid white';
    if (typeof CheckFW === 'function') CheckFW();
});

// Auto-jailbreak stop button
ui.stopAutoJbBtn.addEventListener('click', function () {
    clearInterval(autoJbInterval);
    storage.session.set('autoJbRetry', false);
    toggleVisibility(ui.stopAutoJbBtn.id);
    var currentTheme = storage.getString('theme', 'index');
    if (currentTheme === 'compact') {
        ui.clickToStartText.textContent = projectName;
    } else {
        ui.clickToStartText.textContent = (window.lang && window.lang.clickToStart) || 'Click to Start';
    }
});

document.getElementById('DebugConsole').addEventListener('click', function () {
    ui.consoleElement.innerText = '';
    log("Debug console cleared.");
});

// Update-cache button
ui.updateCacheBtn.addEventListener('click', function () {
    window.location.href = testModeUrl('./cache.html');
});

// Popup toggles
function aboutPopup() {
    toggleVisibility(ui.aboutPopupOverlay.id);
}

function settingsPopup() {
    toggleVisibility(ui.settingsPopupOverlay.id);
}

function themePopup() {
    toggleVisibility(ui.themePopupOverlay.id);
}

function chooseFanThreshold() {
    toggleVisibility(ui.chooseFanThresholdOverlay.id);
}

// Settings handlers
function setAdvancedPayloads(inputState) {
    user.advancedPayloads = inputState;
    storage.set('advancedPayloads', inputState);
    if (inputState === true || inputState === 'true') {
        toggleVisibility(ui.advancedPayloadsContainer.id, 1);
        var advancedList = [];
        if (typeof payloadsList !== 'undefined') {
            for (var i = 0; i < payloadsList.length; i++) {
                if (payloadsList[i].category === 'advanced') {
                    advancedList.push(payloadsList[i]);
                }
            }
        }
        renderPayloads(advancedList);
    } else {
        toggleVisibility(ui.advancedPayloadsContainer.id, 0);
        ui.toolsTab.click();
    }
}

// select exploit option when loading the page
function loadExploitChain() {
    var radioElement = document.querySelector('input[name="exploitChain"][value="' + user.exploitChain + '"]');
    if (radioElement) {
        radioElement.checked = true;
    }
}

// Saves exploit chain choice to storage and updates user state
function exploitChain(value) {
    storage.set('exploitChain', value);
    user.exploitChain = parseFloat(value);
}

function updateBareboneJB() {
    if (ui.bareboneJBInput) {
        ui.bareboneJBInput.checked = user.bareboneJB;
    }
}

function setBareboneJB(checked) {
    storage.set('bareboneJB', checked);
    user.bareboneJB = checked;
}

function clearStats() {
    if (!confirm(window.lang.clearStatsConfirm)) return;
    storage.remove('jbTotal');
    storage.remove('jbSuccess');
    ui.successRateText.textContent = (window.lang.successRate || 'Success Rate: ') + '0% (0/0)';
}

// To be only used when this project is served on a PS4-Websrv payload on a PS4.
// Send shutdown request to the server
function shutdownServer() {
    if (!confirm(window.lang.shutdownServerConfirm)) return;

    fetch('/shutdown')
        .then(function () {
            alert('Server is shutting down. The page will now reload.');
            window.location.reload();
        })
        .catch(function () {
            alert('Server stopped? (connection lost).');
            window.location.reload();
        });
}