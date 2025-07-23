import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./QuoteResult.scss";

const QuoteResult = () => {
  const { quote } = useSelector((state) => state.quote);

  if (!quote) {
    return (
      <div className="quote-result no-data">
        <p>No quote data found. Please go back and enter your details again.</p>
        <Link to="/" className="back-link">← Go Back</Link>
      </div>
    );
  }

  return (
    <section className="quote-result">
      <div className="valuation-summary">
        <h2>Your Vehicle Valuation</h2>
        <div className="summary-box">
          <div>
            <span>Registration</span>
            <strong>{quote.registrationNumber || "N/A"}</strong>
          </div>
          <div>
            <span>Revenue Weight</span>
            <strong>{quote.revenueWeight ?? "N/A"} kg</strong>
          </div>
          <div>
            <span>Estimated Price</span>
            <strong className="price">£{quote.estimatedScrapPrice ?? "N/A"}</strong>
          </div>
        </div>
      </div>

      <div className="vehicle-info">
        <h3>Vehicle Details</h3>
        <ul className="info-grid">
          <li><span>Make:</span> {quote.make || "N/A"}</li>
          <li><span>Model:</span> {quote.model || "N/A"}</li>
          <li><span>Fuel Type:</span> {quote.fuelType || "N/A"}</li>
          <li><span>CO₂ Emissions:</span> {quote.co2Emissions ?? "N/A"} g/km</li>
          <li><span>Colour:</span> {quote.colour || "N/A"}</li>
          <li><span>Year:</span> {quote.yearOfManufacture || "N/A"}</li>
          <li><span>Engine Capacity:</span> {quote.engineCapacity ?? "N/A"} cc</li>
          <li><span>Tax Status:</span> {quote.taxStatus || "N/A"}</li>
          <li><span>MOT Status:</span> {quote.motStatus || "N/A"}</li>
          <li><span>Euro Status:</span> {quote.euroStatus || "N/A"}</li>
          <li><span>RDE:</span> {quote.realDrivingEmissions || "N/A"}</li>
          <li><span>Wheel Plan:</span> {quote.wheelplan || "N/A"}</li>
        </ul>
      </div>

      <Link to="/" className="back-link">← Back to Home</Link>
    </section>
  );
};

export default QuoteResult;
