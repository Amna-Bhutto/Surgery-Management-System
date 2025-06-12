const express = require('express');
const db = require('../db');
const router = express.Router();

// Schedule surgery
router.post('/', (req, res) => {
  const { patientId, doctor, date, consent } = req.body;
  if (!patientId || !doctor || !date || !consent) return res.status(400).json({ error: 'Missing fields' });
  db.query('INSERT INTO surgeries (patient_id, doctor, date, consent) VALUES (?, ?, ?, ?)', [patientId, doctor, date, consent], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ message: 'Surgery scheduled', surgeryId: result.insertId });
  });
});

router.get('/all', (req, res) => {
  db.query('SELECT * FROM surgeries', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});

module.exports = router; 