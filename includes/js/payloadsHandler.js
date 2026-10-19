// Handles payload tab loading, rendering, and dispatching.
// payloads tabs
function loadLastTab() {
    if (user.lastTab == "advanced" && !user.advancedPayloads) {
        // set last tab to tools
        user.lastTab = "tools";
        if (ui.toolsSection) ui.toolsSection.click();
    }
    var targetEl = document.getElementById(user.lastTab);
    if (targetEl) toggleVisibility(targetEl.id, 1);
    var tabEl = document.getElementById(user.lastTab + '-tab');
    if (tabEl) tabEl.setAttribute("aria-selected", "true");
}

function saveLastTab(tab) {
    // Update state
    user.lastTab = tab;
    storage.set('lastTab', tab);

    // Define the map of containers
    var sections = {
        'tools': ui.toolsSection,
        'homebrew': ui.homebrewSection,
        'linux': ui.linuxSection,
        'advanced': ui.advancedPayloadsSection,
        'custom': ui.customPayloadsSection
    };

    // Nuke contents of every section but the active one and custom to free memory
    for (var key in sections) {
        if (sections.hasOwnProperty(key)) {
            if (key !== tab && sections[key] && key !== 'custom') {
                sections[key].innerHTML = '';
            }
        }
    }
}

function Loadpayloads(payload) {
    if (payload.id == "FanThreshold") {
        chooseFanThreshold();
        return;
    }
    if (!isPS4Console()) {
        var inputIp = ui.ps4IpInput ? ui.ps4IpInput.value.trim() : "";
        if (!inputIp || /\s/.test(inputIp)) {
            alert(window.lang.ps4IpInvalid);
            return;
        }

        if (user.ps4Fw == null || user.ps4Fw == 'undefined') {
            if (ui.ps4FwSelect) ui.ps4FwSelect.style.border = "2px solid red";
            return;
        }
        user.ip = inputIp;
    }
    try {
        storage.session.remove('binloader');
        
        if (payload.id == undefined) {
            var payloadFile = ui.customPayloadInput ? ui.customPayloadInput.files[0] : null;
            if (!payloadFile) return;
            customPayload(payloadFile);
        } else {
            payloadRouter(payload);
        }

    } catch (e) {
        alert('Failed to load payload: ' + payload.name + ' | Error: ' + e);
    }
}

function loadFanThreshold(temperature) {
    var supportedTemperatures = {
        "60": true,
        "70": true,
        "80": true,
        "85": true
    };

    if (!Object.prototype.hasOwnProperty.call(supportedTemperatures, temperature)) {
        alert('Invalid fan threshold selection.');
        return;
    }

    toggleVisibility(ui.chooseFanThresholdOverlay.id, false);
    Loadpayloads({
        id: 'FanThreshold' + temperature,
        name: 'Fan Threshold (' + temperature + '°C)',
        specificFW: '4.73 - latest',
        src: payloadsPath + 'fan-thresholds/ps4-fan-threshold' + temperature + '.bin'
    });
}

