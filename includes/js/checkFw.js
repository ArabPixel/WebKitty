// Firmware detection and exploit chain visibility management.

function CheckFW() {
    var userAgent = navigator.userAgent;
    var ps4Console = isPS4Console();
    var fwVersion = getPs4FwVersion();
    var isLocalServer = isLocalIP(window.location.hostname);

    var elementsToHide = [
        'ps-logo-container', 'choosejb-initial', 'exploit-main-screen', 'scrollDown',
        'click-to-start-text', 'chooseGoldHEN', 'advancedPayloads', 'chooseExploitChain', 'reloadAfterJb',
    ];

    if (ps4Console && !devMode) {
        window.ps4Fw = fwVersion;
        user.ip = '127.0.0.1';
        user.ps4Fw = fwVersion;

        var fwNum = parseFloat(fwVersion);
        var supported = isFirmwareSupported(fwNum);
        updateHenFlavorVisibility(fwVersion); // GoldHEN is now supported.
        if (supported) {
            ui.ps4FwStatus.style.color = 'green';

            // Highlight the matching firmware family in the About popup
            var dotIndex = fwVersion.indexOf('.');
            var major = dotIndex !== -1 ? fwVersion.substring(0, dotIndex) : fwVersion;
            if (user.ps4Fw >= 4.50 && user.ps4Fw <= 5.07) major = '450-507';
            var el = document.getElementById('fw' + major);
            if (el) el.classList.add('fwSelected');

            updateExploitChainVisibility(fwVersion);
            firstTimeExploitChain(fwVersion);
        } else {
            // Unsupported firmware
            ui.ps4FwStatus.style.color = 'orange';
            var layoutsEl = document.getElementById('layouts');
            var layoutEl = document.getElementById('layout');
            if (layoutsEl) toggleVisibility(layoutsEl.id, 0);
            if (layoutEl) toggleVisibility(layoutEl.id, 0);

            if (isHttps()) {
                if (ui.secondHostBtn && ui.secondHostBtn[0]) {
                    toggleVisibility(ui.secondHostBtn[0].id, 1);
                }
                try {
                    terminateCache(); // Dont cache in case no webkit and is https
                } catch (e) {
                    console.warn('terminateCache notice: ' + e.message);
                }
            } else {
                // Unsupported firmware on HTTP — show payloads panel only
                var toRemove = ['exploit-main-screen', 'scrollDown', 'advancedPayloads'];
                elementsToHide = elementsToHide.filter(function (id) {
                    return toRemove.indexOf(id) === -1;
                });
                elementsToHide.push(
                    'initial-screen', 'henSelection',
                    'autoJbContainer', 'successRate', 'bareboneJBOption', 'chooseExploitChain'
                );

                var henSelection = document.getElementById('henSelection');
                if (henSelection) toggleVisibility(henSelection.id, 0);
                if (ui.payloadsSection) ui.payloadsSection.style.margin = 'auto';
                var header2 = document.getElementById('header2');
                if (header2) toggleVisibility(header2.id, 1);
            }

            for (var j = 0; j < elementsToHide.length; j++) {
                var elem = document.getElementById(elementsToHide[j]);
                if (elem) toggleVisibility(elem.id, 0);
            }
        }
    } else {
        // --- Non-PS4 browser ---
        user.platform = 'Unknown platform';
        if (/Android/.test(userAgent)) user.platform = 'Android';
        else if (/iPhone|iPad|iPod/.test(userAgent)) user.platform = 'iOS';
        else if (/Macintosh/.test(userAgent)) user.platform = 'MacOS';
        else if (/Windows/.test(userAgent)) user.platform = 'Windows';
        else if (/Linux/.test(userAgent)) user.platform = 'Linux';

        // Restore previously selected firmware for external-device (phone/PC) usage
        if (user.ps4Fw && ui.ps4FwSelect) ui.ps4FwSelect.value = user.ps4Fw;

        if (isLocalServer && !devMode) {
            // Local server mode — show IP/FW selector so phone/PC can send payloads to PS4
            toggleVisibility(ui.ps4IpInput.id, 1);
            toggleVisibility(ui.ps4FwSelect.id, 1);
            toggleVisibility(ui.scanPayLoader.id, 1);
            toggleVisibility(ui.shutdownServerBtn.id, 1);
            var customTab = document.getElementById('customPayloadsTab');
            if (customTab) toggleVisibility(customTab.id, 1);
            ui.ps4IpInput.value = user.ip;

            var toRemove2 = ['exploit-main-screen', 'scrollDown', 'advancedPayloads', 'custom-tab'];
            elementsToHide = elementsToHide.filter(function (id) {
                return toRemove2.indexOf(id) === -1;
            });
            elementsToHide.push(
                'initial-screen', 'henSelection', 'autoJbContainer', 'successRate',
                'bareboneJBOption', 'chooseExploitChain', 'layouts', 'layout', 'theme'
            );

            if (user.platform === 'Android' || user.platform === 'iOS') {
                elementsToHide.push('exploit-status-panel');
                var expCont = document.getElementById('exploitContainer');
                if (expCont) expCont.style.display = 'block';
                if (ui.exploitScreen) ui.exploitScreen.style.padding = '0';
                var lay1 = document.getElementById('layouts');
                var lay2 = document.getElementById('layout');
                if (lay1) toggleVisibility(lay1.id, 0);
                if (lay2) toggleVisibility(lay2.id, 0);
            }
            if (ui.payloadsSection) {
                ui.payloadsSection.style.width = '100%';
                ui.payloadsSection.style.margin = 'auto';
            }

            // Move the settings icon to a more accessible position
            var h2 = document.getElementById('header2');
            if (h2) {
                h2.classList.remove('hidden', 'left-6');
                h2.classList.add('flex', 'inherit');

                // Add borders to buttons in the secondary header
                var buttons = h2.querySelectorAll('button');
                for (var b = 0; b < buttons.length; b++) {
                    buttons[b].classList.add('border', 'border-white/20', 'rounded-xl');
                }
            }

            if (!devMode) {
                for (var k = 0; k < elementsToHide.length; k++) {
                    var elHide = document.getElementById(elementsToHide[k]);
                    if (elHide) toggleVisibility(elHide.id, 0);
                }
            }
        }

        if (ui.ps4FwStatus) {
            ui.ps4FwStatus.style.color = 'red';
            ui.ps4FwStatus.style.textAlign = 'center';
        }
    }
}

