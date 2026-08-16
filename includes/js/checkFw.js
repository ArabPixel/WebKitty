function isLocalIP(ip) {
  return /^(127\.|192\.168\.|10\.|172\.(1[6-9]|2[0-9]|3[0-1])\.)/.test(ip);
}

function getPs4FwVersion(ua) {
    if (!ua) return "";
    var match = ua.match(/PlayStation 4[\/\s]+([\d.]+)/i);
    return match ? match[1] : "";
}

function CheckFW() {
    var userAgent = navigator.userAgent;
    var ps4Regex = /PlayStation 4/;
    var fwVersion = getPs4FwVersion(userAgent);

    var elementsToHide = [
        'ps-logo-container', 'choosejb-initial', 'exploit-main-screen', 'scrollDown',
        'click-to-start-text', 'chooseGoldHEN', 'advancedPayloads', 'chooseExploitChain'
    ];

    if (ps4Regex.test(userAgent)) {
        window.ps4Fw = fwVersion;
        user.ip = "127.0.0.1";
        user.ps4Fw = fwVersion;

        var fwNum = parseFloat(fwVersion);
        if (fwNum >= webKitMin && fwNum <= webKitMax) {
            ui.ps4FwStatus.style.color = 'green';

            // Highlight firmware in about popup
            var dotIndex = fwVersion.indexOf('.');
            var major = dotIndex !== -1 ? fwVersion.substring(0, dotIndex) : fwVersion;
            var fwElement = "fw" + major;
            if (fwVersion.indexOf('11.0') === 0) {
                fwElement = "fw110";
            }
            var el = document.getElementById(fwElement);
            if (el) el.classList.add('fwSelected');

            updateExploitChainVisibility(fwVersion);
            firstTimeExploitChain(fwVersion);
        } else {
            ui.ps4FwStatus.style.color = 'orange';
            document.getElementById('layouts').style.display = "none";
            document.getElementById('theme').style.display = "none";
            if (isHttps()) {
                if (ui.secondHostBtn && ui.secondHostBtn[0]) {
                    ui.secondHostBtn[0].style.display = "block";
                }
                try {
                    terminateCache(); // Dont cache in case no webkit and is https
                } catch (e) {
                    console.warn("terminateCache notice: " + e.message);
                }
            } else {
                var toRemove = ['exploit-main-screen', 'scrollDown', 'advancedPayloads'];
                elementsToHide = elementsToHide.filter(function(e) {
                    return toRemove.indexOf(e) === -1;
                });
                elementsToHide.push('initial-screen', 'exploit-status-panel', 'henSelection', 'autoJbContainer', 'successRate', 'bareboneJBOption', 'chooseExploitChain');
                if (fwNum < 6.70) elementsToHide.push('layouts', 'theme'); // Incompatible with Compact design..
                document.getElementById('exploitContainer').style.display = "block";

                // Sizing the payload's section
                ui.payloadsSection.style.margin = "auto";
                document.getElementById('header2').classList.remove('hidden');
            }

            elementsToHide.forEach(function(id) {
                var el = document.getElementById(id);
                if (el) el.style.display = 'none';
            });
        }
    } else {
        // Not a PS4
        user.platform = 'Unknown platform';
        if (/Android/.test(userAgent)) user.platform = 'Android';
        else if (/iPhone|iPad|iPod/.test(userAgent)) user.platform = 'iOS';
        else if (/Macintosh/.test(userAgent)) user.platform = 'MacOS';
        else if (/Windows/.test(userAgent)) user.platform = 'Windows';
        else if (/Linux/.test(userAgent)) user.platform = 'Linux';

        // For user selected firmware
        if (user.ps4Fw) ui.ps4FwSelect.value = user.ps4Fw;
        // Show only if on a local server
        if ((isLocalIP(window.location.hostname) || window.location.hostname == "localhost") && !devMode) {
            // Show IP input and firmware selector for local server users on smart devices
            ui.ps4IpInput.classList.remove('hidden');
            ui.ps4FwSelect.classList.remove('hidden');
            ui.scanGoldHENPayLoader.classList.remove('hidden');
            ui.shutdownServerBtn.classList.remove('hidden');
            document.querySelector('.customPayloadsTab').classList.remove('hidden');
            ui.ps4IpInput.value = user.ip;

            var toRemove2 = ['exploit-main-screen', 'scrollDown', 'advancedPayloads', 'custom-tab'];
            elementsToHide = elementsToHide.filter(function(e) {
                return toRemove2.indexOf(e) === -1;
            });
            elementsToHide.push('initial-screen', 'henSelection', 'autoJbContainer', 'successRate', 'bareboneJBOption', 'chooseExploitChain', 'layouts', 'theme');

            // Sizing the payload's section
            // Full screen for phones, centered for desktop
            if (user.platform == "Android" || user.platform == "iOS") {
                // hide console
                elementsToHide.push('exploit-status-panel');
                document.getElementById('exploitContainer').style.display = "block";
                ui.exploitScreen.style.padding = "0";
                document.getElementById('layouts').style.display = "none";
                document.getElementById('theme').style.display = "none";
            }
            ui.payloadsSection.style.width = "100%";
            ui.payloadsSection.style.margin = "auto";
            // Moving the settings icon to a better place
            document.getElementById('header2').classList.remove('hidden', 'left-6');
            document.getElementById('header2').classList.add('flex', 'inherit');
            
            var buttons = document.getElementById('header2').querySelectorAll('button');
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].classList.add('border', 'border-white/20', 'rounded-xl');
            }
        } else {
            elementsToHide.push('theme', 'layouts', "updateCache", "settings-btn");
        }
        ui.ps4FwStatus.style.color = 'red';
        document.getElementById('PS4FW').style.width = "100%";
        document.getElementById('PS4FW').style.textAlign = "center";

        // Hide elements for non supported devices unless in dev mode
        if (!devMode) {
            elementsToHide.forEach(function(id) {
                var el = document.getElementById(id);
                if (el) el.style.display = 'none';
            });
        }
    }
}

