import React, { useState, useEffect } from 'react';
import API from '../api';

function PharmacyPortal() {
  const [patientId, setPatientId] = useState('');
  const [medicineName, setMedicineName] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [message, setMessage] = useState('');
  const [medicineSearch, setMedicineSearch] = useState('');
  const [showMedicineDropdown, setShowMedicineDropdown] = useState(false);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showBill, setShowBill] = useState(false);
  const [billDetails, setBillDetails] = useState(null);
  const [medicineCart, setMedicineCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  
  // Patient dropdown states
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientSearch, setPatientSearch] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);

  useEffect(() => {
    fetchMedicines();
    fetchPatients();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await API.get('/medicine/all');
      setMedicines(res.data);
      setFilteredMedicines(res.data);
    } catch (err) {
      console.error('Failed to fetch medicines');
    }
  };

  const fetchPatients = async () => {
    try {
      const res = await API.get('/patient/all');
      setPatients(res.data);
      setFilteredPatients(res.data);
    } catch (err) {
      console.error('Failed to fetch patients');
    }
  };

  const handlePatientSearch = (value) => {
    setPatientSearch(value);
    setShowPatientDropdown(true);
    
    if (value === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(value.toLowerCase()) ||
        patient.id.toString().includes(value)
      );
      setFilteredPatients(filtered);
    }
  };

  const selectPatient = (patient) => {
    setSelectedPatient(patient);
    setPatientId(patient.id);
    setPatientSearch(`${patient.name} (ID: ${patient.id})`);
    setShowPatientDropdown(false);
  };

  const handleMedicineSearch = (value) => {
    setMedicineSearch(value);
    setShowMedicineDropdown(true);
    
    if (value === '') {
      setFilteredMedicines(medicines);
    } else {
      const filtered = medicines.filter(medicine =>
        medicine.name.toLowerCase().includes(value.toLowerCase()) ||
        (medicine.category && medicine.category.toLowerCase().includes(value.toLowerCase())) ||
        (medicine.dosage && medicine.dosage.toLowerCase().includes(value.toLowerCase()))
      );
      setFilteredMedicines(filtered);
    }
  };

  const selectMedicine = (medicine) => {
    setMedicineName(medicine.name);
    setSelectedMedicine(medicine);
    setMedicineSearch(`${medicine.name} - ${medicine.dosage} (PKR ${medicine.price || '0.00'}) - Stock: ${medicine.stock_quantity}`);
    setShowMedicineDropdown(false);
  };

  const addToCart = () => {
    if (!selectedMedicine || quantity <= 0) return;
    
    if (quantity > selectedMedicine.stock_quantity) {
      setMessage(`Insufficient stock! Available: ${selectedMedicine.stock_quantity}`);
      return;
    }

    // Check if medicine already in cart
    const existingIndex = medicineCart.findIndex(item => item.medicine.id === selectedMedicine.id);
    
    if (existingIndex >= 0) {
      // Update existing item
      const newCart = [...medicineCart];
      newCart[existingIndex].quantity += quantity;
      setMedicineCart(newCart);
    } else {
      // Add new item
      setMedicineCart([...medicineCart, {
        medicine: selectedMedicine,
        quantity: quantity,
        unitPrice: parseFloat(selectedMedicine.price) || 0,
        totalPrice: (parseFloat(selectedMedicine.price) || 0) * quantity
      }]);
    }

    setMessage(`${selectedMedicine.name} added to cart!`);
    setSelectedMedicine(null);
    setMedicineSearch('');
    setQuantity(1);
  };

  const removeFromCart = (index) => {
    const newCart = medicineCart.filter((_, i) => i !== index);
    setMedicineCart(newCart);
  };

  const updateCartQuantity = (index, newQuantity) => {
    if (newQuantity <= 0) return;
    
    const newCart = [...medicineCart];
    const item = newCart[index];
    
    if (newQuantity > item.medicine.stock_quantity) {
      setMessage(`Insufficient stock! Available: ${item.medicine.stock_quantity}`);
      return;
    }
    
    newCart[index].quantity = newQuantity;
    newCart[index].totalPrice = item.unitPrice * newQuantity;
    setMedicineCart(newCart);
  };

  const getCartTotal = () => {
    return medicineCart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!selectedPatient) {
      setMessage('Please select a patient');
      return;
    }
    
    if (medicineCart.length === 0) {
      setMessage('Please add medicines to cart before processing');
      return;
    }
    
    try {
      const totalBillAmount = getCartTotal();
      
      // Prepare medicines data for the new billing API
      const medicinesData = medicineCart.map(item => ({
        medicineName: item.medicine.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice
      }));
      
      // Add all medicines to pharmacy records first
      for (const item of medicineCart) {
        await API.post('/pharmacy', { 
          patientId: Number(patientId), 
          medicineName: item.medicine.name 
        });
      }
      
      // Create single bill with all medicines
      const billRes = await API.post('/billing', {
        patientId: Number(patientId),
        medicines: medicinesData
      });
      
      if (billRes.data.billId) {
        setBillDetails({
          billId: billRes.data.billId,
          billNumber: billRes.data.billNumber,
          patientId,
          patientName: selectedPatient.name,
          medicines: medicineCart,
          totalAmount: totalBillAmount,
          itemCount: billRes.data.itemCount,
          date: new Date().toLocaleString()
        });
        setShowBill(true);
        setMessage(`Bill #${billRes.data.billNumber} generated successfully with ${medicineCart.length} medicines!`);
        
        // Reset everything
        setPatientId('');
        setSelectedPatient(null);
        setPatientSearch('');
        setMedicineCart([]);
        setSelectedMedicine(null);
        setMedicineSearch('');
        setQuantity(1);
        fetchMedicines(); // Refresh medicine list to update stock
      } else {
        setMessage('Failed to generate bill');
      }
    } catch (err) {
      console.error('Transaction failed:', err);
      setMessage(`Transaction failed: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="container mt-4">
      <style jsx>{`
        .combo-dropdown-item:hover {
          background-color: #f8f9fa !important;
        }
      `}</style>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title mb-4">🏥 Pharmacy Portal</h3>
              <form onSubmit={handleSubmit}>
                <div className="position-relative mb-3">
                  <input
                    className="form-control"
                    placeholder="Type to search patients..."
                    value={patientSearch}
                    onChange={e => handlePatientSearch(e.target.value)}
                    onFocus={() => setShowPatientDropdown(true)}
                    onBlur={() => setTimeout(() => setShowPatientDropdown(false), 200)}
                  />
                  
                  {showPatientDropdown && filteredPatients.length > 0 && (
                    <div className="position-absolute w-100 bg-white border border-top-0 shadow-sm" style={{zIndex: 1000, maxHeight: '200px', overflowY: 'auto'}}>
                      {filteredPatients.map(patient => (
                        <div
                          key={patient.id}
                          className="p-2 border-bottom hover-bg-light cursor-pointer"
                          style={{cursor: 'pointer'}}
                          onMouseDown={() => selectPatient(patient)}
                          onMouseEnter={e => e.target.style.backgroundColor = '#f8f9fa'}
                          onMouseLeave={e => e.target.style.backgroundColor = 'white'}
                        >
                          <strong>{patient.name}</strong> (ID: {patient.id})
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {showPatientDropdown && filteredPatients.length === 0 && patientSearch && (
                    <div className="position-absolute w-100 bg-white border border-top-0 shadow-sm p-2" style={{zIndex: 1000}}>
                      <small className="text-muted">No patients found</small>
                    </div>
                  )}
                                 </div>
                 
                 {selectedPatient && (
                   <div className="alert alert-info">
                     <small>👤 <strong>Selected Patient:</strong> {selectedPatient.name} (ID: {selectedPatient.id})</small>
                   </div>
                 )}
                 
                 <div className="position-relative mb-3">
                  <input
                    className="form-control"
                    placeholder="Type to search medicines..."
                    value={medicineSearch}
                    onChange={e => handleMedicineSearch(e.target.value)}
                    onFocus={() => setShowMedicineDropdown(true)}
                    onBlur={() => setTimeout(() => setShowMedicineDropdown(false), 200)}
                  />
                  
                  {showMedicineDropdown && filteredMedicines.length > 0 && (
                    <div className="position-absolute w-100 bg-white border border-top-0 shadow-sm" style={{zIndex: 1000, maxHeight: '200px', overflowY: 'auto'}}>
                      {filteredMedicines.map(medicine => (
                        <div
                          key={medicine.id}
                          className="p-2 border-bottom hover-bg-light cursor-pointer"
                          style={{cursor: 'pointer'}}
                          onMouseDown={() => selectMedicine(medicine)}
                          onMouseEnter={e => e.target.style.backgroundColor = '#f8f9fa'}
                          onMouseLeave={e => e.target.style.backgroundColor = 'white'}
                        >
                          <strong>{medicine.name}</strong> - {medicine.dosage}<br/>
                          <small className="text-muted">
                            {medicine.category} | Stock: {medicine.stock_quantity}
                          </small><br/>
                          <strong className="text-success">PKR {medicine.price || '0.00'}</strong>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {showMedicineDropdown && filteredMedicines.length === 0 && medicineSearch && (
                    <div className="position-absolute w-100 bg-white border border-top-0 shadow-sm p-2" style={{zIndex: 1000}}>
                      <small className="text-muted">No medicines found</small>
                    </div>
                  )}
                </div>
                
                {selectedMedicine && (
                  <div className="card bg-light mb-3">
                    <div className="card-body">
                      <h6 className="card-title">💊 Selected Medicine</h6>
                      <div className="row">
                        <div className="col-md-6">
                          <strong>{selectedMedicine.name}</strong><br/>
                          <small>{selectedMedicine.dosage}</small>
                        </div>
                        <div className="col-md-6">
                          <strong className="text-success">PKR {selectedMedicine.price || '0.00'}</strong> per unit<br/>
                          <small>Stock: {selectedMedicine.stock_quantity}</small>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <label className="form-label">Quantity:</label>
                        <input
                          type="number"
                          className="form-control"
                          min="1"
                          max={selectedMedicine.stock_quantity}
                          value={quantity}
                          onChange={e => setQuantity(parseInt(e.target.value) || 1)}
                        />
                      </div>
                      
                      <div className="mt-2 p-2 bg-info text-white rounded">
                        <strong>Item Total: PKR {((parseFloat(selectedMedicine.price) || 0) * quantity).toFixed(2)}</strong>
                      </div>
                      
                      <div className="mt-2">
                        <button 
                          type="button"
                          className="btn btn-primary w-100"
                          onClick={addToCart}
                        >
                          🛒 Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {medicineCart.length > 0 && (
                  <div className="card bg-light mb-3">
                    <div className="card-header d-flex justify-content-between align-items-center">
                      <h6 className="mb-0">🛒 Medicine Cart ({medicineCart.length} items)</h6>
                      <button 
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setShowCart(!showCart)}
                      >
                        {showCart ? 'Hide' : 'Show'} Cart
                      </button>
                    </div>
                    
                    {showCart && (
                      <div className="card-body">
                        {medicineCart.map((item, index) => (
                          <div key={index} className="d-flex justify-content-between align-items-center border-bottom py-2">
                            <div className="flex-grow-1">
                              <strong>{item.medicine.name}</strong> - {item.medicine.dosage}<br/>
                              <small className="text-muted">PKR {item.unitPrice.toFixed(2)} × {item.quantity} = PKR {item.totalPrice.toFixed(2)}</small>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <input
                                type="number"
                                className="form-control form-control-sm"
                                style={{width: '70px'}}
                                min="1"
                                max={item.medicine.stock_quantity}
                                value={item.quantity}
                                onChange={e => updateCartQuantity(index, parseInt(e.target.value) || 1)}
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-danger"
                                onClick={() => removeFromCart(index)}
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        <div className="mt-3 p-2 bg-success text-white rounded text-center">
                          <strong>Cart Total: PKR {getCartTotal().toFixed(2)}</strong>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                <button 
                  className="btn btn-success w-100" 
                  type="submit"
                  disabled={medicineCart.length === 0 || !selectedPatient}
                >
                  💰 Process All Medicines & Generate Bill ({medicineCart.length} items)
                </button>
              </form>
              {message && <div className="alert alert-info mt-3">{message}</div>}
            </div>
          </div>
          
          {showBill && billDetails && (
            <div className="card mt-4 border-success">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">🧾 Pharmacy Bill - Invoice #{billDetails.billNumber}</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <h6>Bill Details:</h6>
                    <p><strong>Date:</strong> {billDetails.date}</p>
                    <p><strong>Patient:</strong> {billDetails.patientName} (ID: {billDetails.patientId})</p>
                    <p><strong>Bill Number:</strong> {billDetails.billNumber}</p>
                    <p><strong>Total Items:</strong> {billDetails.itemCount}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Summary:</h6>
                    <p><strong>Total Medicines:</strong> {billDetails.medicines.reduce((sum, item) => sum + item.quantity, 0)}</p>
                    <p><strong>Total Amount:</strong> <span className="text-success">PKR {billDetails.totalAmount.toFixed(2)}</span></p>
                    <span className="badge bg-warning">Payment Pending</span>
                  </div>
                </div>
                
                <hr/>
                
                <h6>Medicine Details:</h6>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Medicine</th>
                        <th>Dosage</th>
                        <th>Qty</th>
                        <th>Unit Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {billDetails.medicines.map((item, index) => (
                        <tr key={index}>
                          <td><strong>{item.medicine.name}</strong></td>
                          <td>{item.medicine.dosage}</td>
                          <td>{item.quantity}</td>
                          <td>PKR {item.unitPrice.toFixed(2)}</td>
                          <td>PKR {item.totalPrice.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="table-success">
                        <th colSpan="4" className="text-end">Grand Total:</th>
                        <th>PKR {billDetails.totalAmount.toFixed(2)}</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                <div className="mt-3">
                  <button 
                    className="btn btn-primary me-2"
                    onClick={() => window.print()}
                  >
                    🖨️ Print Bill
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => setShowBill(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PharmacyPortal; 