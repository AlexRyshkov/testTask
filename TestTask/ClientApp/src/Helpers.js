export function arrayMove(array, oldIndex, newIndex) {
    if (newIndex >= array.length) {
        let k = newIndex - array.length + 1;
        while (k--) {
            array.push(undefined);
        }
    }
    array.splice(newIndex, 0, array.splice(oldIndex, 1)[0]);
    return array;
}

export function getEmptyTemplate() {
    return {
        name: "",
        statuses: [],
        fields: []
    }
}

export function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

export function setCookie(name, value, options = {}) {

    options = {
        path: '/',
        ...options
    };

    if (options.expires instanceof Date) {
        options.expires = options.expires.toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

    for (let optionKey in options) {
        updatedCookie += "; " + optionKey;
        let optionValue = options[optionKey];
        if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
        }
    }

    document.cookie = updatedCookie;
}

export function FieldTypeToStringLocale(type) {
    switch (type) {
        case "Text":
            return "Строка";
        case "Number":
            return "Число";
        case "Date":
            return "Дата";
        case "Time":
            return "Время";
        case "File":
            return "Файл";
    }
}

