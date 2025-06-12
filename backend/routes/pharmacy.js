const express = require('express');
const db = require('../db');
const router = express.Router();

// Provide medicine
router.post('/', (req, res) => {
  const { patientId, medicineName } = req.body;
  if (!patientId || !medicineName) return res.status(400).json({ error: 'Missing fields' });
  db.query('INSERT INTO pharmacy (patient_id, medicine_name) VALUES (?, ?)', [patientId, medicineName], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ message: 'Medicine provided', pharmacyId: result.insertId });
  });
});

router.get('/all', (req, res) => {
  db.query('SELECT * FROM pharmacy', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});

module.exports = router; 