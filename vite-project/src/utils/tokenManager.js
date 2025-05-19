import axios from "axios";
import dayjs from "dayjs";

const TOKEN_ENDPOINT = "/auth/token";
const CLIENT_ID = 'your_client_id';
const CLIENT_SECRET = 'your_client_secret';
const TOKEN_KEY = {
    generate: "access_token_generate",
    validate: "access_token_validate",
};

function getStoredToken(scope) {
    const item = localStorage.getItem(TOKEN_KEY[scope]);
    if (!item) return null;
    const { token, expiry } = JSON.parse(item);
    return dayjs().isBefore(dayjs(expiry)) ? token : null;
}

function storeToken(scope, token, expirySeconds = 299) {
    const expiry = dayjs().add(expirySeconds - 20, "second").toISOString();
    localStorage.setItem(
        TOKEN_KEY[scope],
        JSON.stringify({ token, expiry })
    );
}

// Exponential backoff utility
async function retryWithBackoff(fn, retries = 3, delay = 300) {
    try {
        return await fn();
    } catch (err) {
        // Don't retry on 4xx errors
        if (err.response && err.response.status >= 400 && err.response.status < 500) {
            throw err;
        }
        if (retries <= 0) throw err;
        await new Promise(res => setTimeout(res, delay));
        return retryWithBackoff(fn, retries - 1, delay * 2);
    }
}

export async function getAccessToken(scope) {
    const cached = getStoredToken(scope);
    if (cached) return cached;
    try {
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        params.append('client_id', CLIENT_ID);
        params.append('client_secret', CLIENT_SECRET);
        params.append('scope', scope);
        const tokenResponse = await retryWithBackoff(() =>
            axios.post(TOKEN_ENDPOINT, params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
        );

        const data = tokenResponse.data;
        storeToken(scope, data?.access_token, data?.expires_in);
        return data?.access_token;
    } catch (err) {
        throw new Error(err)
    }

}

export function clearTokens() {
    Object.values(TOKEN_KEY).forEach(key => localStorage.removeItem(key));
}
