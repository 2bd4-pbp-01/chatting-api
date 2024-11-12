const express = require('express');
const { admin } = require('../config/firebaseService');
const responseCorpa = require('../util/corparesponse');
const amqp = require('amqplib');

const router = express.Router();

// Function to process received messages and save them to Firebase
// Fungsi untuk memproses pesan sesuai dengan operasi (insert, update, delete)
const processGroupMessage = async (msg) => {
    const { operation, groupId, groupName } = JSON.parse(msg.content.toString());
    const groupRef = admin.database().ref('groups/' + groupName);

    try {
        switch (operation) {
            case "create":
                await groupRef.set({
                    groupId,
                    createdAt: admin.database.ServerValue.TIMESTAMP,
                });
                console.log(`Group '${groupName}' berhasil dibuat di Firebase`);
                break;

            case "update":
                await groupRef.update({
                    groupName,
                    updatedAt: admin.database.ServerValue.TIMESTAMP,
                });
                console.log(`Group '${groupName}' berhasil diperbarui di Firebase`);
                break;

            case "delete":
                await groupRef.remove();
                console.log(`Group '${groupName}' berhasil dihapus dari Firebase`);
                break;

            default:
                console.error("Operasi tidak dikenali:", operation);
        }
    } catch (error) {
        console.error(`Gagal memproses operasi ${operation} untuk group '${groupName}':`, error);
    }
};

// Setup RabbitMQ listener
const setupRabbitMQListener = async () => {
    try {
        const connection = await amqp.connect('amqp://ambatusing:ambatubash@127.0.0.1:5672');
        const channel = await connection.createChannel();
        const queue = 'group_queue';

        await channel.assertQueue(queue, { durable: false });

        // Listen to messages
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                processGroupMessage(msg);
                channel.ack(msg); // Acknowledge message after processing
            }
        });
        console.log('Waiting for messages in queue:', queue);
    } catch (error) {
        console.error('Failed to setup RabbitMQ listener:', error);
    }
};

// Memulai RabbitMQ listener
setupRabbitMQListener().then(() => console.log('RabbitMQ listener started'));

// Endpoint to retrieve groups from Firebase
router.get('/', async (req, res) => {
    try {
        const group = await admin.database().ref('groups').once('value');
        responseCorpa(200, group.val(), 'Group Berhasil Diambil', res);
    } catch (error) {
        console.error("Error mengambil group:", error);
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
