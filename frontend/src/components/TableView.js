import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';

const entityMap = {
  patients: { endpoint: '/patient', columns: ['id', 'name', 'prescription', 'status'] },
  consultants: { endpoint: '/consultant', columns: ['id', 'patient_id', 'name'] },
  surgeries: { endpoint: '/surgery', columns: ['id', 'patient_id', 'doctor', 'date', 'consent'] },
  lab_results: { endpoint: '/lab', columns: ['id', 'surgery_id', 'sample_name', 'result'] },
  pharmacy: { endpoint: '/pharmacy', columns: ['id', 'patient_id', 'medicine_name'] },
  feedback: { endpoint: '/feedback', columns: ['id', 'patient_id', 'feedback'] },
};

function TableView() {
  const { entity } = useParams();
  const [data, setData] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setError('');
      try {
        const res = await API.get(entityMap[entity].endpoint + '/all');
        setData(res.data);
      } catch (err) {
        setError('Failed to fetch data');
      }
    };
    if (entityMap[entity]) fetchData();
  }, [entity]);

  if (!entityMap[entity]) return <div>Invalid table</div>;

  return (
    <div>
      <h3 className="mb-3">{entity.replace('_', ' ').toUpperCase()}</h3>
      {error && <div className="alert alert-danger">{error}</div>}
      <table className="table table-bordered">
        <thead>
          <tr>
            {entityMap[entity].columns.map(col => <th key={col}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={entityMap[entity].columns.length}>No data</td></tr>
          ) : (
            data.map(row => (
              <tr key={row.id}>
                {entityMap[entity].columns.map(col => <td key={col}>{row[col]}</td>)}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default TableView; 