import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const SF_ACCESS_TOKEN = process.env.SF_ACCESS_TOKEN;
const SF_INSTANCE_URL = process.env.SF_INSTANCE_URL;

export async function createAccountAndContact(user) {
    try {
        if (!SF_ACCESS_TOKEN || !SF_INSTANCE_URL) {
            throw new Error("Salesforce credentials not configured");
        }

        const accountRes = await axios.post(
            `${SF_INSTANCE_URL}/services/data/v57.0/sobjects/Account`,
            { Name: user.name },
            {
                headers: {
                    Authorization: `Bearer ${SF_ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );
        const accountId = accountRes.data.id;

        const contactPayload = {
            LastName: user.profile?.lastName || user.name,
            FirstName: user.profile?.firstName || "",
            Email: user.email,
            AccountId: accountId,
            MailingCity: user.profile?.location || "",
            PhotoUrl__c: user.profile?.photoUrl || "",
        };

        const contactRes = await axios.post(
            `${SF_INSTANCE_URL}/services/data/v57.0/sobjects/Contact`,
            contactPayload,
            {
                headers: {
                    Authorization: `Bearer ${SF_ACCESS_TOKEN}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return { accountId, contactId: contactRes.data.id };
    } catch (err) {
        console.error("Salesforce sync error:", err.response?.data || err.message);
        throw err;
    }
}