function renderPayloads(payloads) {
    if (!payloads || !payloads.length) return;

    // Identify the target container
    var firstCategory = payloads[0].category;
    var targetContainer;

    if (firstCategory === 'tools') targetContainer = ui.toolsSection;
    else if (firstCategory === 'homebrew') targetContainer = ui.homebrewSection;
    else if (firstCategory === 'linux') targetContainer = ui.linuxSection;
    else if (firstCategory === 'advanced') targetContainer = ui.advancedPayloadsSection;

    // Clear previous elements to avoid duplication
    if (targetContainer) targetContainer.innerHTML = '';

    for (var i = 0; i < payloads.length; i++) {
        (function (payload) {
            // hide unsupported payloads
            if (hideUnsupportedPayloads) {
                if (typeof user !== 'undefined' && user.ps4Fw) {
                    if (!isPayloadSupported(payload)) {
                        console.log(payload.name + " is not supported on firmware " + user.ps4Fw)
                        return; // Skip rendering this card
                    }
                }
            }

            var payloadCard = document.createElement('div');
            payloadCard.id = payload.id;
            payloadCard.onclick = function () {
                Loadpayloads(payload);
            };
            payloadCard.className = 'payload payload-card relative group cursor-pointer duration-300 transform hover:scale-102';
            payloadCard.dataset.payloadId = payload.id;

            var specificFwHtml = payload.specificFW ? '<p style="color: orange;">' + payload.specificFW + '</p>' : '';

            payloadCard.innerHTML =
                '<button class="w-full payloadContainer">' +
                '<div class="bg-gray-800 border border-white/20 rounded-xl p-6 h-full">' +
                '<div class="flex items-start justify-between mb-4">' +
                '<div class="flex items-center space-x-3">' +
                '<div>' +
                '<h3 class="text-start font-semibold text-white text-lg">' + payload.name + '</h3>' +
                '<p class="text-start text-cyan-300" style="font-size: 0.75rem">' + payload.author + '</p>' +
                '</div>' +
                '</div>' +
                '<span class="px-2 py-1 rounded-full text-xs border ' + getPayloadCategoryClass(payload.category) + '">' +
                payload.category +
                '</span>' +
                '</div>' +
                '<p class="text-start text-white/70 text-sm leading-relaxed">' + payload.description + '</p>' +
                '<div class="flex items-center justify-between text-xs text-white/60">' +
                specificFwHtml +
                '</div>' +
                '</div>' +
                '</button>';

            switch (payload.category) {
                case "tools":
                    if (ui.toolsSection) ui.toolsSection.appendChild(payloadCard);
                    break;
                case "homebrew":
                    if (ui.homebrewSection) ui.homebrewSection.appendChild(payloadCard);
                    break;
                case "linux":
                    if (ui.linuxSection) ui.linuxSection.appendChild(payloadCard);
                    break;
                case "advanced":
                    if (ui.advancedPayloadsSection) ui.advancedPayloadsSection.appendChild(payloadCard);
                    break;
                default:
                    if (ui.toolsSection) ui.toolsSection.appendChild(payloadCard);
                    break;
            }
        })(payloads[i]);
    }
}

function loadAdvancedPayloads() {
    if (user.advancedPayloads) {
        // its true, check the box, show tab and load the payloads
        if (ui.advancedPayloadsInput) ui.advancedPayloadsInput.checked = true;
        if (ui.advancedPayloadsContainer) toggleVisibility(ui.advancedPayloadsContainer.id, 1);
        var advancedPayloads = [];
        if (typeof payloadsList !== 'undefined') {
            for (var i = 0; i < payloadsList.length; i++) {
                if (payloadsList[i].category === 'advanced') {
                    advancedPayloads.push(payloadsList[i]);
                }
            }
        }
        renderPayloads(advancedPayloads);
    }
}

function getPayloadCategoryClass(category) {
    switch (category) {
        case 'tools': return 'category-tools';
        case 'homebrew': return 'category-homebrew';
        case 'linux': return 'category-linux';
        case 'advanced': return 'category-advanced';
        default: return '';
    }
}

/**
 * Checks if userFW is supported according to payload.specificFW string.
 * Works with rules like: "5.05, 7.00 - 8.50, 9.00 - latest"
 */
function isPayloadSupported(payload) {
    var userFW = parseFloat(getPs4FwVersion() || user.ps4Fw);
    if (!userFW) return false;

    // If payload has explicit specificFW string
    if (payload.specificFW.trim() == "") return true;
    // Replace 'latest' with max firmware supported
    var rawStr = payload.specificFW.replace(/latest/gi, commonMax);
    var rules = rawStr.split(',');

    for (var i = 0; i < rules.length; i++) {
        var rule = rules[i].trim();

        if (rule.indexOf('-') !== -1) {
            // Range: "9.00 - 14.00"
            var parts = rule.split('-');
            var minVal = parseFloat(parts[0]);
            var maxVal = parseFloat(parts[1]);

            if (userFW >= minVal && userFW <= maxVal) {
                return true;
            }
        } else {
            // Single match: "5.05"
            if (userFW == parseFloat(rule)) {
                return true;
            }
        }
    }
    return false;
}