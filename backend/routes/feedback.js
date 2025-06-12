const express = require('express');
const db = require('../db');
const router = express.Router();

// Submit feedback
router.post('/', (req, res) => {
  const { patientId, feedbackText } = req.body;
  if (!patientId || !feedbackText) return res.status(400).json({ error: 'Missing fields' });
  db.query('INSERT INTO feedback (patient_id, feedback) VALUES (?, ?)', [patientId, feedbackText], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ message: 'Feedback submitted', feedbackId: result.insertId });
  });
});

router.get('/all', (req, res) => {
  db.query('SELECT * FROM feedback', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});

module.exports = router; 