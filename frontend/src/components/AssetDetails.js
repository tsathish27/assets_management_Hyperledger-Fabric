import React, { useState } from 'react';
import axios from 'axios';
// import './AssetDetails.css';


const AssetDetails = () => {
  const [msisdn, setMsisdn] = useState('');
  const [asset, setAsset] = useState(null);

  const fetchAssetDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/readAsset/${msisdn}`);
      setAsset(response.data);
    } catch (err) {
      console.error(err);
      alert('Error fetching asset details');
    }
  };

  return (
    <div>
      <h2>Asset Details</h2>
      <input
        type="text"
        placeholder="Enter MSISDN"
        value={msisdn}
        onChange={(e) => setMsisdn(e.target.value)}
      />
      <button onClick={fetchAssetDetails}>Get Details</button>

      {asset && (
        <div>
          <h3>Details for MSISDN: {msisdn}</h3>
          <p>Dealer ID: {asset.dealerID}</p>
          <p>Balance: {asset.balance}</p>
          <p>Status: {asset.status}</p>
          <p>Remarks: {asset.remarks}</p>
        </div>
      )}
    </div>
  );
};

export default AssetDetails;
