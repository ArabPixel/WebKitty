
// keep base ip and chop the rest
// e.g. 192.168.20.156 => 192.168.20
function baseIp(ip) {
    return ip.substring(0, ip.lastIndexOf('.'));
}

function guessIp() {
    const host = window.location.hostname;
    const inputIp = ui.ps4IpInput.value;
    const isPS4 = (user.platform === "PS4" || typeof window.ps4Fw !== 'undefined');

    // 1. is it a local network ? (192.168.x.x, 10.x.x.x, etc.)
    if (isLocalIP(host)) {
        if (isPS4) {
            user.ip = "127.0.0.1";
            if (!ui.ps4IpInput.classList.contains("hidden")) {
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
    const isLoopback = (host === "localhost" || host === "127.0.0.1");
    if (isLoopback) {
        if (isPS4) {
            return host;
        } else {
            // check if input has a valid ip that can be used to search for the ps4
            if (inputIp !== 'localhost' && inputIp !== '127.0.0.1') {
                findPs4FromBaseIP(inputIp);
            } else {
                alert("Can't scan for ip since its not provided")
            }
            // PC browsing a PC-hosted site.
            // Cant scan for a PayLoader server because we only have localhost or 127.0.0.1
            return;
        }
    }
}

function findPs4FromBaseIP(ip) {
    return new Promise((resolve, reject) => {
        const base = baseIp(ip);
        let checked = 0;
        const total = 254;
        let found = false;

        function onDone() {
            checked++;
            if (checked === total && !found) {
                reject(new Error('BinLoader not found on subnet'));
                alert(window.lang.payLoaderNotFound);
            }
        }

        for (let i = 1; i <= total; i++) {
            const checkIp = `${base}.${i}`;
            const req = new XMLHttpRequest();
            req.open('POST', `http://${checkIp}:9090/status`);
            req.timeout = 1000;

            req.onload = function () {
                if (found) { onDone(); return; }
                try {
                    const json = JSON.parse(req.responseText);
                    if (json.status === 'ready') {
                        found = true;
                        user.ip = checkIp;
                        try { localStorage.setItem('PayLoaderIp', checkIp); } catch (_) { }
                        if (ui.ps4IpInput && !ui.ps4IpInput.classList.contains('hidden')) {
                            ui.ps4IpInput.value = checkIp;
                            localStorage.setItem('ps4Ip', checkIp);
                        }
                        alert(window.lang.payLoaderFound + checkIp);
                        resolve(checkIp);
                    }
                } catch (_) { }
                onDone();
            };

            req.onerror = function () { onDone(); };
            req.ontimeout = function () { onDone(); };

            req.send();
        }
    });
}