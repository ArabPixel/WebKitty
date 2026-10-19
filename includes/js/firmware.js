// Single source of truth for:
//   - Supported exploit firmware boundaries (min / max)
//   - Exploit chain IDs, ranges, and metadata
//   - Firmware detection and preference helpers
var EXPLOIT_HANDLERS = {};

var EXPLOIT_CHAINS = {
    PSFREE_MODULAR:      0,   // src/psfree-lapse/alert.mjs       (7.00 – 9.60)
    PSFREE_BUNDLE:       1,   // src/psfree-lapse/bundle.js       (7.00 – 9.60)
    BADHOIST:            2,   // src/badhoist/672kexploit.js      (6.70 – 6.72)
    CSSFONTFACE_NETCTRL: 3,   // src/cssfontface/main.js          (9.00 – 11.02)
    CSSFONTFACE_LAPSE:   4,   // src/cssfontface/main.js          (9.00 – 11.02)
    SLOPKIT_LAPSE:       5,   // src/slopkit/chain_lapse.js       (11.00 – 12.02)
    SLOPKIT_NETCTRL:     6,   // src/slopkit/chain_poops.js       (12.50 – 13.00)
    RELAPSE:             7,   // src/relapse/jb.js                (13.02 – 13.52)
    BPF_DOUBLE_FREE:     8,   // src/bpf-double-free/main.js      (4.50 – 5.07)
};

// Exploit chain ranges and preferences
var FIRMWARE_RANGES = [
    {
        id:          EXPLOIT_CHAINS.BPF_DOUBLE_FREE,
        label:       'Bpf Double Free',
        min:         4.50,
        max:         5.07,
        isDefault:   true,
        prefMin:     4.50,
        prefMax:     5.07
    },
    {
        id:          EXPLOIT_CHAINS.BADHOIST,
        label:       'BadHoist',
        min:         6.70,
        max:         6.72,
        isDefault:   true,
        prefMin:     6.70,
        prefMax:     6.72
    },
    {
        id:          EXPLOIT_CHAINS.PSFREE_MODULAR,
        label:       'PSFree Lapse Modular',
        min:         7.00,
        max:         9.60,
        isDefault:   true,
        prefMin:     7.00,
        prefMax:     7.55
    },
    {
        id:          EXPLOIT_CHAINS.PSFREE_BUNDLE,
        label:       'PSFree Lapse Bundle',
        min:         7.00,
        max:         9.60,
        isDefault:   true,
        prefMin:     8.00,
        prefMax:     9.60
    },
    {
        id:          EXPLOIT_CHAINS.CSSFONTFACE_NETCTRL,
        label:       'CSSFontFace Netctrl',
        min:         9.00,
        max:         11.02,
        isDefault:   false
    },
    {
        id:          EXPLOIT_CHAINS.CSSFONTFACE_LAPSE,
        label:       'CSSFontFace Lapse',
        min:         9.00,
        max:         11.02,
        isDefault:   true,
        prefMin:     10.00,
        prefMax:     10.71
    },
    {
        id:          EXPLOIT_CHAINS.SLOPKIT_LAPSE,
        label:       'SlopKit Lapse',
        min:         11.00,
        max:         12.02,
        isDefault:   true,
        prefMin:     11.00,
        prefMax:     12.02
    },
    {
        id:          EXPLOIT_CHAINS.SLOPKIT_NETCTRL,
        label:       'SlopKit Netctrl',
        min:         12.50,
        max:         13.00,
        isDefault:   true,
        prefMin:     12.50,
        prefMax:     13.00
    },
    {
        id:          EXPLOIT_CHAINS.RELAPSE,
        label:       'Slopkit Relapse',
        min:         13.02,
        max:         13.52,
        isDefault:   true,
        prefMin:     13.02,
        prefMax:     13.52
    }
];

/**
 * Extracts the firmware version string from the user agent string.
 * @returns {string|null} e.g. "9.00"
 */
function getPs4FwVersion() {
    var userAgent = navigator.userAgent;
    if (!isPS4Console()) return null;
    var match = userAgent.match(/PlayStation 4\/([0-9.]+)/);
    if (match) return match[1];
    var start = userAgent.indexOf('5.0 (') + 19;
    var end = userAgent.indexOf(') Apple');
    if (start > 18 && end > start) {
        return userAgent.substring(start, end).replace("layStation 4/", "").trim();
    }
    return null;
}

