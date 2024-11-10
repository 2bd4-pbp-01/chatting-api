const express = require('express');
const bodyParser = require('body-parser');
const { initializeFirebase } = require('./config/firebaseService');
const dotenv = require('dotenv');

const app = express();
app.use(bodyParser.json());

dotenv.config();

// Inisialisasi Firebase
initializeFirebase();

app.use('/', require('./routes/index'));

const PORT = process.env.CHAT_APP_PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
});
