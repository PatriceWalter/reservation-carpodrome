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
    
    const notificationTitle = payload.notification?.title || '📋 Contrôle AAPPMA';
    const notificationOptions = {
        body: payload.notification?.body || 'Un contrôle a été effectué',
        icon: '/icon-192.png',
        badge: '/icon-72.png',
        tag: 'controle-' + Date.now(),
        vibrate: [200, 100, 200],
        data: payload.data,
        actions: [
            { action: 'open', title: 'Voir' }
        ]
    };
    
    self.registration.showNotification(notificationTitle, notificationOptions);
});

// Clic sur la notification
self.addEventListener('notificationclick', (event) => {
    console.log('🖱️ Clic sur notification:', event);
    event.notification.close();
    
    // Ouvrir l'application
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Si l'app est déjà ouverte, la focus
            for (const client of clientList) {
                if (client.url.includes('patricewalter.github.io') && 'focus' in client) {
                    return client.focus();
                }
            }
            // Sinon ouvrir une nouvelle fenêtre
            if (clients.openWindow) {
                return clients.openWindow('/');
            }
        })
    );
});