// Set a default exploit chain for first-time PS4 users based on their firmware.
// Only runs if no chain has been stored in storage yet.
function firstTimeExploitChain(fwVersion) {
    var current = storage.getNumber('exploitChain', null);
    if (current !== null && !isNaN(current)) return;

    var fwNum = parseFloat(fwVersion);
    var chain = getDefaultChain(fwNum);     // from firmware.js

    if (typeof exploitChain === 'function') exploitChain(chain);
    if (typeof loadExploitChain === 'function') loadExploitChain();
}

// Show/hide each exploit chain radio button based on which ones support the detected firmware.
// Uses EXPLOIT_CHAINS constants from firmware.js.
function updateExploitChainVisibility(fwVersion) {
    if (!fwVersion) return;
    var fwNum = parseFloat(fwVersion);
    if (isNaN(fwNum)) return;

    // Check if selected exploit chain is supported
    if (!isChainSupported(user.exploitChain, fwNum)) {
        user.exploitChain = getDefaultChain(fwNum);
        if (typeof exploitChain === 'function') exploitChain(user.exploitChain);
        if (typeof loadExploitChain === 'function') loadExploitChain();
    }

    toggleVisibility('modularLapseExp',       isChainSupported(EXPLOIT_CHAINS.PSFREE_MODULAR, fwNum));
    toggleVisibility('bundleLapseExp',        isChainSupported(EXPLOIT_CHAINS.PSFREE_BUNDLE, fwNum));
    toggleVisibility('badHoistExp',           isChainSupported(EXPLOIT_CHAINS.BADHOIST, fwNum));
    toggleVisibility('cssFontFaceNetCtrlExp', isChainSupported(EXPLOIT_CHAINS.CSSFONTFACE_NETCTRL, fwNum));
    toggleVisibility('cssFontFaceLapseExp',   isChainSupported(EXPLOIT_CHAINS.CSSFONTFACE_LAPSE, fwNum));
    toggleVisibility('slopKitLapseExp',       isChainSupported(EXPLOIT_CHAINS.SLOPKIT_LAPSE, fwNum));
    toggleVisibility('slopKitNetCtrlExp',     isChainSupported(EXPLOIT_CHAINS.SLOPKIT_NETCTRL, fwNum));
    toggleVisibility('relapseExp',            isChainSupported(EXPLOIT_CHAINS.RELAPSE, fwNum));
    toggleVisibility('bpfDoubleFreeExp',      isChainSupported(EXPLOIT_CHAINS.BPF_DOUBLE_FREE, fwNum));
}