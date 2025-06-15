const express = require('express');
const db = require('../db');
const router = express.Router();

// Get all surgery packages
router.get('/all', (req, res) => {
  db.query('SELECT * FROM surgery_packages ORDER BY category, name', (err, results) => {
    if (err) {
      console.error('Get surgery packages error:', err);
      return res.status(500).json({ error: 'DB error', details: err.message });
    }
    res.json(results);
  });
});

// Get surgery package by ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM surgery_packages WHERE id = ?', [id], (err, results) => {
    if (err) {
      console.error('Get surgery package error:', err);
      return res.status(500).json({ error: 'DB error', details: err.message });
    }
    if (results.length === 0) return res.status(404).json({ error: 'Surgery package not found' });
    res.json(results[0]);
  });
});

// Create new surgery package
router.post('/', (req, res) => {
  const { name, description, category, price, duration_hours, complexity_level, equipment_required } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  
  db.query(
    'INSERT INTO surgery_packages (name, description, category, price, duration_hours, complexity_level, equipment_required) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, description, category, price, duration_hours || 1, complexity_level || 'Medium', equipment_required],
    (err, result) => {
      if (err) {
        console.error('Create surgery package error:', err);
        return res.status(500).json({ error: 'DB error', details: err.message });
      }
      res.json({ message: 'Surgery package created successfully', packageId: result.insertId });
    }
  );
});

// Update surgery package
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, category, price, duration_hours, complexity_level, equipment_required } = req.body;
  
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }
  
  db.query(
    'UPDATE surgery_packages SET name = ?, description = ?, category = ?, price = ?, duration_hours = ?, complexity_level = ?, equipment_required = ? WHERE id = ?',
    [name, description, category, price, duration_hours, complexity_level, equipment_required, id],
    (err, result) => {
      if (err) {
        console.error('Update surgery package error:', err);
        return res.status(500).json({ error: 'DB error', details: err.message });
      }
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Surgery package not found' });
      res.json({ message: 'Surgery package updated successfully' });
    }
  );
});

// Delete surgery package
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM surgery_packages WHERE id = ?', [id], (err, result) => {
    if (err) {
      console.error('Delete surgery package error:', err);
      return res.status(500).json({ error: 'DB error', details: err.message });
    }
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Surgery package not found' });
    res.json({ message: 'Surgery package deleted successfully' });
  });
});

module.exports = router; 