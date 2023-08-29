import React from 'react';
import './App.css';
import MintForm from './components/MintForm';
import VerifyCertificate from './components/VerifyCertificate';
import GetCertificateDetails from './components/GetCertificateDetails';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        Certificate NFT
      </header>
      <MintForm />
      <VerifyCertificate />
      <GetCertificateDetails />
    </div>
  );
}

export default App;
