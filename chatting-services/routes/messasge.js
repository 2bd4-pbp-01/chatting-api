const express = require('express');
const { admin } = require('../config/firebaseService');
const responseCorpa = require('../util/corparesponse');

const router = express.Router();

// Mengirim pesan ke grup
router.post('/:groupName', async (req, res) => {
    const { groupName } = req.params;
    const { senderId, text } = req.body;

    try {
        const messageData = {
            senderId,
            text,
            timestamp: admin.database.ServerValue.TIMESTAMP,
        };

        await admin.database().ref(`groups/${groupName}/messages`).push(messageData);

        responseCorpa(201, null, 'Message berhasil ditambahkan', res);
    } catch (error) {
        console.error("Error Input pesan:", error);
        res.status(500).send({ error: error.message });
    }
});

// Mengambil pesan dari grup
router.get('/:groupName', async (req, res) => {
    const { groupName } = req.params;

    try {
        const messagesSnapshot = await admin.database().ref(`groups/${groupName}/messages`).once('value');
        const messagesData = messagesSnapshot.val();

        // Konversi pesan ke dalam bentuk array dengan menambahkan ID
        const messagesArray = messagesData
            ? Object.keys(messagesData).map(key => ({
                id: key,
                ...messagesData[key]
            }))
            : [];

        responseCorpa(200, messagesArray, 'Pesan berhasil diambil', res);
    } catch (error) {
        console.error("Error mengambil pesan:", error);
        res.status(500).send({ error: error.message });
    }
});

// Mengambil semua data grup beserta semua pesan
router.get('/', async (req, res) => {
    try {
        // Mengambil snapshot dari seluruh data grup
        const groupsSnapshot = await admin.database().ref('groups').once('value');
        const groupsData = groupsSnapshot.val();

        if (!groupsData) {
            return res.status(404).send({ error: "Tidak ada grup yang ditemukan" });
        }

        // Memproses setiap grup dan pesan-pesan di dalamnya
        const groupsArray = Object.keys(groupsData).map(groupName => {
            const group = groupsData[groupName];

            // Mengonversi pesan ke array
            const messagesArray = group.messages
                ? Object.keys(group.messages).map(messageId => ({
                    id: messageId,
                    ...group.messages[messageId]
                }))
                : [];

            return {
                groupName: groupName,
                createdAt: group.createdAt,
                messages: messagesArray
            };
        });

        responseCorpa(200, groupsArray, 'Data grup dan pesan berhasil diambil', res);

    } catch (error) {
        console.error("Error mengambil semua data grup dan pesan:", error);
        res.status(500).send({ error: error.message });
    }
});

// Mendengarkan pesan baru di grup
router.get('/listen/:groupName', (req, res) => {
    const { groupName } = req.params;
    const messagesRef = admin.database().ref(`groups/${groupName}/messages`);

    // Menetapkan header untuk SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Menggunakan 'child_added' untuk mendengarkan pesan baru
    messagesRef.on('child_added', (snapshot) => {
        const message = snapshot.val();
        // Mengirim pesan baru ke klien
        res.write(`data: ${JSON.stringify(message)}\n\n`);
    });

    // Menangani koneksi yang ditutup oleh klien
    req.on('close', () => {
        messagesRef.off('child_added'); // Hentikan pendengar ketika koneksi ditutup
    });
});

module.exports = router;
