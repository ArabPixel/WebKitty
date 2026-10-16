// storage.js
// Typed localStorage and sessionStorage wrapper with fallback protection

var storage = {
    getString: function (key, defaultValue) {
        try {
            var val = localStorage.getItem(key);
            if (val === null || val === undefined || val === '') return defaultValue;
            return String(val);
        } catch (e) {
            return defaultValue;
        }
    },

    getBoolean: function (key, defaultValue) {
        try {
            var val = localStorage.getItem(key);
            if (val === null || val === undefined || val === '') return defaultValue;
            if (val === 'true' || val === true || val === 1 || val === '1') return true;
            if (val === 'false' || val === false || val === 0 || val === '0') return false;
            return defaultValue;
        } catch (e) {
            return defaultValue;
        }
    },

    getNumber: function (key, defaultValue) {
        try {
            var val = localStorage.getItem(key);
            if (val === null || val === undefined || val === '') return defaultValue;
            var num = Number(val);
            return isNaN(num) ? defaultValue : num;
        } catch (e) {
            return defaultValue;
        }
    },

    set: function (key, value) {
        try {
            if (value === null || value === undefined) {
                localStorage.removeItem(key);
            } else if (typeof value === 'object') {
                localStorage.setItem(key, JSON.stringify(value));
            } else {
                localStorage.setItem(key, String(value));
            }
            return true;
        } catch (e) {
            return false;
        }
    },

    remove: function (key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    },

    // Session storage helpers
    session: {
        getString: function (key, defaultValue) {
            try {
                var val = sessionStorage.getItem(key);
                if (val === null || val === undefined || val === '') return defaultValue;
                return String(val);
            } catch (e) {
                return defaultValue;
            }
        },

        getBoolean: function (key, defaultValue) {
            try {
                var val = sessionStorage.getItem(key);
                if (val === null || val === undefined || val === '') return defaultValue;
                if (val === 'true' || val === true || val === 1 || val === '1') return true;
                if (val === 'false' || val === false || val === 0 || val === '0') return false;
                return defaultValue;
            } catch (e) {
                return defaultValue;
            }
        },

        getNumber: function (key, defaultValue) {
            try {
                var val = sessionStorage.getItem(key);
                if (val === null || val === undefined || val === '') return defaultValue;
                var num = Number(val);
                return isNaN(num) ? defaultValue : num;
            } catch (e) {
                return defaultValue;
            }
        },

        set: function (key, value) {
            try {
                if (value === null || value === undefined) {
                    sessionStorage.removeItem(key);
                } else if (typeof value === 'object') {
                    sessionStorage.setItem(key, JSON.stringify(value));
                } else {
                    sessionStorage.setItem(key, String(value));
                }
                return true;
            } catch (e) {
                return false;
            }
        },

        remove: function (key) {
            try {
                sessionStorage.removeItem(key);
                return true;
            } catch (e) {
                return false;
            }
        }
    }
};
