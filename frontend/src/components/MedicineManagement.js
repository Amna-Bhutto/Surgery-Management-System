import React, { useState, useEffect } from 'react';
import API from '../api';

function MedicineManagement() {
  const [medicines, setMedicines] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    dosage: '',
    price: '',
    stock_quantity: ''
  });
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      const res = await API.get('/medicine/all');
      setMedicines(res.data);
    } catch (err) {
      setMessage('Failed to fetch medicines');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      if (editingId) {
        await API.put(`/medicine/${editingId}`, formData);
        setMessage('Medicine updated successfully!');
        setEditingId(null);
      } else {
        await API.post('/medicine', formData);
        setMessage('Medicine added successfully!');
      }
      setFormData({
        name: '',
        description: '',
        category: '',
        dosage: '',
        price: '',
        stock_quantity: ''
      });
      fetchMedicines();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to save medicine');
    }
  };

  const handleEdit = (medicine) => {
    setFormData({
      name: medicine.name,
      description: medicine.description || '',
      category: medicine.category || '',
      dosage: medicine.dosage || '',
      price: medicine.price || '',
      stock_quantity: medicine.stock_quantity || ''
    });
    setEditingId(medicine.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await API.delete(`/medicine/${id}`);
        setMessage('Medicine deleted successfully!');
        fetchMedicines();
      } catch (err) {
        setMessage('Failed to delete medicine');
      }
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Medicine Management</h2>
      
      {/* Medicine Form */}
      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title">{editingId ? 'Edit Medicine' : 'Add New Medicine'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-md-6">
                <input
                  className="form-control mb-2"
                  placeholder="Medicine Name *"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control mb-2"
                  placeholder="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <input
                  className="form-control mb-2"
                  placeholder="Dosage"
                  name="dosage"
                  value={formData.dosage}
                  onChange={handleInputChange}
                />
              </div>
              <div className="col-md-6">
                <input
                  className="form-control mb-2"
                  placeholder="Price (PKR)"
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="row">
              <div className="col-md-6">
                <input
                  className="form-control mb-2"
                  placeholder="Stock Quantity"
                  name="stock_quantity"
                  type="number"
                  value={formData.stock_quantity}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <textarea
              className="form-control mb-2"
              placeholder="Description"
              name="description"
              rows="3"
              value={formData.description}
              onChange={handleInputChange}
            />
            <div className="d-flex gap-2">
              <button className="btn btn-success" type="submit">
                {editingId ? 'Update Medicine' : 'Add Medicine'}
              </button>
              {editingId && (
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setFormData({
                      name: '',
                      description: '',
                      category: '',
                      dosage: '',
                      price: '',
                      stock_quantity: ''
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

      {/* Medicine List */}
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">Medicine List</h5>
          <div className="table-responsive">
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Dosage</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {medicines.map((medicine) => (
                  <tr key={medicine.id}>
                    <td>{medicine.name}</td>
                    <td>{medicine.category || '-'}</td>
                    <td>{medicine.dosage || '-'}</td>
                    <td>PKR {medicine.price || '0.00'}</td>
                    <td>{medicine.stock_quantity || 0}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => handleEdit(medicine)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(medicine.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MedicineManagement; 