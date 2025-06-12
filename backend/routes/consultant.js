const express = require('express');
const db = require('../db');
const router = express.Router();

// Select consultant
router.post('/', (req, res) => {
  const { patientId, consultantName } = req.body;
  if (!patientId || !consultantName) return res.status(400).json({ error: 'Missing fields' });
  db.query('INSERT INTO consultants (patient_id, name) VALUES (?, ?)', [patientId, consultantName], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ message: 'Consultant selected', consultantId: result.insertId });
  });
});

router.get('/all', (req, res) => {
  db.query('SELECT * FROM consultants', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});

module.exports = router; 