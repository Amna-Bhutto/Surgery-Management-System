import React, { useState, useEffect } from 'react';
import API from '../api';

function LabTechnicianPortal() {
  const [surgeryId, setSurgeryId] = useState('');
  const [sampleTypeId, setSampleTypeId] = useState('');
  const [resultTypeId, setResultTypeId] = useState('');
  const [resultValue, setResultValue] = useState('');
  const [technicianNotes, setTechnicianNotes] = useState('');
  const [message, setMessage] = useState('');
  
  // Dropdown data
  const [surgeries, setSurgeries] = useState([]);
  const [sampleTypes, setSampleTypes] = useState([]);
  const [resultTypes, setResultTypes] = useState([]);
  
  // Search states
  const [surgerySearch, setSurgerySearch] = useState('');
  const [sampleSearch, setSampleSearch] = useState('');
  const [resultSearch, setResultSearch] = useState('');
  
  // Dropdown visibility states
  const [showSurgeryDropdown, setShowSurgeryDropdown] = useState(false);
  const [showSampleDropdown, setShowSampleDropdown] = useState(false);
  const [showResultDropdown, setShowResultDropdown] = useState(false);
  
  // Filtered data
  const [filteredSurgeries, setFilteredSurgeries] = useState([]);
  const [filteredSampleTypes, setFilteredSampleTypes] = useState([]);
  const [filteredResultTypes, setFilteredResultTypes] = useState([]);
  
  // Selected items for display
  const [selectedSurgery, setSelectedSurgery] = useState(null);
  const [selectedSampleType, setSelectedSampleType] = useState(null);
  const [selectedResultType, setSelectedResultType] = useState(null);

  useEffect(() => {
    fetchSurgeries();
    fetchSampleTypes();
    fetchResultTypes();
  }, []);

  const fetchSurgeries = async () => {
    try {
      const res = await API.get('/lab/surgeries');
      setSurgeries(res.data);
      setFilteredSurgeries(res.data);
    } catch (err) {
      console.error('Failed to fetch surgeries');
    }
  };

  const fetchSampleTypes = async () => {
    try {
      const res = await API.get('/lab/sample-types');
      setSampleTypes(res.data);
      setFilteredSampleTypes(res.data);
    } catch (err) {
      console.error('Failed to fetch sample types');
    }
  };

  const fetchResultTypes = async () => {
    try {
      const res = await API.get('/lab/result-types');
      setResultTypes(res.data);
      setFilteredResultTypes(res.data);
    } catch (err) {
      console.error('Failed to fetch result types');
    }
  };

  // Surgery search and selection
  const handleSurgerySearch = (value) => {
    setSurgerySearch(value);
    setShowSurgeryDropdown(true);
    
    if (value === '') {
      setFilteredSurgeries(surgeries);
    } else {
      const filtered = surgeries.filter(surgery =>
        surgery.patient_name.toLowerCase().includes(value.toLowerCase()) ||
        surgery.doctor.toLowerCase().includes(value.toLowerCase()) ||
        (surgery.surgery_package_name && surgery.surgery_package_name.toLowerCase().includes(value.toLowerCase())) ||
        surgery.id.toString().includes(value)
      );
      setFilteredSurgeries(filtered);
    }
  };

  const selectSurgery = (surgery) => {
    setSelectedSurgery(surgery);
    setSurgeryId(surgery.id);
    setSurgerySearch(`${surgery.patient_name} - ${surgery.surgery_package_name || 'General Surgery'} (${new Date(surgery.date).toLocaleDateString()})`);
    setShowSurgeryDropdown(false);
  };

  // Sample type search and selection
  const handleSampleSearch = (value) => {
    setSampleSearch(value);
    setShowSampleDropdown(true);
    
    if (value === '') {
      setFilteredSampleTypes(sampleTypes);
    } else {
      const filtered = sampleTypes.filter(sample =>
        sample.name.toLowerCase().includes(value.toLowerCase()) ||
        (sample.description && sample.description.toLowerCase().includes(value.toLowerCase())) ||
        (sample.collection_method && sample.collection_method.toLowerCase().includes(value.toLowerCase()))
      );
      setFilteredSampleTypes(filtered);
    }
  };

  const selectSampleType = (sampleType) => {
    setSelectedSampleType(sampleType);
    setSampleTypeId(sampleType.id);
    setSampleSearch(sampleType.name);
    setShowSampleDropdown(false);
  };

  // Result type search and selection
  const handleResultSearch = (value) => {
    setResultSearch(value);
    setShowResultDropdown(true);
    
    if (value === '') {
      setFilteredResultTypes(resultTypes);
    } else {
      const filtered = resultTypes.filter(result =>
        result.name.toLowerCase().includes(value.toLowerCase()) ||
        (result.description && result.description.toLowerCase().includes(value.toLowerCase())) ||
        (result.category && result.category.toLowerCase().includes(value.toLowerCase()))
      );
      setFilteredResultTypes(filtered);
    }
  };

  const selectResultType = (resultType) => {
    setSelectedResultType(resultType);
    setResultTypeId(resultType.id);
    setResultSearch(resultType.name);
    setShowResultDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!surgeryId || !sampleTypeId || !resultTypeId || !resultValue) {
      setMessage('Please fill in all required fields');
      return;
    }

    try {
      const res = await API.post('/lab', { 
        surgeryId: Number(surgeryId), 
        sampleTypeId: Number(sampleTypeId),
        resultTypeId: Number(resultTypeId),
        resultValue,
        technicianNotes
      });
      
      if (res.data.labResultId) {
        setMessage('Lab result submitted successfully!');
        // Reset form
        setSurgeryId('');
        setSampleTypeId('');
        setResultTypeId('');
        setResultValue('');
        setTechnicianNotes('');
        setSurgerySearch('');
        setSampleSearch('');
        setResultSearch('');
        setSelectedSurgery(null);
        setSelectedSampleType(null);
        setSelectedResultType(null);
      } else {
        setMessage('Submission failed');
      }
    } catch (err) {
      console.error('Lab result submission error:', err);
      setMessage(`Submission failed: ${err.response?.data?.error || err.message}`);
    }
  };

  return (
    <div className="container mt-4">
      <style jsx>{`
        .dropdown-item:hover {
          background-color: #f8f9fa !important;
        }
      `}</style>
      
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow">
            <div className="card-body">
              <h3 className="card-title mb-4">🔬 Lab Technician Portal</h3>
              
              <form onSubmit={handleSubmit}>
                {/* Surgery Selection */}
                <div className="mb-4">
                  <label className="form-label">
                    <strong>Surgery Selection *</strong>
                  </label>
                  <div className="position-relative">
                    <input
                      className="form-control"
                      placeholder="Type to search surgeries by patient name, doctor, or surgery type..."
                      value={surgerySearch}
                      onChange={e => handleSurgerySearch(e.target.value)}
                      onFocus={() => setShowSurgeryDropdown(true)}
                      onBlur={() => setTimeout(() => setShowSurgeryDropdown(false), 200)}
                      required
                    />
                    
                    {showSurgeryDropdown && filteredSurgeries.length > 0 && (
                      <div className="position-absolute w-100 bg-white border border-top-0 shadow-sm" style={{zIndex: 1000, maxHeight: '250px', overflowY: 'auto'}}>
                        {filteredSurgeries.map(surgery => (
                          <div
                            key={surgery.id}
                            className="p-3 border-bottom dropdown-item"
                            style={{cursor: 'pointer'}}
                            onMouseDown={() => selectSurgery(surgery)}
                            onMouseEnter={e => e.target.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={e => e.target.style.backgroundColor = 'white'}
                          >
                            <div>
                              <strong>Patient: {surgery.patient_name}</strong><br/>
                              <span className="text-muted">Surgery: {surgery.surgery_package_name || 'General Surgery'}</span><br/>
                              <span className="text-muted">Doctor: {surgery.doctor}</span><br/>
                              <small className="text-info">Date: {new Date(surgery.date).toLocaleDateString()}</small>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {selectedSurgery && (
                    <div className="alert alert-info mt-2">
                      <small>
                        <strong>Selected:</strong> {selectedSurgery.patient_name} - {selectedSurgery.surgery_package_name || 'General Surgery'} 
                        ({new Date(selectedSurgery.date).toLocaleDateString()})
                      </small>
                    </div>
                  )}
                </div>

                {/* Sample Type Selection */}
                <div className="mb-4">
                  <label className="form-label">
                    <strong>Sample Type *</strong>
                  </label>
                  <div className="position-relative">
                    <input
                      className="form-control"
                      placeholder="Type to search sample types (Blood, Urine, Tissue, etc.)..."
                      value={sampleSearch}
                      onChange={e => handleSampleSearch(e.target.value)}
                      onFocus={() => setShowSampleDropdown(true)}
                      onBlur={() => setTimeout(() => setShowSampleDropdown(false), 200)}
                      required
                    />
                    
                    {showSampleDropdown && filteredSampleTypes.length > 0 && (
                      <div className="position-absolute w-100 bg-white border border-top-0 shadow-sm" style={{zIndex: 1000, maxHeight: '250px', overflowY: 'auto'}}>
                        {filteredSampleTypes.map(sampleType => (
                          <div
                            key={sampleType.id}
                            className="p-3 border-bottom dropdown-item"
                            style={{cursor: 'pointer'}}
                            onMouseDown={() => selectSampleType(sampleType)}
                            onMouseEnter={e => e.target.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={e => e.target.style.backgroundColor = 'white'}
                          >
                            <div>
                              <strong>{sampleType.name}</strong><br/>
                              <span className="text-muted">{sampleType.description}</span><br/>
                              <small className="text-info">
                                Collection: {sampleType.collection_method} | 
                                Processing: {sampleType.processing_time_hours}h
                              </small>
                              {sampleType.special_requirements && (
                                <div>
                                  <small className="text-warning">⚠️ {sampleType.special_requirements}</small>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {selectedSampleType && (
                    <div className="alert alert-info mt-2">
                      <small>
                        <strong>Selected:</strong> {selectedSampleType.name} - {selectedSampleType.description}
                      </small>
                    </div>
                  )}
                </div>

                {/* Result Type Selection */}
                <div className="mb-4">
                  <label className="form-label">
                    <strong>Test/Result Type *</strong>
                  </label>
                  <div className="position-relative">
                    <input
                      className="form-control"
                      placeholder="Type to search test types (Hemoglobin, WBC Count, etc.)..."
                      value={resultSearch}
                      onChange={e => handleResultSearch(e.target.value)}
                      onFocus={() => setShowResultDropdown(true)}
                      onBlur={() => setTimeout(() => setShowResultDropdown(false), 200)}
                      required
                    />
                    
                    {showResultDropdown && filteredResultTypes.length > 0 && (
                      <div className="position-absolute w-100 bg-white border border-top-0 shadow-sm" style={{zIndex: 1000, maxHeight: '250px', overflowY: 'auto'}}>
                        {filteredResultTypes.map(resultType => (
                          <div
                            key={resultType.id}
                            className="p-3 border-bottom dropdown-item"
                            style={{cursor: 'pointer'}}
                            onMouseDown={() => selectResultType(resultType)}
                            onMouseEnter={e => e.target.style.backgroundColor = '#f8f9fa'}
                            onMouseLeave={e => e.target.style.backgroundColor = 'white'}
                          >
                            <div>
                              <strong>{resultType.name}</strong>
                              <span className="badge bg-secondary ms-2">{resultType.category}</span><br/>
                              <span className="text-muted">{resultType.description}</span><br/>
                              <small className="text-success">
                                Normal Range: {resultType.normal_range} {resultType.units}
                              </small>
                              {resultType.interpretation_guide && (
                                <div>
                                  <small className="text-info">💡 {resultType.interpretation_guide}</small>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {selectedResultType && (
                    <div className="alert alert-info mt-2">
                      <small>
                        <strong>Selected:</strong> {selectedResultType.name} ({selectedResultType.category}) <br/>
                        <strong>Normal Range:</strong> {selectedResultType.normal_range} {selectedResultType.units}
                      </small>
                    </div>
                  )}
                </div>

                {/* Result Value Input */}
                <div className="mb-4">
                  <label className="form-label">
                    <strong>Test Result Value *</strong>
                    {selectedResultType && selectedResultType.units && (
                      <span className="text-muted"> (in {selectedResultType.units})</span>
                    )}
                  </label>
                  <input
                    className="form-control"
                    placeholder={
                      selectedResultType 
                        ? `Enter result value (Normal: ${selectedResultType.normal_range} ${selectedResultType.units})` 
                        : "Enter the test result value"
                    }
                    value={resultValue}
                    onChange={e => setResultValue(e.target.value)}
                    required
                  />
                </div>

                {/* Technician Notes */}
                <div className="mb-4">
                  <label className="form-label">
                    <strong>Technician Notes</strong> <span className="text-muted">(Optional)</span>
                  </label>
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="Additional observations, methodology notes, or comments..."
                    value={technicianNotes}
                    onChange={e => setTechnicianNotes(e.target.value)}
                  />
                </div>

                <button className="btn btn-success w-100 py-3" type="submit">
                  🔬 Submit Lab Result
                </button>
              </form>
              
              {message && (
                <div className={`alert mt-3 ${message.includes('successfully') ? 'alert-success' : 'alert-danger'}`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabTechnicianPortal; 