const express = require('express');
const db = require('../db');
const router = express.Router();

// Get all medicines
router.get('/all', (req, res) => {
  db.query('SELECT * FROM medicines ORDER BY name', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});

// Add new medicine
router.post('/', (req, res) => {
  const { name, description, category, dosage, price, stock_quantity, image_url } = req.body;
  if (!name) return res.status(400).json({ error: 'Medicine name is required' });
  
  db.query(
    'INSERT INTO medicines (name, description, category, dosage, price, stock_quantity, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)', 
    [name, description, category, dosage, price || 0, stock_quantity || 0, image_url || null], 
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(400).json({ error: 'Medicine already exists' });
        }
        return res.status(500).json({ error: 'DB error' });
      }
      res.json({ message: 'Medicine added successfully', medicineId: result.insertId });
    }
  );
});

// Update medicine
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, description, category, dosage, price, stock_quantity, image_url } = req.body;
  
  db.query(
    'UPDATE medicines SET name = ?, description = ?, category = ?, dosage = ?, price = ?, stock_quantity = ?, image_url = ? WHERE id = ?',
    [name, description, category, dosage, price, stock_quantity, image_url, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      if (result.affectedRows === 0) return res.status(404).json({ error: 'Medicine not found' });
      res.json({ message: 'Medicine updated successfully' });
    }
  );
});

// Delete medicine
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  db.query('DELETE FROM medicines WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Medicine not found' });
    res.json({ message: 'Medicine deleted successfully' });
  });
});

module.exports = router; 