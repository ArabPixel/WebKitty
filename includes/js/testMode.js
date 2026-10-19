// custom url parameter reading for legacy support
function getQueryParam(name) {
    var search = window.location.search.substring(1);
    if (!search) return null;
    
    // Split into pairs and loop through them
    var pairs = search.split('&');
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=');
        if (decodeURIComponent(pair[0]) === name) {
            return decodeURIComponent(pair[1] || '');
        }
    }
    return null;
}

var testModeRequest = getQueryParam('test');
var testModeStorageUpdated = true;

if (testModeRequest === '1') {
    testModeStorageUpdated = storage.session.set('testMode', true);
} else if (testModeRequest === '0') {
    testModeStorageUpdated = storage.session.set('testMode', false);
}

var isTesting = testModeRequest === '1' ||
    (testModeRequest !== '0' && storage.session.getBoolean('testMode', false));
var devMode = isTesting;
var mainPage = devMode ? './?test=1' : './';

if (!testModeStorageUpdated && window.console && typeof window.console.warn === 'function') {
    window.console.warn('Could not save testing mode for this browser tab; internal WebKitty links will still carry the mode.');
}

function testModeUrl(url) {
    if (!devMode) return url;
    var hashIndex = url.indexOf('#');
    var path = hashIndex === -1 ? url : url.substring(0, hashIndex);
    var hash = hashIndex === -1 ? '' : url.substring(hashIndex);
    var separator = path.indexOf('?') === -1 ? '?' : '&';
    return path + separator + 'test=1' + hash;
}

if (devMode && document.body) {
    var testModeBadge = document.createElement('button');
    testModeBadge.type = 'button';
    testModeBadge.textContent = 'TEST MODE | Exit';
    testModeBadge.setAttribute('aria-label', 'Testing mode active. Exit testing mode.');
    testModeBadge.style.cssText = [
        'position:fixed',
        'top:0',
        'right:44%',
        'z-index:10000',
        'min-height:44px',
        'padding:8px 14px',
        'border:2px solid #fbbf24',
        'border-radius:8px',
        'background:#451a03',
        'color:#fff',
        'font:600 13px sans-serif'
    ].join(';');
    testModeBadge.addEventListener('click', function () {
        window.location.href = './?test=0';
    });
    document.body.appendChild(testModeBadge);
}
