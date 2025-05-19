import axios from "axios";
import { getAccessToken } from "../utils/tokenManager";

export async function generateChallengeToken(payload) {
    const token = await getAccessToken("generate");

    const response = await axios.post("/challenge-token", payload, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return response.data?.auth_id;
}

export async function validateChallengeToken(payload) {
    const token = await getAccessToken("validate");

    const response = await axios.post("/validate-challenge", payload, {
        headers: { Authorization: `Bearer ${token}` },
    });

    return response.data?.status === 200;
}
