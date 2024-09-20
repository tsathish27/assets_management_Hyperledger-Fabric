import React from 'react';
import AssetForm from './components/AssetForm';
import AssetList from './components/AssetList';
import AssetDetails from './components/AssetDetails';
// import './App.css';

function App() {
  return (
    <div className="App">
      <h1>Asset Management System</h1>
      <AssetForm />
      <AssetList />
      <AssetDetails />
    </div>
  );
}

export default App;
