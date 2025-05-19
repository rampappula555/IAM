import React, { useEffect } from "react";
import { useIAM } from "../context/IAMContext";

const DocumentViewer = ({ user, documentId }) => {
    const { isValidated, loading, error, initiateIAMFlow } = useIAM();

    useEffect(() => {
        if (!isValidated) {
            initiateIAMFlow({ apm_id: 123, user_id: 'john', type: 'token', claims: { type: 'EMAIL', template_id: 'dummy_data', name: 'john', contact_value: 'dummy@ex.com' } });
        }
    }, [isValidated, initiateIAMFlow, user, documentId]);

    if (loading) return <div> Authenticating...</div>;
    if (error) return <div> Error: {error}</div>;

    return (
        <>
            {isValidated ? (
                <div>📄 Document Content (ID: {documentId})</div>
            ) : (
                <div>🔒 Waiting for access...</div>
            )}
        </>
    );
};

export default DocumentViewer;
