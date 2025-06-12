const express = require('express');
const db = require('../db');
const router = express.Router();

// Create appointment
router.post('/', (req, res) => {
  const { consultantId, patientId, appointmentDay, appointmentTime, reason } = req.body;
  if (!consultantId || !patientId || !appointmentDay || !appointmentTime || !reason) return res.status(400).json({ error: 'Missing fields' });
  db.query('INSERT INTO appointments (consultant_id, patient_id, appointment_day, appointment_time, reason) VALUES (?, ?, ?, ?, ?)', [consultantId, patientId, appointmentDay, appointmentTime, reason], (err, result) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ message: 'Appointment created', appointmentId: result.insertId });
  });
});

// Get all appointments
router.get('/all', (req, res) => {
  db.query('SELECT * FROM appointments', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});

module.exports = router; 