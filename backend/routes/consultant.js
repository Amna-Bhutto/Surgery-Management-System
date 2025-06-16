const express = require('express');
const db = require('../db');
const router = express.Router();

// Add consultant
router.post('/', (req, res) => {
  const { consultantName, arrivingTime, leavingTime, availableDays, image_url } = req.body;
  if (!consultantName || !arrivingTime || !leavingTime) return res.status(400).json({ error: 'Missing fields' });
  const availableDaysJson = JSON.stringify(availableDays || []);
  db.query('INSERT INTO consultants (name, arriving_time, leaving_time, available_days, image_url) VALUES (?, ?, ?, ?, ?)', [consultantName, arrivingTime, leavingTime, availableDaysJson, image_url], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ message: 'Consultant added', consultantId: result.insertId });
  });
});

// Update consultant
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { consultantName, arrivingTime, leavingTime, availableDays, image_url } = req.body;
  if (!consultantName || !arrivingTime || !leavingTime) return res.status(400).json({ error: 'Missing fields' });
  const availableDaysJson = JSON.stringify(availableDays || []);
  db.query('UPDATE consultants SET name = ?, arriving_time = ?, leaving_time = ?, available_days = ?, image_url = ? WHERE id = ?', [consultantName, arrivingTime, leavingTime, availableDaysJson, image_url, id], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ message: 'Consultant updated' });
  });
});

// Delete consultant
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM consultants WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Consultant not found' });
    res.json({ message: 'Consultant deleted successfully' });
  });
});

router.get('/all', (req, res) => {
  db.query('SELECT * FROM consultants', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});

module.exports = router;