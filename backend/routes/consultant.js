const express = require('express');
const db = require('../db');
const router = express.Router();

// Select consultant
router.post('/', (req, res) => {
  const { consultantName, arrivingTime, leavingTime, availableDays } = req.body;
  if (!consultantName || !arrivingTime || !leavingTime) return res.status(400).json({ error: 'Missing fields' });
  const availableDaysJson = JSON.stringify(availableDays || []);
  db.query('INSERT INTO consultants (name, arriving_time, leaving_time, available_days) VALUES (?, ?, ?, ?)', [consultantName, arrivingTime, leavingTime, availableDaysJson], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ message: 'Consultant added', consultantId: result.insertId });
  });
});

router.get('/all', (req, res) => {
  db.query('SELECT * FROM consultants', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});

module.exports = router;