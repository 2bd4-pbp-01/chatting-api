const express = require('express');
const { admin } = require('../services/firebaseService');

const router = express.Router();

// Membuat grup baru
router.post('/', async (req, res) => {
    const { groupId, groupName } = req.body;

    try {
        await admin.database().ref('groups/' + groupId).set({
            groupName,
            createdAt: admin.database.ServerValue.TIMESTAMP,
        });

        res.status(201).send({ message: 'Group Berhasil Dibuat' });
    } catch (error) {
        console.error("Error Membuat Group:", error);
        res.status(500).send({ error: error.message });
    }
});


// mengambil group
router.get('/', async (req, res) => {
    const { groupId } = req.params;

    try {
        const group = await admin.database().ref(`groups`).once('value');
        res.status(200).send(group.val());
    } catch (error) {
        console.error("Error mengambil group:", error);
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
