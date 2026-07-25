
// payloads tabs
function loadLastTab() {
    if (user.lastTab == "advanced" && user.advancedPayloads != "true") {
        // set last tab to tools
        user.lastTab = "tools";
        ui.toolsSection.click();
    }
    document.getElementById(user.lastTab).classList.remove('hidden');
    document.getElementById(user.lastTab + '-tab').setAttribute("aria-selected", "true");
}

function saveLastTab(tab) {
    // Update state
    user.lastTab = tab;
    localStorage.setItem('lastTab', tab);

    // Define the map of containers
    const sections = {
        'tools': ui.toolsSection,
        'linux': ui.linuxSection,
        'advanced': ui.advancedPayloadsSection,
        'custom': ui.customPayloadsSection
    };

    // Nuke contents of every section but the active one and custom to free memory
    Object.keys(sections).forEach(key => {
        if (key !== tab && sections[key] && key != 'custom') {
            sections[key].innerHTML = '';
        }
    });
}

async function Loadpayloads(payload, name, payloadId) {
    if (user.platform != "PS4") {
        var inputIp = ui.ps4IpInput.value.trim();
        if (inputIp == null || inputIp == undefined || inputIp == "" || /\s/.test(inputIp)) {
            alert(window.lang.ps4IpInvalid);
            return;
        }

        if (user.ps4Fw == null || user.ps4Fw == 'undefined') {
            ui.ps4FwSelect.style.border = "2px solid red";
            return;
        }
        user.ip = inputIp;
    }
    try {
        sessionStorage.removeItem('binloader');
        if (payload == "chooseFanThreshold") {
            chooseFanThreshold();
            return;
        }

        // Try to find the function in global scope or window.payloads
        const targetFunc = window[payload] || (window.payloads && window.payloads[payload]);

        if (typeof targetFunc === 'function') {
            if (payload == "custom") {
                var payloadFile = ui.customPayloadInput.files[0];
                if (!payloadFile) return;
                targetFunc(payloadFile);
            } else {
                targetFunc(name, payloadId);
            }
        } else {
            alert(`Payload function ${payload} not found.`);
        }

    } catch (e) {
        alert('Failed to load payload: ' + payload + " | Error: " + e);
    }
}

function renderPayloads(payloads) {
    // Identify the target container first
    const firstCategory = payloads[0].category;
    let targetContainer;

    if (firstCategory === 'tools') targetContainer = ui.toolsSection;
    else if (firstCategory === 'linux') targetContainer = ui.linuxSection;
    else if (firstCategory === 'advanced') targetContainer = ui.advancedPayloadsSection;

    // Clear to prevent duplicates
    if (targetContainer) targetContainer.innerHTML = '';

    payloads.forEach(payload => {
        const payloadCard = document.createElement('div');
        payloadCard.id = payload.id;
        payloadCard.onclick = () => Loadpayloads(payload.funcName, payload.name, payload.id);
        payloadCard.className = `payload payload-card relative group cursor-pointer duration-300 transform hover:scale-102`;
        payloadCard.dataset.payloadId = payload.id;

        payloadCard.innerHTML = `
    <button style="width: 100%;">
      <div class="bg-gray-800 border border-white/20 rounded-xl p-6 h-full">
          <div class="flex items-start justify-between mb-4">
              <div class="flex items-center space-x-3">
                  <div>
                      <h3 class="text-start font-semibold text-white text-lg">${payload.name}</h3>
                      <p class="text-start text-cyan-300" style="font-size: 0.75rem">${payload.author}</p>
                  </div>
              </div>
              <span class="px-2 py-1 rounded-full text-xs border ${getPayloadCategoryClass(payload.category)}">
                  ${payload.category}
              </span>
          </div>
          <p class="text-start text-white/70 text-sm leading-relaxed">${payload.description}</p>
          <div class="flex items-center justify-between text-xs text-white/60">
          <p style="color: orange;">${payload.specificFW != '' ? payload.specificFW : ""} </p>
          </div>
      </div>
      </button>
      `;
        switch (payload.category) {
            case "tools":
                ui.toolsSection.appendChild(payloadCard);
                break;
            case "linux":
                ui.linuxSection.appendChild(payloadCard);
                break;
            case "advanced":
                ui.advancedPayloadsSection.appendChild(payloadCard);
                break;
            default:
                ui.toolsSection.appendChild(payloadCard);
                break;
        }
    });

}

function loadAdvancedPayloads() {
    if (user.advancedPayloads == "true") {
        // its true, check the box, show tab and load the payloads
        ui.advancedPayloadsInput.checked = true;
        ui.advancedPayloadsContainer.classList.remove('hidden')
        renderPayloads(payloadsList.filter(p => p.category === 'advanced'));
    }
}

function getPayloadCategoryClass(category) {
    switch (category) {
        case 'tools': return 'category-tools';
        case 'linux': return 'category-linux';
        case 'advanced': return 'category-advanced';
        default: return '';
    }
}