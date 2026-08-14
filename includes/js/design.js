function setTheme(theme) {
    const styleSheet = document.getElementById('main-stylesheet');
    if (styleSheet) {
        // Ensure we don't end up with "index.css.css"
        const fileName = theme.endsWith('.css') ? theme : `${theme}.css`;
        styleSheet.setAttribute('href', `./includes/css/layouts/${fileName}`);
        localStorage.setItem('theme', theme);
        if (theme == 'compact') {
            ui.initialScreen.classList.add('compact');
            ui.clickToStartText.innerText = projectName;
        } else {
            ui.initialScreen.classList.remove('compact');
            ui.clickToStartText.innerText = window.lang.clickToStart;
        }
    }
}

function setColors(color) {
    const styleSheet = document.getElementById('color-stylesheet');
    if (styleSheet) {
        const fileName = color.endsWith('.css') ? color : color + '.css';
        styleSheet.setAttribute('href', './includes/css/colors/' + fileName);
        localStorage.setItem('color', color)
    }
}

function loadTheme() {
    var savedTheme = localStorage.getItem('theme') || 'index';

    // Find the radio button
    var radioElement = document.querySelector(`input[name="theme"][value="${savedTheme}"]`);

    // Fallback if the saved theme doesn't exist or is invalid
    if (!radioElement) {
        savedTheme = 'index';
        radioElement = document.querySelector(`input[name="theme"][value="index"]`);
        localStorage.setItem('theme', 'index');
        // Apply the CSS file
        setTheme(savedTheme);
    }

    if (radioElement.value == "compact") {
        ui.initialScreen.classList.add('compact');
    } else ui.initialScreen.classList.remove('compact');
    // Update the UI radio button if it exists
    if (radioElement) {
        radioElement.checked = true;
    }
}

function loadColor() {
    var savedColor = localStorage.getItem('color') || 'default';

    // Find the radio button
    var radioElement = document.querySelector(`input[name="colorTheme"][value="${savedColor}"]`);

    // Fallback if the saved theme doesn't exist or is invalid
    if (!radioElement) {
        savedColor = 'index';
        radioElement = document.querySelector(`input[name="colorTheme"][value="default"]`);
        localStorage.setItem('color', 'default');
        // Apply the CSS file
        setColors(savedColor);
    }
    // Update the UI radio button if it exists
    if (radioElement) {
        radioElement.checked = true;
    }
}
