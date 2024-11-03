const express = require('express');
const { admin } = require('../services/firebaseService');

const router = express.Router();

// Mengirim pesan ke grup
router.post('/:groupId', async (req, res) => {
    const { groupId } = req.params;
    const { senderId, text } = req.body;

    try {
        const messageData = {
            senderId,
            text,
            timestamp: admin.database.ServerValue.TIMESTAMP,
        };

        await admin.database().ref(`groups/${groupId}/messages`).push(messageData);

        res.status(201).send({ message: 'Message berhasil ditambahkan' });
    } catch (error) {
        console.error("Error Input pesan:", error);
        res.status(500).send({ error: error.message });
    }
});

// Mengambil pesan dari grup
router.get('/:groupId', async (req, res) => {
    const { groupId } = req.params;

    try {
        const messagesSnapshot = await admin.database().ref(`groups/${groupId}/messages`).once('value');
        const messagesData = messagesSnapshot.val();

        // Konversi pesan ke dalam bentuk array dengan menambahkan ID
        const messagesArray = messagesData
            ? Object.keys(messagesData).map(key => ({
                id: key,
                ...messagesData[key]
            }))
            : [];

        res.status(200).send(messagesArray);
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
        const groupsArray = Object.keys(groupsData).map(groupId => {
            const group = groupsData[groupId];

            // Mengonversi pesan ke array
            const messagesArray = group.messages
                ? Object.keys(group.messages).map(messageId => ({
                    id: messageId,
                    ...group.messages[messageId]
                }))
                : [];

            return {
                groupId: groupId,
                groupName: group.groupName,
                createdAt: group.createdAt,
                messages: messagesArray
            };
        });

        // Mengirim seluruh data grup dalam bentuk array
        res.status(200).send(groupsArray);
    } catch (error) {
        console.error("Error mengambil semua data grup dan pesan:", error);
        res.status(500).send({ error: error.message });
    }
});

router.get('/listen/:groupId', (req, res) => {
    const { groupId } = req.params;
    const messagesRef = admin.database().ref(`groups/${groupId}/messages`);

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