// Scans the local network for a PS4 running a Payload Loader server.

// keep base ip and chop the rest
// e.g. 192.168.20.156 => 192.168.20
function baseIp(ip) {
    return ip.substring(0, ip.lastIndexOf('.'));
}

function guessIp() {
    var host = window.location.hostname;
    var inputIp = ui.ps4IpInput ? ui.ps4IpInput.value : '';
    var isPS4 = isPS4Console();

    // 1. is it a local network ? (192.168.x.x, 10.x.x.x, etc.)
    if (isLocalIP(host)) {
        if (isPS4) {
            user.ip = "127.0.0.1";
            if (ui.ps4IpInput && !ui.ps4IpInput.classList.contains("hidden")) {
                ui.ps4IpInput.value = user.ip;
            }
            return; // PS4 browsing its own local server
        } else {
            // PC browsing a hosted site.
            findPs4FromBaseIP(host);
            return;
        }
    }

    // 2. is it localhost or 127.0.0.1
    var isLoopback = (host === "localhost" || host === "127.0.0.1");
    if (isLoopback) {
        if (isPS4) {
            return host;
        } else {
            // check if input has a valid ip that can be used to search for the ps4
            if (inputIp !== 'localhost' && inputIp !== '127.0.0.1') {
                findPs4FromBaseIP(inputIp);
            } else {
                alert("Can't scan for ip since its not provided");
            }
            return;
        }
    }
}

function findPs4FromBaseIP(ip) {
    return new Promise(function (resolve, reject) {
        var base = baseIp(ip);
        var checked = 0;
        var total = 254;
        var found = false;
        var batchSize = 20;
        var nextIndex = 1;

        function onDone() {
            checked++;
            if (checked === total && !found) {
                alert(window.lang.payloadLoaderNotFound);
            }
        }

        function checkNextBatch() {
            if (found || nextIndex > total) return;

            var batchEnd = Math.min(nextIndex + batchSize, total + 1);
            var currentBatchStart = nextIndex;
            nextIndex = batchEnd;

            for (var i = currentBatchStart; i < batchEnd; i++) {
                (function (index) {
                    var checkIp = base + '.' + index;
                    var req = new XMLHttpRequest();
                    req.open('POST', 'http://' + checkIp + ':9090/status');
                    req.timeout = 1000;

                    req.onload = function () {
                        if (found) {
                            onDone();
                            return;
                        }
                        var isFound = false;
                        try {
                            var json = JSON.parse(req.responseText);
                            if (json && json.status === 'ready') {
                                isFound = true;
                            }
                        } catch (_) { }

                        // Detect nexHEN response (HTTP 405/400 with text "Use POST / or POST /payload")
                        if (!isFound && req.responseText && req.responseText.indexOf('POST /') !== -1) {
                            isFound = true;
                        }

                        if (isFound) {
                            found = true;
                            user.ip = checkIp;
                            storage.set('PayLoaderIp', checkIp);
                            if (ui.ps4IpInput && !ui.ps4IpInput.classList.contains('hidden')) {
                                ui.ps4IpInput.value = checkIp;
                                storage.set('ps4Ip', checkIp);
                            }
                            alert((window.lang ? window.lang.payloadLoaderFound : 'Payload Loader server found at: ') + checkIp);
                            resolve(checkIp);
                            return;
                        }
                        onDone();
                        checkNextBatch();
                    };

                    req.onerror = function () {
                        onDone();
                        checkNextBatch();
                    };
                    req.ontimeout = function () {
                        onDone();
                        checkNextBatch();
                    };

                    req.send();
                })(i);
            }
        }

        // Launch initial batch
        checkNextBatch();
    });
}