/**
 * Returns true if the user agent represents a PS4 console.
 * @returns {boolean}
 */
function isPS4Console() {
    var userAgent = navigator.userAgent;
    return userAgent.indexOf("PlayStation 4") !== -1;
}

/**
 * Returns true if the firmware is a 6.7x version.
 * @returns {boolean}
 */
function is67xFirmware() {
    var fw = getPs4FwVersion();
    if (!fw) return false;
    return (fw === "6.70" || fw === "6.71" || fw === "6.72");
}

/**
 * Returns true if the given firmware version is supported by an exploit chain.
 * @param {number|string} fw - Firmware version, e.g. 9.60
 * @returns {boolean}
 */
function isFirmwareSupported(fw) {
    var fwNum = parseFloat(fw);
    if (isNaN(fwNum)) return false;
    if (getAvailableChains(fw).length > 0) return true;
    return false;
}

/**
 * Returns an array of chain IDs available for the given firmware version.
 * @param {number|string} fw
 * @returns {number[]}
 */
function getAvailableChains(fw) {
    var fwNum = parseFloat(fw);
    if (isNaN(fwNum)) return [];
    var chains = [];
    for (var i = 0; i < FIRMWARE_RANGES.length; i++) {
        var exploit = FIRMWARE_RANGES[i];
        if (fwNum >= exploit.min && fwNum <= exploit.max) {
            chains.push(exploit.id);
        }
    }
    return chains;
}

/**
 * Returns the preferred default chain ID for the given firmware version.
 * @param {number|string} fw
 * @returns {number|null}
 */
function getDefaultChain(fw) {
    var fwNum = parseFloat(fw);
    if (isNaN(fwNum)) return null;

    // Check specific preferred ranges
    for (var i = 0; i < FIRMWARE_RANGES.length; i++) {
        var exploit = FIRMWARE_RANGES[i];
        if (exploit.isDefault && exploit.prefMin !== undefined && exploit.prefMax !== undefined) {
            if (fwNum >= exploit.prefMin && fwNum <= exploit.prefMax) {
                return exploit.id;
            }
        }
    }

    // Fallback: first supported chain for this firmware
    var available = getAvailableChains(fwNum);
    return available.length > 0 ? available[0] : null;
}

/**
 * Returns true if a specific chain ID is valid for the given firmware version.
 * @param {number} chainId
 * @param {number|string} fw
 * @returns {boolean}
 */
function isChainSupported(chainId, fw) {
    var fwNum = parseFloat(fw);
    if (isNaN(fwNum)) return false;
    for (var i = 0; i < FIRMWARE_RANGES.length; i++) {
        var exploit = FIRMWARE_RANGES[i];
        if (exploit.id === chainId && fwNum >= exploit.min && fwNum <= exploit.max) return true;
    }
    return false;
}

// Caching
function getCachePage(fwVersion) {
    var routes = [
        { min: 4.50, max: 4.72, page: 'cache450-472.html' },
        { min: 4.73, max: 5.07, page: 'cache473-507.html' },
        { min: 6.70, max: 6.72, page: 'cache67x.html' },
        { min: 7.00, max: 8.52, page: 'cache7-8xx.html' },
        { min: 9.00, max: 9.60, page: 'cache9xx.html' },
        { min: 10.00, max: 10.71, page: 'cache10xx.html' },
        { min: 11.00, max: 11.52, page: 'cache11xx.html' },
        { min: 12.00, max: 12.52, page: 'cache12xx.html' },
        { min: 13.00, max: 13.00, page: 'cache1300.html' },
        { min: 13.02, max: 13.52, page: 'cache1302-1352.html' },
    ];

    var matchedPage = 'cachePayloads.html';
    for (var i = 0; i < routes.length; i++) {
        if (fwVersion >= routes[i].min && fwVersion <= routes[i].max) {
            matchedPage = routes[i].page;
            break;
        }
    }

    return './includes/caches/' + matchedPage;
}