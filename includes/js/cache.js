// Handling cache
function DLProgress(e) {
    var Percent = (Math.round(e.loaded / e.total * 100));
    document.title = ((window.lang && window.lang.cache) || "Caching ") + " " + Percent + "%";
}
function DisplayCacheProgress() {
    setTimeout(function () {
        document.title = "\u2713";
    }, 1000);
    setTimeout(function () {
        // location.reload();
        document.title = ((window.lang && window.lang.title) || "PSFree Enhanced");
    }, 2000);
}

function terminateCache() {
    if (window.applicationCache) {
        // Status 3 is 'downloading', Status 1 is 'checking'
        if (window.applicationCache.status === 3 || window.applicationCache.status === 1) {
            console.log("Terminating cache process to save memory...");
            window.applicationCache.abort();

            // restore title
            document.title = (window.lang && window.lang.title) ? window.lang.title : "PSFree Enhanced";

            // cleanup
            window.applicationCache.removeEventListener("progress", DLProgress);
            window.applicationCache.oncached = null;
            window.applicationCache.onupdateready = null;
        }
    }
}