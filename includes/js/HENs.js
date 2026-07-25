// HEN path selection based on user preference
function GoldHEN() {
    var goldHenVersion = localStorage.getItem('GHVer');
    var basePath = "./includes/payloads/GoldHEN/";
    switch (goldHenVersion) {
        case "GHv2.4b18.9":
            sessionStorage.setItem('payload_path', basePath + "goldhen_v2.4b18.9.bin");
            break;
        case "GHv2.4b18.8":
            sessionStorage.setItem('payload_path', basePath + "goldhen_v2.4b18.8.bin");
            break;
        case "GHv2.4b18.7":
            sessionStorage.setItem('payload_path', basePath + "goldhen_v2.4b18.7.bin");
            break;
        case "GHv2.4b18.6":
            sessionStorage.setItem('payload_path', basePath + "goldhen_v2.4b18.6.bin");
            break;
        case "GHv2.4b18.5":
            sessionStorage.setItem('payload_path', basePath + "goldhen_v2.4b18.5.bin");
            break;
        default:
            sessionStorage.setItem('payload_path', basePath + "goldhen_v2.4b18.10.bin");
            break;
    }
}

function HEN() {
    sessionStorage.setItem('payload_path', './includes/payloads/HEN/HEN.bin');
}

function chooseHEN() {
    if (user.currentJbFlavor === 'HEN') {
        HEN();
    } else GoldHEN();
}

function setGoldHENVer(value) {
    localStorage.setItem('GHVer', value);
}

function loadGoldHENVer() {
    const goldHenVer = localStorage.getItem("GHVer") || "GHv2.4b18.10";
    const goldHenRadio = document.querySelector(`input[name="goldhen"][value="${goldHenVer}"]`);
    if (goldHenRadio) goldHenRadio.checked = true;
}

function saveJbFlavor(name, value) {
    localStorage.setItem("jailbreakFlavor", value);
    // Apply hen selector to both inputs
    const otherHenRadio = document.querySelector(`input[name="${name == "hen" ? "hen2" : "hen"}"][value="${value}"]`);
    if (otherHenRadio) otherHenRadio.checked = true;
    user.currentJbFlavor = value;
};

function loadJbFlavor() {
    const flavor = user.currentJbFlavor || 'GoldHEN';
    const henRadio = document.querySelector(`input[name="hen"][value="${flavor}"]`);
    const hen2Radio = document.querySelector(`input[name="hen2"][value="${flavor}"]`);

    if (henRadio && hen2Radio) {
        henRadio.checked = true;
        hen2Radio.checked = true;
    }
}