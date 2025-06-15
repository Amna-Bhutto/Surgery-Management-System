import React, { useState, useEffect } from 'react';
import API from '../api';

function PatientPortal() {
  const [name, setName] = useState('');
  const [prescription, setPrescription] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [patients, setPatients] = useState([]);

  const [message, setMessage] = useState('');
  const [prescriptionSearch, setPrescriptionSearch] = useState('');
  const [showPrescriptionDropdown, setShowPrescriptionDropdown] = useState(false);
  const [filteredMedicines, setFilteredMedicines] = useState([]);
  const [prescriptionList, setPrescriptionList] = useState([]);
  const [showPrescriptions, setShowPrescriptions] = useState(false);
  const [patientSearch, setPatientSearch] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [isNewPatient, setIsNewPatient] = useState(true);

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
    setName(value); // Update name field as user types
    setShowPatientDropdown(true);
    setIsNewPatient(true); // Assume new patient by default
    
    if (value === '') {
      setFilteredPatients(patients);
    } else {
      const filtered = patients.filter(patient =>
        patient.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredPatients(filtered);
    }
  };

  const selectExistingPatient = (patient) => {
    setName(patient.name);
    setPatientSearch(patient.name);
    setShowPatientDropdown(false);
    setIsNewPatient(false);
    setMessage(`Selected existing patient: ${patient.name}`);
    
    // Load existing prescription if available
    if (patient.prescription) {
      setPrescription(patient.prescription);
    }
  };

  const handlePrescriptionSearch = (value) => {
    setPrescriptionSearch(value);
    setShowPrescriptionDropdown(true);
    
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

  const selectPrescription = (medicine) => {
    setPrescription(medicine.name);
    setPrescriptionSearch(`${medicine.name} - ${medicine.dosage}`);
    setShowPrescriptionDropdown(false);
  };

  const addToPrescriptions = (medicine) => {
    // Check if medicine already in prescription list
    const exists = prescriptionList.find(item => item.id === medicine.id);
    
    if (!exists) {
      setPrescriptionList([...prescriptionList, medicine]);
      setMessage(`${medicine.name} added to prescriptions!`);
    } else {
      setMessage(`${medicine.name} is already in prescriptions`);
    }
    
    setPrescriptionSearch('');
    setShowPrescriptionDropdown(false);
  };

  const removeFromPrescriptions = (medicineId) => {
    const newList = prescriptionList.filter(med => med.id !== medicineId);
    setPrescriptionList(newList);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    // Create prescription string from multiple medicines
    const prescriptionString = prescriptionList.length > 0 
      ? prescriptionList.map(med => `${med.name} (${med.dosage})`).join(', ')
      : prescription;
      
    try {
      if (isNewPatient) {
        // Create new patient
        console.log('Creating new patient:', { name, prescription: prescriptionString });
        const res = await API.post('/patient', { name, prescription: prescriptionString });
        if (res.data.patientId) {
          setMessage(`New patient created with ${prescriptionList.length || (prescription ? 1 : 0)} prescription(s)!`);
          setName(''); 
          setPatientSearch('');
          setPrescription('');
          setPrescriptionSearch('');
          setPrescriptionList([]);
          setIsNewPatient(true);
          fetchPatients(); // Refresh patient list
        } else {
          setMessage('Failed to create patient');
        }
      } else {
        // Update existing patient
        const patient = patients.find(p => p.name === name);
        console.log('Updating patient:', patient, 'with data:', { name, prescription: prescriptionString });
        
        if (patient) {
          const res = await API.put(`/patient/${patient.id}`, { 
            name, 
            prescription: prescriptionString
          });
          setMessage(`Patient ${name} updated with ${prescriptionList.length || (prescription ? 1 : 0)} prescription(s)!`);
          setName(''); 
          setPatientSearch('');
          setPrescription('');
          setPrescriptionSearch('');
          setPrescriptionList([]);
          setIsNewPatient(true);
          fetchPatients(); // Refresh patient list
        } else {
          setMessage('Patient not found for update');
        }
      }
    } catch (err) {
      console.error('Operation failed:', err);
      setMessage(`Operation failed: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="card mx-auto" style={{ maxWidth: 500 }}>
      <div className="card-body">
        <h3 className="card-title mb-4">👥 Patient Portal</h3>
        <form onSubmit={handleSubmit}>
          <div className="position-relative mb-3">
            <input
              className="form-control"
              placeholder="Type patient name (search existing or add new)..."
              value={patientSearch}
              onChange={e => handlePatientSearch(e.target.value)}
              onFocus={() => setShowPatientDropdown(true)}
              onBlur={() => setTimeout(() => setShowPatientDropdown(false), 200)}
              required
            />
            
            {showPatientDropdown && filteredPatients.length > 0 && (
              <div className="position-absolute w-100 bg-white border border-top-0 shadow-sm" style={{zIndex: 1000, maxHeight: '200px', overflowY: 'auto'}}>
                {filteredPatients.map(patient => (
                  <div
                    key={patient.id}
                    className="p-2 border-bottom hover-bg-light cursor-pointer"
                    style={{cursor: 'pointer'}}
                    onMouseDown={() => selectExistingPatient(patient)}
                    onMouseEnter={e => e.target.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={e => e.target.style.backgroundColor = 'white'}
                  >
                    <strong>{patient.name}</strong><br/>
                    <small className="text-muted">
                      {patient.prescription ? `Prescription: ${patient.prescription.substring(0, 50)}${patient.prescription.length > 50 ? '...' : ''}` : 'No prescription'}
                    </small>
                  </div>
                ))}
              </div>
            )}
            
            {showPatientDropdown && filteredPatients.length === 0 && patientSearch && (
              <div className="position-absolute w-100 bg-white border border-top-0 shadow-sm p-2" style={{zIndex: 1000}}>
                <small className="text-success">✨ New patient: "{patientSearch}" will be created</small>
              </div>
            )}
          </div>
          
          {!isNewPatient && (
            <div className="alert alert-info">
              <small>📝 Editing existing patient: <strong>{name}</strong></small>
            </div>
          )}
          
          <div className="position-relative mb-3">
            <input
              className="form-control"
              placeholder="Type to search prescription medicines (Optional)..."
              value={prescriptionSearch}
              onChange={e => handlePrescriptionSearch(e.target.value)}
              onFocus={() => setShowPrescriptionDropdown(true)}
              onBlur={() => setTimeout(() => setShowPrescriptionDropdown(false), 200)}
            />
            
            {showPrescriptionDropdown && filteredMedicines.length > 0 && (
              <div className="position-absolute w-100 bg-white border border-top-0 shadow-sm" style={{zIndex: 1000, maxHeight: '200px', overflowY: 'auto'}}>
                {filteredMedicines.map(medicine => (
                  <div
                    key={medicine.id}
                    className="p-2 border-bottom hover-bg-light cursor-pointer d-flex justify-content-between align-items-center"
                    style={{cursor: 'pointer'}}
                    onMouseEnter={e => e.target.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={e => e.target.style.backgroundColor = 'white'}
                  >
                    <div onClick={() => selectPrescription(medicine)}>
                      <strong>{medicine.name}</strong> - {medicine.dosage}<br/>
                      <small className="text-muted">{medicine.category}</small><br/>
                      <strong className="text-success">PKR {medicine.price || '0.00'}</strong> per unit
                    </div>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onMouseDown={() => addToPrescriptions(medicine)}
                    >
                      + Add
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {showPrescriptionDropdown && filteredMedicines.length === 0 && prescriptionSearch && (
              <div className="position-absolute w-100 bg-white border border-top-0 shadow-sm p-2" style={{zIndex: 1000}}>
                <small className="text-muted">No medicines found</small>
              </div>
            )}
          </div>
          
          {prescriptionList.length > 0 && (
            <div className="card bg-light mb-3">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h6 className="mb-0">💊 Prescription List ({prescriptionList.length} medicines)</h6>
                <button 
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => setShowPrescriptions(!showPrescriptions)}
                >
                  {showPrescriptions ? 'Hide' : 'Show'} List
                </button>
              </div>
              
              {showPrescriptions && (
                <div className="card-body">
                  {prescriptionList.map((medicine, index) => (
                    <div key={medicine.id} className="d-flex justify-content-between align-items-center border-bottom py-2">
                      <div>
                        <strong>{medicine.name}</strong> - {medicine.dosage}<br/>
                        <small className="text-muted">{medicine.category} | PKR {medicine.price || '0.00'}</small>
                      </div>
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        onClick={() => removeFromPrescriptions(medicine.id)}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  
                  <div className="mt-2 p-2 bg-info text-white rounded text-center">
                    <strong>Total Prescribed: {prescriptionList.length} medicines</strong>
                  </div>
                </div>
              )}
            </div>
          )}
          

          
          <button className="btn btn-success w-100" type="submit">
            {isNewPatient ? '➕ Create New Patient' : '📝 Update Patient'} {prescriptionList.length > 0 && `(${prescriptionList.length} prescriptions)`}
          </button>
        </form>
        {message && <div className="alert alert-info mt-2">{message}</div>}
      </div>
    </div>
  );
}

export default PatientPortal; 