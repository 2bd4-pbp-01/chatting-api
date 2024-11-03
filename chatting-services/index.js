const express = require('express');
const bodyParser = require('body-parser');
const { initializeFirebase } = require('./services/firebaseService');

const app = express();
app.use(bodyParser.json());

// Inisialisasi Firebase
initializeFirebase();

app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
