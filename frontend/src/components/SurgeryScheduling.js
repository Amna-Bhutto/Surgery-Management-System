import React, { useState, useEffect } from 'react';
import API from '../api';

function SurgeryScheduling() {
  const [patientId, setPatientId] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [doctor, setDoctor] = useState('');
  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [date, setDate] = useState('');
  const [consent, setConsent] = useState('Yes');
  const [message, setMessage] = useState('');
  
  // Patient dropdown states
  const [patients, setPatients] = useState([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [filteredPatients, setFilteredPatients] = useState([]);
  
  // Consultant dropdown states
  const [consultants, setConsultants] = useState([]);
  const [consultantSearch, setConsultantSearch] = useState('');
  const [showConsultantDropdown, setShowConsultantDropdown] = useState(false);
  const [filteredConsultants, setFilteredConsultants] = useState([]);

  // Surgery packages dropdown states
  const [surgeryPackages, setSurgeryPackages] = useState([]);
  const [selectedSurgeryPackage, setSelectedSurgeryPackage] = useState(null);
  const [packageSearch, setPackageSearch] = useState('');
  const [showPackageDropdown, setShowPackageDropdown] = useState(false);
  const [filteredPackages, setFilteredPackages] = useState([]);

  useEffect(() => {
    fetchPatients();
    fetchConsultants();
    fetchSurgeryPackages();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await API.get('/patient/all');
      setPatients(res.data);
      setFilteredPatients(res.data);
    } catch (err) {
      console.error('Failed to fetch patients');
    }
  };

  const fetchConsultants = async () => {
    try {
      const res = await API.get('/consultant/all');
      setConsultants(res.data);
      setFilteredConsultants(res.data);
    } catch (err) {
      console.error('Failed to fetch consultants');
    }
  };

  const fetchSurgeryPackages = async () => {
    try {
      const res = await API.get('/surgeryPackages/all');
      setSurgeryPackages(res.data);
      setFilteredPackages(res.data);
    } catch (err) {
      console.error('Failed to fetch surgery packages');
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

  const handleConsultantSearch = (value) => {
    setConsultantSearch(value);
    setShowConsultantDropdown(true);
    
    if (value === '') {
      setFilteredConsultants(consultants);
    } else {
      const filtered = consultants.filter(consultant =>
        consultant.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredConsultants(filtered);
    }
  };

  const selectConsultant = (consultant) => {
    setSelectedConsultant(consultant);
    setDoctor(consultant.name);
    setConsultantSearch(consultant.name);
    setShowConsultantDropdown(false);
  };

  const handlePackageSearch = (value) => {
    setPackageSearch(value);
    setShowPackageDropdown(true);
    
    if (value === '') {
      setFilteredPackages(surgeryPackages);
    } else {
      const filtered = surgeryPackages.filter(pkg =>
        pkg.name.toLowerCase().includes(value.toLowerCase()) ||
        (pkg.category && pkg.category.toLowerCase().includes(value.toLowerCase())) ||
        (pkg.description && pkg.description.toLowerCase().includes(value.toLowerCase()))
      );
      setFilteredPackages(filtered);
    }
  };

  const selectSurgeryPackage = (surgeryPackage) => {
    setSelectedSurgeryPackage(surgeryPackage);
    setPackageSearch(`${surgeryPackage.name} - PKR ${parseFloat(surgeryPackage.price || 0).toFixed(2)}`);
    setShowPackageDropdown(false);
  };

  // Helper function to safely parse available days
  const getAvailableDays = (availableDays) => {
    if (!availableDays) return '';
    
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(availableDays);
      if (Array.isArray(parsed)) {
        return parsed.join(', ');
      }
      return parsed.toString();
    } catch (error) {
      // If parsing fails, treat as plain string
      return availableDays.toString();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!selectedPatient) {
      setMessage('Please select a patient');
      return;
    }
    
    if (!selectedConsultant) {
      setMessage('Please select a consultant');
      return;
    }
    
    if (!date) {
      setMessage('Please select a date and time');
      return;
    }
    
    try {
      const res = await API.post('/surgery', { 
        patientId: Number(patientId), 
        doctor, 
        surgeryPackageId: selectedSurgeryPackage?.id,
        date, 
        consent 
      });
      if (res.data.surgeryId) {
        const successMessage = selectedSurgeryPackage 
          ? `Surgery scheduled for ${selectedPatient.name} with Dr. ${selectedConsultant.name}!\nPackage: ${selectedSurgeryPackage.name} (PKR ${parseFloat(selectedSurgeryPackage.price || 0).toFixed(2)})\nBill #${res.data.billNumber} generated.`
          : `Surgery scheduled for ${selectedPatient.name} with Dr. ${selectedConsultant.name}!`;
        
        setMessage(successMessage);
        // Reset form
        setPatientId('');
        setSelectedPatient(null);
        setPatientSearch('');
        setDoctor('');
        setSelectedConsultant(null);
        setConsultantSearch('');
        setSelectedSurgeryPackage(null);
        setPackageSearch('');
        setDate('');
        setConsent('Yes');
      } else {
        setMessage('Scheduling failed');
      }
    } catch (err) {
      setMessage(`Scheduling failed: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="card mx-auto" style={{ maxWidth: 600 }}>
      <div className="card-body">
        <h3 className="card-title mb-4">🏥 Surgery Scheduling</h3>
        <form onSubmit={handleSubmit}>
          
          {/* Patient Dropdown */}
          <div className="position-relative mb-3">
            <label className="form-label">Patient *</label>
            <input
              className="form-control"
              placeholder="Search patient by name or ID..."
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
                    onMouseDown={() => selectPatient(patient)}
                    onMouseEnter={e => e.target.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={e => e.target.style.backgroundColor = 'white'}
                  >
                    <strong>{patient.name}</strong> - ID: {patient.id}<br/>
                                          <small className="text-muted">
                        Prescription: {patient.prescription || 'None'}
                      {patient.prescription && ` | Prescription: ${patient.prescription.substring(0, 30)}${patient.prescription.length > 30 ? '...' : ''}`}
                    </small>
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

          {/* Consultant Dropdown */}
          <div className="position-relative mb-3">
            <label className="form-label">Consultant/Doctor *</label>
            <input
              className="form-control"
              placeholder="Search consultant by name..."
              value={consultantSearch}
              onChange={e => handleConsultantSearch(e.target.value)}
              onFocus={() => setShowConsultantDropdown(true)}
              onBlur={() => setTimeout(() => setShowConsultantDropdown(false), 200)}
              required
            />
            
            {showConsultantDropdown && filteredConsultants.length > 0 && (
              <div className="position-absolute w-100 bg-white border border-top-0 shadow-sm" style={{zIndex: 1000, maxHeight: '200px', overflowY: 'auto'}}>
                {filteredConsultants.map(consultant => (
                  <div
                    key={consultant.id}
                    className="p-2 border-bottom hover-bg-light cursor-pointer d-flex align-items-center"
                    style={{cursor: 'pointer'}}
                    onMouseDown={() => selectConsultant(consultant)}
                    onMouseEnter={e => e.target.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={e => e.target.style.backgroundColor = 'white'}
                  >
                    <img 
                      src={consultant.image_url || 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg'} 
                      alt={consultant.name} 
                      style={{width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px', marginRight: '10px'}}
                      onError={(e) => {
                        e.target.src = 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg';
                      }}
                    />
                    <div>
                      <strong>Dr. {consultant.name}</strong><br/>
                      <small className="text-muted">
                        Available: {consultant.arriving_time} - {consultant.leaving_time}
                        {consultant.available_days && ` | Days: ${getAvailableDays(consultant.available_days)}`}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {showConsultantDropdown && filteredConsultants.length === 0 && consultantSearch && (
              <div className="position-absolute w-100 bg-white border border-top-0 shadow-sm p-2" style={{zIndex: 1000}}>
                <small className="text-muted">No consultants found</small>
              </div>
            )}
          </div>

          {/* Surgery Package Dropdown */}
          <div className="position-relative mb-3">
            <label className="form-label">Surgery Package (Optional)</label>
            <input
              className="form-control"
              placeholder="Search surgery packages by name or category..."
              value={packageSearch}
              onChange={e => handlePackageSearch(e.target.value)}
              onFocus={() => setShowPackageDropdown(true)}
              onBlur={() => setTimeout(() => setShowPackageDropdown(false), 200)}
            />
            
            {showPackageDropdown && filteredPackages.length > 0 && (
              <div className="position-absolute w-100 bg-white border border-top-0 shadow-sm" style={{zIndex: 1000, maxHeight: '200px', overflowY: 'auto'}}>
                {filteredPackages.map(pkg => (
                  <div
                    key={pkg.id}
                    className="p-2 border-bottom hover-bg-light cursor-pointer"
                    style={{cursor: 'pointer'}}
                    onMouseDown={() => selectSurgeryPackage(pkg)}
                    onMouseEnter={e => e.target.style.backgroundColor = '#f8f9fa'}
                    onMouseLeave={e => e.target.style.backgroundColor = 'white'}
                  >
                    <strong>{pkg.name}</strong> - <span className="text-success">PKR {parseFloat(pkg.price || 0).toFixed(2)}</span><br/>
                    <small className="text-muted">
                      {pkg.category} | Duration: {pkg.duration_hours}h | Complexity: {pkg.complexity_level}
                    </small>
                    {pkg.description && (
                      <><br/><small className="text-info">{pkg.description.substring(0, 60)}...</small></>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            {showPackageDropdown && filteredPackages.length === 0 && packageSearch && (
              <div className="position-absolute w-100 bg-white border border-top-0 shadow-sm p-2" style={{zIndex: 1000}}>
                <small className="text-muted">No surgery packages found</small>
              </div>
            )}
          </div>

          {/* Selected Patient & Consultant Display */}
          {selectedPatient && (
            <div className="alert alert-info">
                              <small>👤 <strong>Patient:</strong> {selectedPatient.name} (ID: {selectedPatient.id})</small>
            </div>
          )}
          
          {selectedConsultant && (
            <div className="alert alert-success">
              <small>👨‍⚕️ <strong>Consultant:</strong> Dr. {selectedConsultant.name} - Available: {selectedConsultant.arriving_time} to {selectedConsultant.leaving_time}</small>
            </div>
          )}

          {selectedSurgeryPackage && (
            <div className="alert alert-warning">
              <small>💰 <strong>Surgery Package:</strong> {selectedSurgeryPackage.name} - PKR {parseFloat(selectedSurgeryPackage.price || 0).toFixed(2)}</small><br/>
              <small className="text-muted">{selectedSurgeryPackage.category} | Duration: {selectedSurgeryPackage.duration_hours}h | {selectedSurgeryPackage.complexity_level} complexity</small>
            </div>
          )}

          {/* Date & Time */}
          <div className="mb-3">
            <label className="form-label">Surgery Date & Time *</label>
            <input 
              className="form-control" 
              placeholder="YYYY-MM-DD HH:MM" 
              type="datetime-local"
              value={date} 
              onChange={e => setDate(e.target.value)}
              required
            />
          </div>

          {/* Consent */}
          <div className="mb-3">
            <label className="form-label">Patient Consent</label>
            <select className="form-control" value={consent} onChange={e => setConsent(e.target.value)}>
              <option value="Yes">✅ Yes - Consent Given</option>
              <option value="No">❌ No - Consent Pending</option>
            </select>
          </div>

          <button 
            className="btn btn-success w-100" 
            type="submit"
            disabled={!selectedPatient || !selectedConsultant}
          >
            🗓️ Schedule Surgery
          </button>
        </form>
        {message && <div className="alert alert-info mt-3">{message}</div>}
      </div>
    </div>
  );
}

export default SurgeryScheduling; 