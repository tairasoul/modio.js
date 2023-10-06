export async function apiRequest(endpoint: RequestInfo | URL, args: RequestInit | undefined, testEnv: boolean = false) {
    const data = await fetch(`${testEnv ? "https://api.test.mod.io/v1" : "https://api.mod.io/v1"}${endpoint}`, args);
    const json = await data.json();
    return json;
}
