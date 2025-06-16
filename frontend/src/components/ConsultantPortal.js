import React, { useState, useEffect } from 'react';
import API from '../api';

function ConsultantPortal() {
  const [consultants, setConsultants] = useState([]);
  const [formData, setFormData] = useState({
    consultantName: '',
    arrivingTime: '',
    leavingTime: '',
    availableDays: [],
    imageUrl: ''
  });
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchConsultants();
  }, []);

  const fetchConsultants = async () => {
    try {
      const res = await API.get('/consultant/all');
      setConsultants(res.data);
    } catch (err) {
      setMessage('Failed to fetch consultants');
    }
  };

  const handleDayChange = (day) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day) 
        ? prev.availableDays.filter(d => d !== day) 
        : [...prev.availableDays, day]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    if (!formData.consultantName || !formData.arrivingTime || !formData.leavingTime) {
      setMessage('Please fill in all required fields');
      return;
    }

    try {
      const requestData = {
        consultantName: formData.consultantName,
        arrivingTime: formData.arrivingTime,
        leavingTime: formData.leavingTime,
        availableDays: formData.availableDays,
        image_url: formData.imageUrl
      };

      if (editingId) {
        await API.put(`/consultant/${editingId}`, requestData);
        setMessage('Consultant updated successfully!');
        setEditingId(null);
      } else {
        await API.post('/consultant', requestData);
        setMessage('Consultant added successfully!');
      }
      
      setFormData({
        consultantName: '',
        arrivingTime: '',
        leavingTime: '',
        availableDays: [],
        imageUrl: ''
      });
      fetchConsultants();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to save consultant');
    }
  };

  const handleEdit = (consultant) => {
    setFormData({
      consultantName: consultant.name,
      arrivingTime: consultant.arriving_time || '',
      leavingTime: consultant.leaving_time || '',
      availableDays: consultant.available_days || [],
      imageUrl: consultant.image_url || ''
    });
    setEditingId(consultant.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this consultant?')) {
      try {
        await API.delete(`/consultant/${id}`);
        setMessage('Consultant deleted successfully!');
        fetchConsultants();
      } catch (err) {
        setMessage('Failed to delete consultant');
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const formatAvailableDays = (days) => {
    if (!days || days.length === 0) return 'No days set';
    if (typeof days === 'string') {
      try {
        days = JSON.parse(days);
      } catch {
        return days;
      }
    }
    return Array.isArray(days) ? days.join(', ') : days;
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">👨‍⚕️ Consultant Management</h2>
      
      {/* Consultant Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{editingId ? 'Edit Consultant' : 'Add New Consultant'}</h5>
          
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <input
                  className="form-control mb-2"
                  placeholder="Consultant Name *"
                  name="consultantName"
                  value={formData.consultantName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control mb-2"
                  placeholder="Image URL (optional)"
                  name="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <label className="form-label">Arriving Time *</label>
                <input
                  className="form-control mb-2"
                  type="time"
                  name="arrivingTime"
                  value={formData.arrivingTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Leaving Time *</label>
                <input
                  className="form-control mb-2"
                  type="time"
                  name="leavingTime"
                  value={formData.leavingTime}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            
            {/* Image Preview */}
            {formData.imageUrl && (
              <div className="mb-3">
                <label className="form-label">Image Preview:</label>
                <div className="d-flex align-items-center">
                  <img 
                    src={formData.imageUrl} 
                    alt="Consultant preview" 
                    style={{width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px'}}
                    onError={(e) => {
                      e.target.src = 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg';
                    }}
                  />
                  <small className="text-muted ms-3">Preview of consultant photo</small>
                </div>
              </div>
            )}
            
            {/* Available Days */}
            <div className="mb-3">
              <label className="form-label">Available Days:</label>
              <div className="row">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                  <div key={day} className="col-md-3 col-sm-6">
                    <div className="form-check">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id={day}
                        checked={formData.availableDays.includes(day)} 
                        onChange={() => handleDayChange(day)} 
                      />
                      <label className="form-check-label" htmlFor={day}>
                        {day}
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="d-flex gap-2">
              <button className="btn btn-success" type="submit">
                {editingId ? '📝 Update Consultant' : '➕ Add Consultant'}
              </button>
              {editingId && (
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      consultantName: '',
                      arrivingTime: '',
                      leavingTime: '',
                      availableDays: [],
                      imageUrl: ''
                    });
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          {message && <div className="alert alert-info mt-2">{message}</div>}
        </div>
      </div>

      {/* Consultant List */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Consultant List ({consultants.length})</h5>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Schedule</th>
                  <th>Available Days</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {consultants.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center text-muted">
                      No consultants found. Add your first consultant above.
                    </td>
                  </tr>
                ) : (
                  consultants.map((consultant) => (
                    <tr key={consultant.id}>
                      <td>
                        <img 
                          src={consultant.image_url || 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg'} 
                          alt={consultant.name} 
                          style={{width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px'}}
                          onError={(e) => {
                            e.target.src = 'https://media.healthecareers.com/wp-content/uploads/2022/02/11204020/placeholderdoctor.jpg';
                          }}
                        />
                      </td>
                      <td>
                        <strong>Dr. {consultant.name}</strong>
                      </td>
                      <td>
                        <small className="text-muted">
                          🕐 {consultant.arriving_time} - {consultant.leaving_time}
                        </small>
                      </td>
                      <td>
                        <small className="text-info">
                          📅 {formatAvailableDays(consultant.available_days)}
                        </small>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => handleEdit(consultant)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(consultant.id)}
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultantPortal; 