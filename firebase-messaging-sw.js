// ============================================
// SERVICE WORKER - NOTIFICATIONS FCM AAPPMA
// ============================================

importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Configuration Firebase
firebase.initializeApp({
    apiKey: "AIzaSyCJk0Tfn4IU4DUEKCRVZmI-90s4cAnbyGA",
    authDomain: "appli-controleur-gunder.firebaseapp.com",
    databaseURL: "https://appli-controleur-gunder-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "appli-controleur-gunder",
    storageBucket: "appli-controleur-gunder.firebasestorage.app",
    messagingSenderId: "780831512988",
    appId: "1:780831512988:web:f0f263cfaf9abd18269059"
});

const messaging = firebase.messaging();

// Réception des messages en arrière-plan
messaging.onBackgroundMessage((payload) => {
    console.log('📬 Notification reçue en arrière-plan:', payload);
    
    // Gérer les deux formats possibles
    const notif = payload.notification || {};
    const data = payload.data || {};
    const title = notif.title || data.title || '📋 Contrôle AAPPMA';
    const body = notif.body || data.body || 'Un contrôle a été effectué';
    
    return self.registration.showNotification(title, {
        body: body,
        tag: 'controle-' + Date.now(),
        vibrate: [200, 100, 200],
        requireInteraction: true,
        data: data
    });
});

// Clic sur la notification
self.addEventListener('notificationclick', (event) => {
    console.log('🖱️ Clic sur notification:', event);
    event.notification.close();
    
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes('patricewalter.github.io') && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});

// Écouter les messages push directement (fallback)
self.addEventListener('push', (event) => {
    console.log('📨 Push reçu:', event);
    
    if (event.data) {
        try {
            const payload = event.data.json();
            const notif = payload.notification || {};
            const data = payload.data || {};
            const title = notif.title || data.title || '📋 Contrôle AAPPMA';
            const body = notif.body || data.body || 'Un contrôle a été effectué';
            
            event.waitUntil(
                self.registration.showNotification(title, {
                    body: body,
                    tag: 'controle-' + Date.now(),
                    vibrate: [200, 100, 200],
                    requireInteraction: true
                })
            );
        } catch (e) {
            console.error('Erreur parsing push:', e);
        }
    }
});
