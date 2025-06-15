const express = require('express');
const db = require('../db');
const router = express.Router();

// Get all surgeries for dropdown
router.get('/surgeries', (req, res) => {
  const query = `
    SELECT s.id, s.date, s.doctor, p.name as patient_name, sp.name as surgery_package_name
    FROM surgeries s 
    JOIN patients p ON s.patient_id = p.id 
    LEFT JOIN surgery_packages sp ON s.surgery_package_id = sp.id
    ORDER BY s.date DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});

// Get all lab sample types
router.get('/sample-types', (req, res) => {
  db.query('SELECT * FROM lab_sample_types ORDER BY name', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});

// Get all lab result types
router.get('/result-types', (req, res) => {
  db.query('SELECT * FROM lab_result_types ORDER BY category, name', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});

// Submit lab results (updated for new schema)
router.post('/', (req, res) => {
  const { surgeryId, sampleTypeId, resultTypeId, resultValue, technicianNotes } = req.body;
  if (!surgeryId || !sampleTypeId || !resultTypeId || !resultValue) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const query = `
    INSERT INTO lab_results (surgery_id, sample_type_id, result_type_id, result_value, technician_notes) 
    VALUES (?, ?, ?, ?, ?)
  `;
  
  db.query(query, [surgeryId, sampleTypeId, resultTypeId, resultValue, technicianNotes || ''], (err, resultDb) => {
    if (err) {
      console.error('Lab result submission error:', err);
      return res.status(500).json({ error: 'DB error: ' + err.message });
    }
    res.json({ message: 'Lab result submitted successfully', labResultId: resultDb.insertId });
  });
});

// Get all lab results with detailed information
router.get('/all', (req, res) => {
  const query = `
    SELECT 
      lr.id,
      lr.surgery_id,
      lr.result_value,
      lr.test_date,
      lr.technician_notes,
      s.date as surgery_date,
      s.doctor,
      p.name as patient_name,
      sp.name as surgery_package_name,
      lst.name as sample_type,
      lst.description as sample_description,
      lrt.name as result_type,
      lrt.description as result_description,
      lrt.normal_range,
      lrt.units,
      lrt.category
    FROM lab_results lr
    JOIN surgeries s ON lr.surgery_id = s.id
    JOIN patients p ON s.patient_id = p.id
    LEFT JOIN surgery_packages sp ON s.surgery_package_id = sp.id
    JOIN lab_sample_types lst ON lr.sample_type_id = lst.id
    JOIN lab_result_types lrt ON lr.result_type_id = lrt.id
    ORDER BY lr.test_date DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Lab results fetch error:', err);
      return res.status(500).json({ error: 'DB error: ' + err.message });
    }
    res.json(results);
  });
});

module.exports = router; 