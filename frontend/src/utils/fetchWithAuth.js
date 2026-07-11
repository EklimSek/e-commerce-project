// fetchWithAuth.js — zero imports

export const fetchWithAuth = async (url, options = {}) => {
    let res = await fetch(url, { ...options, credentials: "include" });

    if (res.status === 401) {
        const refreshRes = await fetch("/api/auth/refresh-token", {
            method: "POST",
            credentials: "include"
        });

        if (refreshRes.ok) {
            res = await fetch(url, { ...options, credentials: "include" });
        } else {
            // emit event — stores listen and react
            window.dispatchEvent(new CustomEvent("auth:expired"));
        }
    }

    return res;
};