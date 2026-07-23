import AuditLog from "../models/AuditLog.js";

export const logAction = async (entityType, entityId, action, userId, details = null) => {

    try {
        await AuditLog.create({entityType, entityId, action, userId, details,});
    }
     catch (err) {
        console.error("Audit log error:", err);
    }
};

