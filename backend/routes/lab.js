const express = require('express');
const db = require('../db');
const router = express.Router();

// Submit lab results
router.post('/', (req, res) => {
  const { surgeryId, sampleName, result } = req.body;
  if (!surgeryId || !sampleName || !result) return res.status(400).json({ error: 'Missing fields' });
  db.query('INSERT INTO lab_results (surgery_id, sample_name, result) VALUES (?, ?, ?)', [surgeryId, sampleName, result], (err, resultDb) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ message: 'Lab result submitted', labResultId: resultDb.insertId });
  });
});

router.get('/all', (req, res) => {
  db.query('SELECT * FROM lab_results', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});

module.exports = router; 