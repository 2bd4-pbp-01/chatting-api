const admin = require('firebase-admin');

// Inisialisasi Firebase Admin SDK
const serviceAccount = require('../servicesAccountKey.json');

const initializeFirebase = () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://data-b90c8-default-rtdb.firebaseio.com/",
    });
};

module.exports = { initializeFirebase, admin };
