export function getServerUrl() {
    return process.env.NODE_ENV === 'production' ? "" : process.env.NEXT_PUBLIC_SERVER_URL;
}

export function getApiUrl() {
    return getServerUrl() + "/api";
}

export function getAssetsUrl() {
    return getServerUrl() + "/assets";
}

export function getAuthUrl() {
    return getApiUrl() + "/auth";
}

export function getUsersUrl() {
    return getApiUrl() + "/users";
}