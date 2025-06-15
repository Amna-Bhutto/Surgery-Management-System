const express = require('express');
const db = require('../db');
const router = express.Router();

// Create bill with multiple medicine items
router.post('/', (req, res) => {
  console.log('Billing POST request received:', req.body);
  const { patientId, medicines } = req.body;
  
  console.log('Extracted values:', { patientId, medicines });
  
  if (!patientId || !medicines || !Array.isArray(medicines) || medicines.length === 0) {
    console.log('Missing required fields validation failed');
    return res.status(400).json({ error: 'Missing required fields: patientId and medicines array' });
  }
  
  // Generate unique bill number
  const billNumber = 'BILL-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
  
  // Calculate total amount
  const totalAmount = medicines.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  
  console.log('About to create bill with:', { patientId, billNumber, totalAmount, medicines });
  
  // Start transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error('Transaction begin error:', err);
      return res.status(500).json({ error: 'Transaction error', details: err.message });
    }
    
    // Insert main bill
    db.query(
      'INSERT INTO bills (patient_id, bill_number, total_amount) VALUES (?, ?, ?)',
      [patientId, billNumber, totalAmount],
      (err, billResult) => {
        if (err) {
          console.error('Bill insert error:', err);
          return db.rollback(() => {
            res.status(500).json({ error: 'Bill creation error', details: err.message });
          });
        }
        
        const billId = billResult.insertId;
        console.log('Bill created with ID:', billId);
        
        // Insert bill items
        const itemPromises = medicines.map((item) => {
          return new Promise((resolve, reject) => {
            db.query(
              'INSERT INTO bill_items (bill_id, medicine_name, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)',
              [billId, item.medicineName, item.quantity, item.unitPrice, item.unitPrice * item.quantity],
              (err, result) => {
                if (err) reject(err);
                else resolve(result);
              }
            );
          });
        });
        
        Promise.all(itemPromises)
          .then(() => {
            // Commit transaction
            db.commit((err) => {
              if (err) {
                console.error('Transaction commit error:', err);
                return db.rollback(() => {
                  res.status(500).json({ error: 'Transaction commit error', details: err.message });
                });
              }
              
              console.log('Bill and items created successfully');
              res.json({ 
                message: 'Bill created successfully', 
                billId: billId,
                billNumber: billNumber,
                totalAmount: totalAmount,
                itemCount: medicines.length
              });
            });
          })
          .catch((err) => {
            console.error('Bill items insert error:', err);
            db.rollback(() => {
              res.status(500).json({ error: 'Bill items creation error', details: err.message });
            });
          });
      }
    );
  });
});

// Get all bills with their items
router.get('/all', (req, res) => {
  const query = `
    SELECT 
      b.id,
      b.patient_id,
      p.name as patient_name,
      b.bill_number,
      b.total_amount,
      b.bill_date,
      b.notes,
      COUNT(bi.id) as item_count
    FROM bills b
    LEFT JOIN patients p ON b.patient_id = p.id
    LEFT JOIN bill_items bi ON b.id = bi.bill_id
    GROUP BY b.id
    ORDER BY b.bill_date DESC
  `;
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Get all bills error:', err);
      return res.status(500).json({ error: 'DB error', details: err.message });
    }
    res.json(results);
  });
});

// Get specific bill with all items
router.get('/:billId', (req, res) => {
  const { billId } = req.params;
  
  const billQuery = `
    SELECT 
      b.id,
      b.patient_id,
      p.name as patient_name,
      b.bill_number,
      b.total_amount,
      b.bill_date,
      b.notes
    FROM bills b
    LEFT JOIN patients p ON b.patient_id = p.id
    WHERE b.id = ?
  `;
  const itemsQuery = 'SELECT * FROM bill_items WHERE bill_id = ?';
  
  db.query(billQuery, [billId], (err, billResults) => {
    if (err) {
      console.error('Get bill error:', err);
      return res.status(500).json({ error: 'DB error', details: err.message });
    }
    
    if (billResults.length === 0) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    
    db.query(itemsQuery, [billId], (err, itemResults) => {
      if (err) {
        console.error('Get bill items error:', err);
        return res.status(500).json({ error: 'DB error', details: err.message });
      }
      
      res.json({
        bill: billResults[0],
        items: itemResults
      });
    });
  });
});

// Get bills for specific patient
router.get('/patient/:patientId', (req, res) => {
  const { patientId } = req.params;
  
  const query = `
    SELECT 
      b.id,
      b.patient_id,
      b.bill_number,
      b.total_amount,
      b.bill_date,
      b.notes,
      COUNT(bi.id) as item_count
    FROM bills b
    LEFT JOIN bill_items bi ON b.id = bi.bill_id
    WHERE b.patient_id = ?
    GROUP BY b.id
    ORDER BY b.bill_date DESC
  `;
  
  db.query(query, [patientId], (err, results) => {
    if (err) {
      console.error('Get patient bills error:', err);
      return res.status(500).json({ error: 'DB error', details: err.message });
    }
    res.json(results);
  });
});

// This payment status route is removed as payment_status field no longer exists

module.exports = router; 