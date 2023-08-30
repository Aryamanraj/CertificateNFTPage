import React, { useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

function MintForm() {
  const [formData, setFormData] = useState({
    name: "",
    course: "",
    date: "",
    issuer: "",
    validUntilDate: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tokenId, setTokenId] = useState(null);
  const [showCertificate, setShowCertificate] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === "date") {
        finalValue = new Date(value).toLocaleDateString(); // Convert to string for display
      } else if (name === "validUntilDate") {
        finalValue = new Date(value).getTime() / 1000; // Convert to Unix timestamp
      }
  

    setFormData((prevState) => ({ ...prevState, [name]: finalValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:5223/api/mintCertificate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (data.success) {
        setTokenId(data.tokenId);
        setShowCertificate(true);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
    setIsLoading(false);
  };

  const downloadPDF = () => {
    const input = document.querySelector("#certificate-content");
    if (!input) {
      alert("Error capturing certificate content.");
      return;
    }

    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF();

        pdf.addImage(imgData, "PNG", 0, 0, 210, 297); // Adjust dimensions if needed

        const xOffset = 15; // Adjust based on where you want the clickable area
        const yOffset = canvas.height / 2.83 + 80; // Adjust based on where you want the clickable area
        const boxWidth = 180; // Adjust as needed
        const boxHeight = 30; // Adjust as needed

        const link = `http://localhost:5223/api/verifyCertificate/${tokenId}`;
        pdf.link(xOffset, yOffset, boxWidth, boxHeight, { url: link });

        pdf.save("certificate.pdf");
      })
      .catch((error) => {
        alert(`Error generating PDF: ${error.message}`);
      });
};


  return (
<div className="certificate-container">
  {tokenId ? (
    <>
      <div id="certificate-content" style={{position: 'relative'}}>
        <h2>Certificate of Completion</h2>
        <p>This is to certify that</p>
        <p><strong>{formData.name}</strong></p>
        <p>has successfully completed the course</p>
        <p><strong>{formData.course}</strong></p>
        <p>on {formData.date}</p>
        <p>Issued by: {formData.issuer}</p>
        <div className="certificate-seal"></div>
      <button onClick={() => window.open(`http://localhost:5223/api/verifyCertificate/${tokenId}`, '_blank')}>Click Here to Verify</button>
      </div>
      <button onClick={downloadPDF}>Download as PDF</button>
    </>
  ) : (
    <>
      <h2>Mint a New Certificate</h2>
      {isLoading ? (
        <div className="loading"></div>
      ) : (
        <form onSubmit={handleSubmit}>
          {Object.keys(formData).map(key => (
            <div key={key} className="input-group">
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              {key === 'date' || key === 'validUntilDate' ? (
                <input type="date" name={key} onChange={handleChange} />
              ) : (
                <input name={key} value={formData[key]} onChange={handleChange} />
              )}
            </div>
          ))}
          <button type="submit">Mint</button>
        </form>
      )}
    </>
  )}
</div>


  );
}

export default MintForm;
