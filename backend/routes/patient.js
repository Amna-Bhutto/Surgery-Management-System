const express = require('express');
const db = require('../db');
const router = express.Router();

// Submit patient info
router.post('/', (req, res) => {
  const { name, prescription, status } = req.body;
  if (!name || !status) return res.status(400).json({ error: 'Missing fields' });
  db.query('INSERT INTO patients (name, prescription, status) VALUES (?, ?, ?)', [name, prescription, status], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ message: 'Patient info submitted', patientId: result.insertId });
  });
});

router.get('/all', (req, res) => {
  db.query('SELECT * FROM patients', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});

module.exports = router; 