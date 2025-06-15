const express = require('express');
const db = require('../db');
const router = express.Router();

// Submit patient info
router.post('/', (req, res) => {
  const { name, prescription } = req.body;
  if (!name) return res.status(400).json({ error: 'Missing fields' });
  db.query('INSERT INTO patients (name, prescription) VALUES (?, ?)', [name, prescription], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ message: 'Patient info submitted', patientId: result.insertId });
  });
});

// Get all patients
router.get('/all', (req, res) => {
  db.query('SELECT * FROM patients', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});

// Get specific patient by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM patients WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (results.length === 0) return res.status(404).json({ error: 'Patient not found' });
    res.json(results[0]);
  });
});

// Update patient info
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, prescription } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'Missing required fields: name' });
  }
  
  db.query(
    'UPDATE patients SET name = ?, prescription = ? WHERE id = ?',
    [name, prescription, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Patient not found' });
      res.json({ message: 'Patient updated successfully' });
    }
  );
});

// Delete patient
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM patients WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Patient not found' });
    res.json({ message: 'Patient deleted successfully' });
  });
});

module.exports = router; 