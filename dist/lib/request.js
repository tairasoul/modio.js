export async function apiRequest(endpoint, args, testEnv = false) {
    const data = await fetch(`${testEnv ? "https://api.test.mod.io/v1" : "https://api.mod.io/v1"}${endpoint}`, args);
    const json = await data.json();
    return json;
}
