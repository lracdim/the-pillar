const { Client, Databases, Permission, Role } = require('node-appwrite');
require('dotenv').config({ path: '.env.local' });

async function fixPermissions() {
    const client = new Client()
        .setEndpoint('https://cloud.appwrite.io/v1')
        .setProject(process.env.APPWRITE_PROJECT_ID)
        .setKey(process.env.APPWRITE_API_KEY);

    const databases = new Databases(client);
    const dbId = process.env.APPWRITE_DATABASE_ID || 'pillar_db';

    const collections = [
        {
            id: 'visitors',
            permissions: [
                Permission.read(Role.any()),
                Permission.create(Role.any()), // Temporarily allow create if guest increments directly
                Permission.update(Role.any()) 
            ]
        },
        {
            id: 'comments',
            permissions: [
                Permission.read(Role.any()),
                Permission.create(Role.users()), // Only logged in users can comment
            ]
        },
        {
            id: 'profiles',
            permissions: [
                Permission.read(Role.users()), // Users can see profiles (or restrict to owner)
            ]
        }
    ];

    for (const col of collections) {
        try {
            console.log(`Updating permissions for ${col.id}...`);
            await databases.updateCollection(dbId, col.id, col.id, col.permissions);
            console.log(`SUCCESS: ${col.id} permissions updated.`);
        } catch (err) {
            console.error(`FAILED to update ${col.id}:`, err.message);
        }
    }
}

fixPermissions();
