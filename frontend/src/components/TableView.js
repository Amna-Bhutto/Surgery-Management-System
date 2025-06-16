import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

const entityMap = {
  patients: { endpoint: '/patient', columns: ['id', 'name', 'prescription'] },
  consultants: { endpoint: '/consultant', columns: ['id', 'name', 'arriving_time', 'leaving_time', 'available_days'] },
  surgeries: { endpoint: '/surgery', columns: ['id', 'patient_name', 'doctor', 'surgery_package_name', 'package_price', 'date', 'consent'] },
  lab_results: { endpoint: '/lab', columns: ['id', 'patient_name', 'surgery_package_name', 'sample_type', 'result_type', 'result_value', 'test_date'] },
  pharmacy: { endpoint: '/pharmacy', columns: ['id', 'patient_id', 'medicine_name'] },
  feedback: { endpoint: '/feedback', columns: ['id', 'patient_id', 'feedback'] },
  appointments: { endpoint: '/appointment', columns: ['id', 'consultant_id', 'patient_id', 'appointment_day', 'appointment_time', 'reason'] },
  medicines: { endpoint: '/medicine', columns: ['id', 'image', 'name', 'category', 'dosage', 'price', 'stock_quantity', 'description'] },
  billing: { endpoint: '/billing', columns: ['id', 'patient_name', 'bill_number', 'total_amount', 'item_count', 'bill_date'] },
};

function TableView() {
  const { entity } = useParams();
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // Modal states for billing
  const [showBillModal, setShowBillModal] = useState(false);
  const [selectedBill, setSelectedBill] = useState(null);
  const [billItems, setBillItems] = useState([]);
  const [loadingBillItems, setLoadingBillItems] = useState(false);

  useEffect(() => {
    fetchData();
  }, [entity]);

  const fetchData = async () => {
    setError('');
    setMessage('');
    try {
      const res = await API.get(entityMap[entity].endpoint + '/all');
      setData(res.data);
    } catch (err) {
      setError('Failed to fetch data');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this medicine?')) {
      try {
        await API.delete(`/medicine/${id}`);
        setMessage('Medicine deleted successfully!');
        fetchData();
      } catch (err) {
        setError('Failed to delete medicine');
      }
    }
  };

  const fetchBillItems = async (billId) => {
    setLoadingBillItems(true);
    try {
      const res = await API.get(`/billing/${billId}`);
      setBillItems(res.data.items || []);
      // Preserve patient_name from the initially selected bill if API doesn't return it
      const updatedBill = {
        ...res.data.bill,
        patient_name: res.data.bill.patient_name || selectedBill?.patient_name
      };
      setSelectedBill(updatedBill);
    } catch (err) {
      setError('Failed to fetch bill items');
      setBillItems([]);
    } finally {
      setLoadingBillItems(false);
    }
  };

  const handleViewBillItems = async (bill) => {
    setShowBillModal(true);
    setSelectedBill(bill); // Set initial bill data with patient_name from table
    await fetchBillItems(bill.id);
  };

  const closeBillModal = () => {
    setShowBillModal(false);
    setSelectedBill(null);
    setBillItems([]);
  };

  if (!entityMap[entity]) return <div>Invalid table</div>;

  return (
    <div className="container mt-4">
      <h3 className="mb-3">{entity.replace('_', ' ').toUpperCase()}</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}
      
      {entity === 'medicines' && (
        <div className="mb-3">
          <a href="/medicine" className="btn btn-success">Add New Medicine</a>
        </div>
      )}
      
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              {entityMap[entity].columns.map(col => <th key={col}>{col.replace('_', ' ').toUpperCase()}</th>)}
              {(entity === 'medicines' || entity === 'billing') && <th>ACTIONS</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr><td colSpan={entityMap[entity].columns.length + ((entity === 'medicines' || entity === 'billing') ? 1 : 0)}>No data</td></tr>
            ) : (
              data.map(row => (
                <tr key={row.id}>
                  {entityMap[entity].columns.map(col => (
                    <td key={col}>
                      {col === 'price' || col === 'unit_price' || col === 'total_amount' || col === 'package_price' ? 
                       `PKR ${parseFloat(row[col] || 0).toFixed(2)}` : 
                       col === 'description' && row[col] && row[col].length > 50 ? 
                       `${row[col].substring(0, 50)}...` : 
                       col === 'image' ? 
                       <img 
                         src={row.image_url || 'https://via.placeholder.com/60x60/cccccc/666666?text=No+Image'} 
                         alt={row.name} 
                         style={{width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px'}}
                         onError={(e) => {
                           e.target.src = 'https://via.placeholder.com/60x60/cccccc/666666?text=No+Image';
                         }}
                       /> :
                       col === 'bill_date' && row[col] ? 
                       new Date(row[col]).toLocaleString() :
                       col === 'date' && row[col] ? 
                       new Date(row[col]).toLocaleString() :
                       row[col] || '-'}
                    </td>
                  ))}
                  {entity === 'medicines' && (
                    <td>
                      <a 
                        href="/medicine" 
                        className="btn btn-sm btn-primary me-2"
                        onClick={() => {
                          // Store medicine data for editing
                          localStorage.setItem('editMedicine', JSON.stringify(row));
                        }}
                      >
                        Edit
                      </a>
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(row.id)}
                      >
                        Delete
                      </button>
                    </td>
                  )}
                  {entity === 'billing' && (
                    <td>
                      <button 
                        className="btn btn-sm btn-info"
                        onClick={() => handleViewBillItems(row)}
                      >
                        👁️ View Items
                      </button>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      {/* Billing Items Modal */}
      {showBillModal && (
        <div className="modal show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  🧾 Bill Details - {selectedBill?.bill_number}
                </h5>
                <button type="button" className="btn-close" onClick={closeBillModal}></button>
              </div>
              <div className="modal-body">
                {selectedBill && (
                  <>
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <h6>Bill Information:</h6>
                        <p><strong>Bill Number:</strong> {selectedBill.bill_number}</p>
                        <p><strong>Patient:</strong> {selectedBill.patient_name || 'N/A'}</p>
                        <p><strong>Date:</strong> {new Date(selectedBill.bill_date).toLocaleString()}</p>
                      </div>
                      <div className="col-md-6">
                        <h6>Payment Details:</h6>
                        <p><strong>Total Amount:</strong> <span className="text-success">PKR {parseFloat(selectedBill.total_amount || 0).toFixed(2)}</span></p>

                        {selectedBill.notes && <p><strong>Notes:</strong> {selectedBill.notes}</p>}
                      </div>
                    </div>
                    
                    <hr />
                    
                    <h6>Bill Items:</h6>
                    {loadingBillItems ? (
                      <div className="text-center py-3">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    ) : billItems.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-sm table-striped">
                          <thead className="table-dark">
                            <tr>
                              <th>Item Name</th>
                              <th>Quantity</th>
                              <th>Unit Price</th>
                              <th>Total Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {billItems.map((item, index) => (
                              <tr key={index}>
                                <td>{item.medicine_name}</td>
                                <td>{item.quantity}</td>
                                <td>PKR {parseFloat(item.unit_price || 0).toFixed(2)}</td>
                                <td>PKR {parseFloat(item.total_price || 0).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="table-success">
                              <th colSpan="3" className="text-end">Grand Total:</th>
                              <th>PKR {parseFloat(selectedBill.total_amount || 0).toFixed(2)}</th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    ) : (
                      <div className="alert alert-info">
                        No items found for this bill.
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => window.print()}>
                  🖨️ Print Bill
                </button>
                <button type="button" className="btn btn-secondary" onClick={closeBillModal}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TableView; 