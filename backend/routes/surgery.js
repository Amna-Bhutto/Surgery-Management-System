const express = require('express');
const db = require('../db');
const router = express.Router();

// Schedule surgery with package and billing
router.post('/', (req, res) => {
  const { patientId, doctor, surgeryPackageId, date, consent } = req.body;
  
  if (!patientId || !doctor || !date || !consent) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Start transaction for surgery scheduling and billing
  db.beginTransaction((err) => {
    if (err) {
      console.error('Transaction begin error:', err);
      return res.status(500).json({ error: 'Transaction error', details: err.message });
    }

    // Get surgery package details if provided
    if (surgeryPackageId) {
      db.query('SELECT * FROM surgery_packages WHERE id = ?', [surgeryPackageId], (err, packageResults) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: 'Package lookup error', details: err.message });
          });
        }

        if (packageResults.length === 0) {
          return db.rollback(() => {
            res.status(404).json({ error: 'Surgery package not found' });
          });
        }

        const surgeryPackage = packageResults[0];
        
        // Insert surgery record
        db.query(
          'INSERT INTO surgeries (patient_id, doctor, surgery_package_id, package_price, date, consent) VALUES (?, ?, ?, ?, ?, ?)',
          [patientId, doctor, surgeryPackageId, surgeryPackage.price, date, consent],
          (err, surgeryResult) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ error: 'Surgery creation error', details: err.message });
              });
            }

            const surgeryId = surgeryResult.insertId;

            // Create bill for surgery
            const billNumber = 'SURGERY-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
            
            db.query(
              'INSERT INTO bills (patient_id, bill_number, total_amount, notes) VALUES (?, ?, ?, ?)',
              [patientId, billNumber, surgeryPackage.price, `Surgery: ${surgeryPackage.name} - ${surgeryPackage.description}`],
              (err, billResult) => {
                if (err) {
                  return db.rollback(() => {
                    res.status(500).json({ error: 'Bill creation error', details: err.message });
                  });
                }

                const billId = billResult.insertId;

                // Insert bill item for surgery
                db.query(
                  'INSERT INTO bill_items (bill_id, medicine_name, quantity, unit_price, total_price) VALUES (?, ?, ?, ?, ?)',
                  [billId, `Surgery: ${surgeryPackage.name}`, 1, surgeryPackage.price, surgeryPackage.price],
                  (err) => {
                    if (err) {
                      return db.rollback(() => {
                        res.status(500).json({ error: 'Bill item creation error', details: err.message });
                      });
                    }

                    // Commit transaction
                    db.commit((err) => {
                      if (err) {
                        return db.rollback(() => {
                          res.status(500).json({ error: 'Transaction commit error', details: err.message });
                        });
                      }

                      res.json({
                        message: 'Surgery scheduled and bill created successfully',
                        surgeryId: surgeryId,
                        billId: billId,
                        billNumber: billNumber,
                        packageName: surgeryPackage.name,
                        packagePrice: surgeryPackage.price
                      });
                    });
                  }
                );
              }
            );
          }
        );
      });
    } else {
      // Insert surgery without package (free surgery or consultation)
      db.query(
        'INSERT INTO surgeries (patient_id, doctor, date, consent) VALUES (?, ?, ?, ?)',
        [patientId, doctor, date, consent],
        (err, result) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json({ error: 'Surgery creation error', details: err.message });
            });
          }

          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json({ error: 'Transaction commit error', details: err.message });
              });
            }

            res.json({ 
              message: 'Surgery scheduled successfully', 
              surgeryId: result.insertId 
            });
          });
        }
      );
    }
  });
});

router.get('/all', (req, res) => {
  db.query(`
    SELECT 
      s.id, 
      s.patient_id, 
      p.name as patient_name, 
      s.doctor, 
      sp.name as surgery_package_name,
      s.package_price,
      s.date, 
      s.consent
    FROM surgeries s 
    LEFT JOIN patients p ON s.patient_id = p.id
    LEFT JOIN surgery_packages sp ON s.surgery_package_id = sp.id
    ORDER BY s.date DESC
  `, (err, results) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json(results);
  });
});

module.exports = router; 