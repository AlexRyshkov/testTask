import {getCookie} from "./Helpers";

export async function GetTemplates() {
    return await fetch("https://localhost:44360/api/templates", {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('accessToken')}`
        }
    });
}

export async function AddTemplate(template) {
    return await fetch("https://localhost:44360/api/templates", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('accessToken')}`
        },
        body: JSON.stringify(template)
    });
}

export async function UpdateTemplate(template) {
    return await fetch(`https://localhost:44360/api/templates/${template.id}`, {
        method: "PUT",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('accessToken')}`
        },
        body: JSON.stringify(template)
    });
}

export async function GetApplications() {
    return await fetch("https://localhost:44360/api/applications", {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('accessToken')}`
        }
    });
}

export async function TryLogin(email, password) {
    return await fetch("https://localhost:44360/api/login", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        }
    );
}

export async function ValidateToken() {
    return await fetch("https://localhost:44360/api/login/validate", {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('accessToken')}`
        }
    });
}

export async function GetUsers() {
    return await fetch("https://localhost:44360/api/users", {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('accessToken')}`
        }
    });
}

export async function GetApplicationsByUsername(name) {
    return await fetch("https://localhost:44360/api/applications/" + name, {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getCookie('accessToken')}`
        }
    });
}

export async function GetFile(filename) {
    return await fetch("https://localhost:44360/api/files/" + filename, {
        method: "GET",
        headers: {
            'Authorization': `Bearer ${getCookie('accessToken')}`
        }
    });
}

export async function AddUser(user) {
    return await fetch("https://localhost:44360/api/users/add", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('accessToken')}`
            },
            body: JSON.stringify(user)
        }
    );
}

export async function UpdateApplicationStatus(applicationId, statusId) {
    return await fetch("https://localhost:44360/api/applications/status", {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('accessToken')}`
            },
            body: JSON.stringify({applicationId, statusId})
        }
    );
}

