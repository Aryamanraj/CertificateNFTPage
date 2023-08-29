import React, { useState } from 'react';

function VerifyCertificate() {
  const [tokenId, setTokenId] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5223/api/verifyCertificate/${tokenId}`);
      const data = await response.json();
      if (data.success) {
        alert(`Certificate is ${data.isValid ? 'valid' : 'invalid'}`);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="form-container">
      <h2>Verify Certificate</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Token ID</label>
          <input value={tokenId} onChange={(e) => setTokenId(e.target.value)} />
        </div>
        <button type="submit">Verify</button>
      </form>
    </div>
  );
}

export default VerifyCertificate;
