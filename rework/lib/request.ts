export async function apiRequest(path: string, endpoint: RequestInfo | URL, args: RequestInit | undefined, testEnv: boolean = false) {
    const data = await fetch(`${testEnv ? "https://api.test.mod.io/v1" : path}${endpoint}`, args);
    const json = await data.json();
    return json;
}
