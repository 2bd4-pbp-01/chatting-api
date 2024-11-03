const express = require('express');

const router = express.Router();

router.use('/groups', require('./group'));
router.use('/messages', require('./messasge'));

router.get('/', (req, res) => {
    res.render('../views/index.ejs'); // Render file index.ejs
});

module.exports = router;