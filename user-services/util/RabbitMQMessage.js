import amqp from "amqplib";

import dotenv from "dotenv";

dotenv.config();

const sendRabbitMQMessage = async (queue, message) => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL);
        const channel = await connection.createChannel();
        await channel.assertQueue(queue, { durable: false });
        await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
        console.log("Message sent to queue:", queue);
        await channel.close();
        await connection.close();
    } catch (err) {
        console.error("Failed to send message to RabbitMQ:", err);
    }
};

export default sendRabbitMQMessage;