function firstTimeExploitChain(fwVersion){
    if (localStorage.getItem('exploitChain') != null) return;
    var fwNum = parseFloat(fwVersion);
    var chain = 4; // Default to CSSFontFace Lapse
    if (fwNum >= 7.00 && fwNum <= 9.60) {
        chain = 1; // Feyzee61's PSFree Lapse
    }
    exploitChain(chain);
    loadExploitChain();
}

function toggleVisibility(id, show) {
    var el = document.getElementById(id);
    if (!el) return;
    if (show) {
        el.classList.remove('hidden');
    } else {
        el.classList.add('hidden');
    }
}

function updateExploitChainVisibility(fwVersion) {
    if (!fwVersion) return;
    var fwNum = parseFloat(fwVersion);
    if (isNaN(fwNum)) return;

    // cssfontface lapse and netctrl 9.00 - 11.02
    var showCssFontFaceLapse = (fwNum >= 9.00 && fwNum <= webKitMax);
    var showCssFontFaceNetctrl = (fwNum >= 9.00 && fwNum <= webKitMax);
    toggleVisibility('cssFontFaceNetCtrlExp', showCssFontFaceNetctrl);
    toggleVisibility('cssFontFaceLapseExp', showCssFontFaceLapse);

    // 6.70 - 6.72 sees badhoist
    var showBadHoist = (fwNum >= 6.70 && fwNum <= 6.72);
    toggleVisibility('badHoistExp', showBadHoist);

    // 7.00 - 9.60 sees modular and bundled psfree lapse
    var showPsfreeLapse = (fwNum >= 7.00 && fwNum <= 9.60);
    toggleVisibility('modularLapseExp', showPsfreeLapse);
    toggleVisibility('bundleLapseExp', showPsfreeLapse);
}