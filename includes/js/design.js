function setLayout(theme) {
    var styleSheet = document.getElementById('main-stylesheet');
    if (styleSheet) {
        // Ensure we don't end up with "index.css.css"
        var fileName = (theme.slice(-4) === '.css') ? theme : theme + '.css';
        styleSheet.setAttribute('href', './includes/css/layouts/' + fileName);
        storage.set('theme', theme);

        if (theme == 'compact') {
            ui.initialScreen.classList.add('compact');
            ui.clickToStartText.innerText = projectName;
        } else {
            ui.initialScreen.classList.remove('compact');
            ui.clickToStartText.innerText = (window.lang && window.lang.clickToStart) || 'Click to Start';
        }
    }
}

function setTheme(color) {
    var styleSheet = document.getElementById('color-stylesheet');
    if (styleSheet) {
        var fileName = (color.slice(-4) === '.css') ? color : color + '.css';
        styleSheet.setAttribute('href', './includes/css/colors/' + fileName);
        storage.set('color', color);
    }
}

function loadLayout() {
    var savedTheme = storage.getString('theme', 'index');

    // Find the radio button matching the saved layout
    var radioElement = document.querySelector('input[name="theme"][value="' + savedTheme + '"]');

    // Fallback if the saved layout doesn't exist or is invalid
    if (!radioElement) {
        savedTheme = 'index';
        radioElement = document.querySelector('input[name="theme"][value="index"]');
        storage.set('theme', 'index');
        setLayout(savedTheme);
    }

    if (radioElement && radioElement.value == 'compact') {
        ui.initialScreen.classList.add('compact');
        ui.clickToStartText.textContent = projectName;
    } else {
        ui.initialScreen.classList.remove('compact');
        ui.clickToStartText.textContent = (window.lang && window.lang.clickToStart) || 'Click to Start';
    }
    if (radioElement) {
        radioElement.checked = true;
    }
}

function loadTheme() {
    var savedColor = storage.getString('color', 'default');

    // Find the radio button matching the saved theme
    var radioElement = document.querySelector('input[name="colorTheme"][value="' + savedColor + '"]');

    // Fallback if the saved theme doesn't exist or is invalid
    if (!radioElement) {
        savedColor = 'default';
        radioElement = document.querySelector('input[name="colorTheme"][value="default"]');
        storage.set('color', 'default');
        setTheme(savedColor);
    }
    if (radioElement) {
        radioElement.checked = true;
    }
}
