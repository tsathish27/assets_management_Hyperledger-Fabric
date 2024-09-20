import React, { useState } from 'react';
import axios from 'axios';
// import './AssetForm.css';



const AssetForm = () => {
  const [formData, setFormData] = useState({
    dealerID: '',
    msisdn: '',
    mpin: '',
    balance: '',
    status: '',
    transAmount: '',
    transType: '',
    remarks: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3000/createAsset', formData);
      alert('Asset created successfully');
    } catch (err) {
      console.error(err);
      alert('Error creating asset');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Asset</h2>
      {Object.keys(formData).map((key) => (
        <div key={key}>
          <label>{key.toUpperCase()}:</label>
          <input
            type="text"
            name={key}
            value={formData[key]}
            onChange={handleChange}
            required
          />
        </div>
      ))}
      <button type="submit">Create Asset</button>
    </form>
  );
};

export default AssetForm;
