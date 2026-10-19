function loadLanguage() {
    var langRadio = document.querySelector('input[name="language"][value="' + user.currentLanguage + '"]');
    if (!langRadio) {
        user.currentLanguage = 'en';
        langRadio = document.querySelector('input[name="language"][value="en"]');
    }
    if (langRadio) langRadio.checked = true;

    var selectedLanguage = user.currentLanguage;
    return new Promise(function (resolve, reject) {
        function loadScript(language, onLoad) {
            var langScript = document.getElementById("langScript");
            if (langScript) langScript.remove();

            var script = document.createElement('script');
            script.src = './includes/js/languages/' + language + '.js';
            script.id = "langScript";
            script.onload = onLoad;
            script.onerror = function () { reject(new Error('Failed to load ' + language)); };
            document.head.appendChild(script);
        }

        function loadSelectedLanguage(englishStrings) {
            loadScript(selectedLanguage, function () {
                var selectedStrings = window.lang;
                var combinedStrings = {};
                var key;
                for (key in englishStrings) {
                    if (Object.prototype.hasOwnProperty.call(englishStrings, key)) {
                        combinedStrings[key] = englishStrings[key];
                    }
                }
                for (key in selectedStrings) {
                    if (Object.prototype.hasOwnProperty.call(selectedStrings, key)) {
                        combinedStrings[key] = selectedStrings[key];
                    }
                }
                window.lang = combinedStrings;
                resolve(window.lang);
            });
        }

        if (selectedLanguage === 'en') {
            loadScript('en', function () { resolve(window.lang); });
        } else {
            loadScript('en', function () {
                var englishStrings = window.lang;
                loadSelectedLanguage(englishStrings);
            });
        }
    });
}

function isRtl() {
        return rtlLangs.indexOf(user.currentLanguage) !== -1;
}

function saveLanguage(language) {
    if (!language) return;
    storage.set('language', language);
    user.currentLanguage = language;
    initLanguage();
}

