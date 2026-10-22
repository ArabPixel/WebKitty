var GOLDHEN_VERSIONS = {
    'GHv2.4b18.12': 'goldhen_v2.4b18.12.bin',  
    'GHv2.4b18.10': 'goldhen_v2.4b18.10.bin',
    'GHv2.4b18.9':  'goldhen_v2.4b18.9.bin',
    'GHv2.4b18.8':  'goldhen_v2.4b18.8.bin',
    'GHv2.4b18.7':  'goldhen_v2.4b18.7.bin',
    'GHv2.4b18.6':  'goldhen_v2.4b18.6.bin',
};

var GOLDHEN_DEFAULT = 'GHv2.4b18.12'; // Latest
var HEN_BASE_PATH   = './includes/payloads/HEN/';
var DEFAULT_HEN     = "GoldHEN";

function GoldHEN() {
    var version = storage.getString('GHVer', GOLDHEN_DEFAULT);
    var filename = GOLDHEN_VERSIONS[version] || GOLDHEN_VERSIONS[GOLDHEN_DEFAULT];
    storage.session.set('payload_path', HEN_BASE_PATH + filename);
}

function PS4HEN() {
    var PS4HENFile = "";
    if (getPs4FwVersion() == 4.74) PS4HENFile = "PS4HEN-474.bin";
    else if (getPs4FwVersion() == 4.55) PS4HENFile = "PS4HEN-455.bin";
    else PS4HENFile = "PS4HEN.bin"; 

    storage.session.set('payload_path', HEN_BASE_PATH + PS4HENFile);
}

function nexHEN() {
    storage.session.set('payload_path', HEN_BASE_PATH + 'nexHEN-ps4.elf');
}

function chooseHEN() {
    if (user.currentJbFlavor === 'PS4HEN') {
        PS4HEN();
    } else if (user.currentJbFlavor === 'nexHEN'){
        nexHEN();
    } else {
        GoldHEN();
    }
}

function setGoldHENVer(value) {
    if (user.ps4Fw > 13.00 && value !== GOLDHEN_DEFAULT) {
        alert(window.lang.unsupportedFirmware + user.ps4Fw);
        // reset to latest version if firmware doesn't support older GoldHEN versions
        var goldHenRadio = document.querySelector('input[name="goldhen"][value="' + GOLDHEN_DEFAULT + '"]');
        if (goldHenRadio) goldHenRadio.checked = true;
        return;
    }
    if (!GOLDHEN_VERSIONS[value]) {
        value = GOLDHEN_DEFAULT;
    }
    storage.set('GHVer', value);
}

function loadGoldHENVer() {
    var goldHenVer = storage.getString('GHVer', GOLDHEN_DEFAULT);
    // Fall back to default if stored value is no longer valid
    if (!GOLDHEN_VERSIONS[goldHenVer]) goldHenVer = GOLDHEN_DEFAULT;
    var goldHenRadio = document.querySelector('input[name="goldhen"][value="' + goldHenVer + '"]');
    if (goldHenRadio) goldHenRadio.checked = true;
}

function saveJbFlavor(name, value) {
    storage.set('jailbreakFlavor', value);
    // Sync the other radio button
    var otherName = (name === 'hen') ? 'hen2' : 'hen';
    var otherHenRadio = document.querySelector('input[name="' + otherName + '"][value="' + value + '"]');
    if (otherHenRadio) otherHenRadio.checked = true;
    user.currentJbFlavor = value;
    chooseHEN();
}

function loadJbFlavor() {
    var flavor = user.currentJbFlavor || DEFAULT_HEN;
    var henRadio  = document.querySelector('input[name="hen"][value="' + flavor + '"]');
    var hen2Radio = document.querySelector('input[name="hen2"][value="' + flavor + '"]');
    if (henRadio)  henRadio.checked  = true;
    if (hen2Radio) hen2Radio.checked = true;
}

// Show or hide HEN radio buttons based on firmware support
function updateHenFlavorVisibility(fwVersion) {
    var fwNum = parseFloat(fwVersion);
    if (isNaN(fwNum)) return;
    var hideGoldHEN = (fwNum > 13.52 || fwNum < 5.05) ? true : false;
    
    var hidenexHEN = !devMode;

    var hidePS4HEN = (fwNum > commonMax && fwNum != 4.55 && fwNum != 4.74) ? true : false;

    var goldHenInputInitial = document.getElementById('goldhen-label-initial');
    var goldHenInputExploit = document.getElementById('goldhen-label-exploit');
    var goldHenVersionSelector = document.getElementById('chooseGoldHEN');

    var nexHENInputInitial = document.getElementById('nexHEN-label-initial');
    var nexHENInputExploit = document.getElementById('nexHEN-label-exploit');

    var PS4HENInputInitial = document.getElementById('PS4HEN-label-initial');
    var PS4HENInputExploit = document.getElementById('PS4HEN-label-exploit');

    if (hideGoldHEN) {
        if (goldHenInputInitial && goldHenInputExploit && goldHenVersionSelector) {
            toggleVisibility(goldHenInputInitial.id, !hideGoldHEN);
            toggleVisibility(goldHenInputExploit.id, !hideGoldHEN);
            toggleVisibility(goldHenVersionSelector.id, !hideGoldHEN);
        }
        var henInputs = document.querySelectorAll(
            'input[name="hen"][value="PS4HEN"], input[name="hen2"][value="PS4HEN"]'
        );
        for (var i = 0; i < henInputs.length; i++) {
            henInputs[i].checked = true;
        }
        user.currentJbFlavor = 'PS4HEN';
        storage.set('jailbreakFlavor', 'PS4HEN');
    }

    toggleVisibility(nexHENInputInitial.id, !hidenexHEN);
    toggleVisibility(nexHENInputExploit.id, !hidenexHEN);

    toggleVisibility(PS4HENInputInitial.id, !hidePS4HEN);
    toggleVisibility(PS4HENInputExploit.id, !hidePS4HEN);
}