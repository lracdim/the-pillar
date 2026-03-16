import { account, client, databases, DB_ID, COL_PROFILES } from './appwrite.js';

/**
 * Compatibility & Helper Functions
 */

export async function getSession() {
    try {
        return await account.get();
    } catch {
        return null;
    }
}

// Check if user is logged in
export async function getCurrentUser() {
    return await getSession();
}

/**
 * Unified Auth Logic (Email/Password & Profiles)
 */

// 1. Email/Password Login
export async function login(identifier, password) {
    let email = identifier;
    
    // Exception for Developer Admin: allow login with just username
    if (identifier === 'lracdim_admin') {
        email = 'lracdim_admin@pillar.com';
    }

    try {
        await account.createEmailPasswordSession(email, password);
        await syncUserProfile();
        return { success: true };
    } catch (error) {
        console.error('Login Error:', error);
        return { success: false, message: error.message };
    }
}

// 2. Signup
export async function signup(email, password, name) {
    try {
        await account.create('unique()', email, password, name);
        await login(email, password);
        return { success: true };
    } catch (error) {
        console.error('Signup Error:', error);
        return { success: false, message: error.message };
    }
}

// 3. Sync Profile & Reading Progress
export async function syncUserProfile() {
    try {
        const user = await account.get();
        try {
            await databases.getDocument(DB_ID, COL_PROFILES, user.$id);
            // Update last active
            await databases.updateDocument(DB_ID, COL_PROFILES, user.$id, {
                lastActive: new Date().toISOString()
            });
        } catch (e) {
            if (e.code === 404) {
                await databases.createDocument(DB_ID, COL_PROFILES, user.$id, {
                    userId: user.$id,
                    nickname: user.name || user.email.split('@')[0],
                    isPro: false,
                    readEpisodes: [],
                    lastActive: new Date().toISOString()
                });
            }
        }
    } catch (error) {
        // If not logged in, we can't sync
    }
}

// 4. Logout
export async function logout() {
    try {
        await account.deleteSession('current');
    } catch (e) {}
    window.location.href = '/';
}

// 5. Navigation UI Utility
export async function updateNavAuthUI() {
    const lang = document.documentElement.lang || 'en';
    
    // Attach click listeners immediately
    const signinBtns = document.querySelectorAll('#nav-signin-btn, #mobile-nav-signin-btn');
    const signupBtns = document.querySelectorAll('#nav-signup-btn, #mobile-nav-signup-btn');
    const signoutBtns = document.querySelectorAll('#nav-signout-btn, #mobile-signout-btn');

    signinBtns.forEach(btn => {
        btn.onclick = () => window.location.href = `/login/${lang}/`;
    });
    signupBtns.forEach(btn => {
        btn.onclick = () => window.location.href = `/signup/${lang}/`;
    });
    signoutBtns.forEach(btn => {
        btn.onclick = logout;
    });

    const guestNav = document.getElementById('nav-auth-guest');
    const userNav = document.getElementById('nav-auth-user');
    const usernameSpan = document.getElementById('nav-username');

    const mobileGuest = document.getElementById('mobile-auth-guest');
    const mobileUser = document.getElementById('mobile-auth-user');
    const mobileUsername = document.getElementById('mobile-username');

    try {
        const user = await account.get();
        if (user) {
            // Update Desktop Nav
            guestNav?.classList.add('hidden');
            userNav?.classList.remove('hidden');
            if (usernameSpan) usernameSpan.textContent = user.name || user.email.split('@')[0];

            // Update Mobile Nav
            mobileGuest?.classList.add('hidden');
            mobileUser?.classList.remove('hidden');
            if (mobileUsername) mobileUsername.textContent = user.name || user.email.split('@')[0];
        } else {
            throw new Error('Not logged in');
        }
    } catch {
        guestNav?.classList.remove('hidden');
        userNav?.classList.add('hidden');
        mobileGuest?.classList.remove('hidden');
        mobileUser?.classList.add('hidden');
    }
}

// Auto-run on load
if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', updateNavAuthUI);
}