// Update UI language
function applyLanguage(lang) {
    user.currentLanguage = lang;
    var strings = window.lang;

    if (!strings) {
        console.error('Language list ' + lang + ' is not available');
        return;
    }

    /**
     * Safely updates element textContent only if translation exists and is non-empty.
     */
    function updateText(element, key) {
        var translation = strings[key];
        if (element && translation) {
            element.textContent = translation;
        }
    }

    /**
     * Safely updates element title attribute only if translation exists and is non-empty.
     */
    function updateTitle(element, key) {
        var translation = strings[key];
        if (element && translation) {
            element.title = translation;
        }
    }

    // Document Properties
    document.title = projectName;
    document.dir = isRtl() ? 'rtl' : 'ltr';
    if (ui.consoleElement) ui.consoleElement.dir = document.dir;
    document.lang = user.currentLanguage;

    // PS4 Firmware Status
    var ps4Fw = window.ps4Fw;
    var supported = isFirmwareSupported(ps4Fw);

    if (ps4Fw === undefined) {
        if (strings.notPs4 && strings.notPs4.length > 0) {
            ui.ps4FwStatus.textContent = strings.notPs4 + user.platform;
        }
    } else if (supported) {
        if (strings.ps4FwCompatible && strings.ps4FwCompatible.length > 0) {
            ui.ps4FwStatus.textContent = strings.ps4FwCompatible.replace('{ps4fw}', ps4Fw);
        }
    } else {
        if (strings.ps4FwIncompatible && strings.ps4FwIncompatible.length > 0) {
            ui.ps4FwStatus.textContent = strings.ps4FwIncompatible.replace('{ps4fw}', ps4Fw);
        }
    }

    // Main Screen Elements
    var currentTheme = storage.getString('theme', 'index');
    if (currentTheme == 'compact') {
        updateText(ui.clickToStartText, projectName);
    } else {
        updateText(ui.clickToStartText, 'clickToStart');
    }

    updateText(document.querySelector('#choosejb-initial h3'), 'chooseHEN');

    // About Popup
    if (ui.aboutPopup) {
        updateText(ui.aboutPopup.querySelector('h2'), 'aboutMenu');
        if (projectName) ui.aboutPopup.querySelector('h2').textContent += ' ' + projectName;

        var aboutParagraphs = ui.aboutPopup.querySelectorAll('p');
        if (aboutParagraphs.length > 0) updateText(aboutParagraphs[0], 'aboutVersion');
        if (aboutParagraphs.length > 1) updateText(aboutParagraphs[1], 'aboutDescription');
        if (aboutParagraphs.length > 2) updateText(aboutParagraphs[2], 'hostedOn');
        updateText(ui.aboutPopup.querySelector('#PS4FWOK h3'), 'ps4FirmwareSupportedHeader');

        var listFw = ui.aboutPopup.querySelector('#listfw');
        if (listFw) listFw.style.direction = 'ltr';

        updateText(ui.aboutPopup.querySelector('#close-about'), 'closeButton');
        updateText(ui.aboutPopup.querySelector('#payloaderFirmwareSemiSupported i'), 'payloaderFirmwareSemiSupported');
        updateText(ui.aboutPopup.querySelector('#creditsHeader'), 'creditsHeader');
    }
    updateText(ui.bareboneJbBtn, 'bareboneJB');

    // Fan Threshold
    if (ui.chooseFanThreshold) {
        updateText(ui.chooseFanThreshold.querySelector('#close-fanChoose'), 'closeButton');
        updateText(ui.chooseFanThreshold.querySelector('h2'), 'fanTitle');
        updateText(ui.chooseFanThreshold.querySelector('p'), 'fanDescription');
        updateText(ui.chooseFanThreshold.querySelector('h3'), 'selectTemp');
    }
    updateText(document.getElementById('defaultTemp'), 'default');

    // Settings Popup
    if (ui.settingsPopup) {
        updateText(ui.settingsPopup.querySelector('h2'), 'settingsBtnTitle');
        updateText(ui.settingsPopup.querySelector('#close-settings'), 'closeButton');
        updateText(ui.settingsPopup.querySelector('#ghVer'), 'ghVer');
        var ghOtherVer = ui.settingsPopup.querySelector('#chooseGoldHEN summary');
        if (ghOtherVer) updateText(ghOtherVer, 'otherVer');
        updateText(ui.settingsPopup.querySelector('#latestVer'), 'latestVer');
        updateText(ui.settingsPopup.querySelector('#scanPayLoader'), 'scanPayloadLoader');
        updateText(ui.settingsPopup.querySelector('#shutdownServerBtn'), 'shutdownServerBtn');
        updateText(ui.settingsPopup.querySelector('#reloadAfterJbText'), 'reloadAfterJbText');
    }

    if (ui.themePopup) {
        updateText(ui.themePopup.querySelector('#chooselang h3'), 'languageHeader');
        updateText(ui.themePopup.querySelector('h2'), 'themeSettingsHeader');
        updateText(ui.themePopup.querySelector('#close-theme'), 'closeButton');
        updateText(document.getElementById('catppuccinoColor'), 'catppuccino');
    }
    updateText(document.getElementById('showAdvancedPayloads'), 'showAdvancedPayloads');
    updateText(document.getElementById('optionsHeader'), 'optionsHeader');
    updateText(document.getElementById('layout'), 'layouts');
    updateText(document.getElementById('defaultTheme'), 'default');
    updateText(document.getElementById('compactTheme'), 'compactTheme');
    updateText(document.getElementById('vibrantColor'), 'vibrantColor');
    updateText(document.getElementById('themeWord'), 'themeWord');
    updateText(document.getElementById('defaultColor'), 'default');
    updateText(document.getElementById('modularLapse'), 'modularLapse');
    updateText(document.getElementById('bundleLapse'), 'bundleLapse');
    updateText(document.getElementById('autoJbRetryText'), 'autoJbRetryText');
    updateText(ui.exploitChainTitle, 'exploitChainTitle');

    // Buttons
    if (ui.secondHostBtn && ui.secondHostBtn[0]) updateText(ui.secondHostBtn[0], 'secondHostBtn');
    if (ui.secondHostBtn && ui.secondHostBtn[1]) updateText(ui.secondHostBtn[1], 'secondHostBtn');
    updateTitle(ui.exploitRunBtn, 'clickToStart');

    updateTitle(ui.aboutBtns[0], 'aboutMenu');
    updateTitle(ui.aboutBtns[1], 'aboutMenu');
    updateTitle(ui.settingsBtns[0], 'settingsBtnTitle');
    updateTitle(ui.settingsBtns[1], 'settingsBtnTitle');
    updateTitle(ui.customizeBtns[0], 'themeSettingsHeader');
    updateTitle(ui.customizeBtns[1], 'themeSettingsHeader');


    updateText(document.querySelector('#exploit-status-panel div h2'), 'exploitStatusHeader');
    updateText(ui.successRateText, 'successRate');
    updateText(ui.payloadsSectionTitle, 'payloadsHeader');
    updateText(ui.toolsTab, 'payloadsToolsHeader');
    updateText(ui.homebrewTab, 'payloadsHomebrewHeader');
    updateText(ui.linuxTab, 'payloadsLinuxHeader');
    updateText(ui.advancedPayloadsTab, 'advanced');
    updateText(ui.customPayloadsTab, 'payloadsCustomHeader');
    updateText(document.getElementById('customPayloadUpload'), 'customPayloadUpload')
    if (ui.consoleElement) updateText(ui.consoleElement.querySelector('center'), 'waitingUserInput');
    updateText(ui.updateCacheBtn, 'updateCache');

    // Fan threshold "Default" option direction
    var defaultTempDiv = document.getElementById('defaultTempDiv');
    if (defaultTempDiv) {
        defaultTempDiv.style.float = isRtl() ? 'left' : 'right';
    }
}