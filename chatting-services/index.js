const express = require('express');
const bodyParser = require('body-parser');
const { initializeFirebase } = require('./services/firebaseService');

const app = express();
app.use(bodyParser.json());

// Inisialisasi Firebase
initializeFirebase();

// Rute untuk grup
app.use('/', require('./routes/index'));



// Jalankan server pada port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
