// Handling cache
// Caching is now handled by cache.html + iframe_cache.js for firmware based caching
// This way we dont cache just everything for everyone. faster caching.

window.addEventListener('load', function () {
    var isPS4User = isPS4Console();

    // check for applicationCache only on PS4
    if (isPS4User && (!window.applicationCache || window.applicationCache.status === window.applicationCache.UNCACHED) && !devMode) {
        // Not cached! Redirecting...
        window.location.href = testModeUrl('./cache.html');
    }
});

// Used if terminating cache process early
function terminateCache() {
    if (window.applicationCache) {
        // Status 3 is 'downloading', Status 1 is 'checking'
        if (window.applicationCache.status === 3 || window.applicationCache.status === 1) {
            console.log("Terminating cache process to save memory...");
            window.applicationCache.abort();
            var appTitle = (typeof projectName !== 'undefined') ? projectName : "WebKitty";
            document.title = appTitle;
            window.applicationCache.removeEventListener("progress", null);
            window.applicationCache.oncached = null;
            window.applicationCache.onupdateready = null;
        }
    }
}