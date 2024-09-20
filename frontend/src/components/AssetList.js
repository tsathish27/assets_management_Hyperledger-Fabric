import React, { useState, useEffect } from 'react';
import axios from 'axios';
// import './AssetList.css';




const AssetList = () => {
  const [assets, setAssets] = useState([]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get('http://localhost:3000/assets');
        setAssets(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchAssets();
  }, []);

  return (
    <div>
      <h2>Asset List</h2>
      <ul>
        {assets.map((asset) => (
          <li key={asset.msisdn}>
            {asset.dealerID} - {asset.balance} ({asset.status})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssetList;
