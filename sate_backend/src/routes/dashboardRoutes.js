const express = require('express');

const autenticar = require('../middleware/authMiddleware');

const {
    obterDashboard
} = require('../controllers/dashboardController');


const router = express.Router();


// ============================================================
// DASHBOARD
// GET /api/dashboard
// ============================================================

router.get(
    '/',
    autenticar,
    obterDashboard
);


module.exports = router;