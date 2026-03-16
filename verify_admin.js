const { Client, Users, ID } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

async function fixAdmin() {
    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(process.env.APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const users = new Users(client);

    const adminEmail = 'lracdim_admin@pillar.com';
    const adminPass = 'K!Ez3r1121';
    const adminName = 'lracdim_admin';

    try {
        console.log("Attempting to create admin account...");
        await users.create(ID.unique(), adminEmail, undefined, adminPass, adminName);
        console.log("SUCCESS: Admin account created.");
    } catch (error) {
        if (error.code === 409) {
            console.log("Admin account already exists. Repairing password...");
            try {
                // We need the ID to update password. Let's find him.
                // Using list with a simple filter
                const list = await users.list();
                const admin = list.users.find(u => u.email === adminEmail);
                if (admin) {
                    await users.updatePassword(admin.$id, adminPass);
                    console.log("SUCCESS: Password repaired for existing account.");
                } else {
                    console.log("ERROR: Could not find admin ID in the user list.");
                }
            } catch (err) {
                console.error("FAILED to repair password:", err.message);
            }
        } else {
            console.error("CRITICAL ERROR:", error.message);
            if (error.message.includes('missing scopes')) {
                console.log("\n[ACTION REQUIRED] Your API Key needs 'users.read' and 'users.write' scopes.");
            }
        }
    }
}

fixAdmin();
