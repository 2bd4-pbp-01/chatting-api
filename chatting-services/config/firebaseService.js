const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Inisialisasi Firebase Admin SDK
const serviceAccount = require('../servicesAccountKey.json');

const initializeFirebase = () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.DATABASE_URL,
    });
};

module.exports = { initializeFirebase, admin };
