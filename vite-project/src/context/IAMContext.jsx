import React, { createContext, useContext, useState, useCallback } from "react";
import { generateChallengeToken, validateChallengeToken } from "../services/iamService";
import { clearTokens } from "../utils/tokenManager";

const IAMContext = createContext();

export const useIAM = () => useContext(IAMContext);

export const IAMProvider = ({ children }) => {
    const [isValidated, setIsValidated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const initiateIAMFlow = useCallback(async (userPayload) => {
        setLoading(true);
        setError(null);
        setIsValidated(false);

        try {
            const challengeToken = await generateChallengeToken(userPayload);

            const isValid = await validateChallengeToken({
                auth_id: challengeToken,
                value: challengeToken,
                type: 'token',
                apm_id: 'dummy'
            });

            if (isValid) {
                setIsValidated(true);
            } else {
                throw new Error("Challenge token validation failed");
            }
        } catch (err) {
            setError(err.message || "IAM validation failed");
            clearTokens(); // optional: clear corrupted tokens
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <IAMContext.Provider value={{ isValidated, loading, error, initiateIAMFlow }}>
            {children}
        </IAMContext.Provider>
    );
};
