// sw.js - Hỗ trợ PWA Offline và Bắn thông báo ngoài màn hình khóa
const CACHE_NAME = 'bedtime-cache-v1';

// 1. Cài đặt Service Worker
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

// 2. Kích hoạt Service Worker
self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// 3. QUAN TRỌNG NHẤT: Bắt buộc phải có sự kiện fetch để PWABuilder duyệt PWA
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});

// 4. Xử lý khi người dùng chạm vào thông báo trên màn hình khóa
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url && 'focus' in client) {
                    return client.focus();
                }
            }
            if (clients.openWindow) {
                return clients.openWindow('./index.html');
            }
        })
    );
});
