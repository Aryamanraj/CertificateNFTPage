import React, { useState } from 'react';

function GetCertificateDetails() {
  const [tokenId, setTokenId] = useState('');
  const [certificateDetails, setCertificateDetails] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5223/api/getCertificateDetails/${tokenId}`);
      const data = await response.json();
      if (data.success) {
        setCertificateDetails(data);
      } else {
        setCertificateDetails(null);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      setCertificateDetails(null);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Get Certificate Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Token ID</label>
          <input value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
        </div>
        <button type="submit">Fetch Details</button>
      </form>
      {certificateDetails && (
        <div className="certificate-details">
          <h3>Certificate Details</h3>
          <p>Name: {certificateDetails.name}</p>
          <p>Course: {certificateDetails.course}</p>
          <p>Date: {certificateDetails.date}</p> {/* Display the raw date value */}
          <p>Issuer: {certificateDetails.issuer}</p>
        </div>
      )}
    </div>
  );
}

export default GetCertificateDetails;
