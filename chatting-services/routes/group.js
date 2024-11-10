const express = require('express');
const { admin } = require('../config/firebaseService');
const responseCorpa = require('../util/corparesponse');
const amqp = require('amqplib');

const router = express.Router();

// Function to process received messages and save them to Firebase
const processGroupCreatedMessage = (msg) => {
    const { groupId, groupName } = JSON.parse(msg.content.toString());

    // Use groupName as the key and store groupId for reference
    admin.database().ref('groups/' + groupName).set({
        groupId,  // Save groupId as a reference if needed
        createdAt: admin.database.ServerValue.TIMESTAMP,
    })
        .then(() => {
            console.log('Group successfully created in Firebase');
        })
        .catch((error) => {
            console.error('Error creating group in Firebase:', error);
        });
};

// Setup RabbitMQ for listening to messages
const setupRabbitMQListener = async () => {
    try {
        const connection = await amqp.connect('amqp://ambatusing:ambatubash@127.0.0.1:5672');
        const channel = await connection.createChannel();
        const queue = 'group_created_queue';

        await channel.assertQueue(queue, { durable: false });

        // Listen to messages
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                processGroupCreatedMessage(msg);
                channel.ack(msg); // Acknowledge message after processing
            }
        });
        console.log('Waiting for messages in queue:', queue);
    } catch (error) {
        console.error('Failed to setup RabbitMQ listener:', error);
    }
};

// Call setupRabbitMQListener to start listening
setupRabbitMQListener().then(r => console.log('RabbitMQ listener started'));

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
