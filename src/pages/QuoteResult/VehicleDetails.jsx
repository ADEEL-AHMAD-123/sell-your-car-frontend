import React, { useState } from "react";
import { Car, Settings, FileText, Ruler, ChevronDown } from "lucide-react";

const VehicleDetails = ({ quote }) => {
  const [expandedSections, setExpandedSections] = useState({
    basic: true,
    technical: false,
    registration: false,
    dimensions: false,
  });  

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (!quote) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white p-4">
      <div className="max-w-6xl mx-auto">
        <div className="vehicle-info">
          <h3 className="text-3xl font-bold text-slate-800 text-center mb-8">
            Vehicle Details
          </h3>

          {/* ==================== Basic Information ==================== */}
          <div className="info-section mb-6 bg-white rounded-xl shadow-md border-2 border-slate-300 overflow-hidden">
            <div
              className="section-header bg-gradient-to-r from-blue-50 to-indigo-50 p-4 cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 border-b-2 border-slate-300"
              onClick={() => toggleSection("basic")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Car className="w-5 h-5 text-blue-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-700">
                    Basic Information
                  </h4>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${
                    expandedSections.basic ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
            {expandedSections.basic && (
              <div className="info-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-slate-50/80">
                <div className="info-item bg-amber-50 border-2 border-amber-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                  <div className="text-sm font-medium text-amber-700 mb-1">
                    Registration
                  </div>
                  <div className="text-lg font-bold text-amber-900">
                    {quote?.vehicleRegistration?.Vrm || "N/A"}
                  </div>
                </div>
                <div className="info-item bg-amber-50 border-2 border-amber-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                  <div className="text-sm font-medium text-amber-700 mb-1">
                    Make
                  </div>
                  <div className="text-lg font-bold text-amber-900">
                    {quote?.vehicleRegistration?.Make || "N/A"}
                  </div>
                </div>
                <div className="info-item bg-amber-50 border-2 border-amber-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                  <div className="text-sm font-medium text-amber-700 mb-1">
                    Model
                  </div>
                  <div className="text-lg font-bold text-amber-900">
                    {quote?.vehicleRegistration?.Model || "N/A"}
                  </div>
                </div>
                <div className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                  <div className="text-sm font-medium text-slate-600 mb-1">
                    Gross Weight
                  </div>
                  <div className="text-lg font-bold text-slate-800">
                    {quote?.vehicleRegistration?.GrossWeight ?? "N/A"} kg
                  </div>
                </div>
                <div className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                  <div className="text-sm font-medium text-slate-600 mb-1">
                    Max Permissible Mass
                  </div>
                  <div className="text-lg font-bold text-slate-800">
                    {quote?.vehicleRegistration?.MaxPermissibleMass ?? "N/A"}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ==================== Technical Specifications ==================== */}
          <div className="info-section mb-6 bg-white rounded-xl shadow-md border-2 border-slate-300 overflow-hidden">
            <div
              className="section-header bg-gradient-to-r from-orange-50 to-red-50 p-4 cursor-pointer hover:from-orange-100 hover:to-red-100 transition-all duration-300 border-b-2 border-slate-300"
              onClick={() => toggleSection("technical")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Settings className="w-5 h-5 text-orange-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-700">
                    Technical Specifications
                  </h4>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${
                    expandedSections.technical ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
            {expandedSections.technical && (
              <div className="info-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-orange-50/30">
                <div className="info-item bg-emerald-50 border-2 border-emerald-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                  <div className="text-sm font-medium text-emerald-700 mb-1">
                    Kerb Weight
                  </div>
                  <div className="text-lg font-bold text-emerald-900">
                    {quote?.otherVehicleData?.KerbWeight ?? "N/A"} kg
                  </div>
                </div>
                <div className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                  <div className="text-sm font-medium text-slate-600 mb-1">
                    Engine Capacity
                  </div>
                  <div className="text-lg font-bold text-slate-800">
                    {quote?.vehicleRegistration?.EngineCapacity ?? "N/A"} cc
                  </div>
                </div>
                <div className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                  <div className="text-sm font-medium text-slate-600 mb-1">
                    CO₂ Emissions
                  </div>
                  <div className="text-lg font-bold text-slate-800">
                    {quote?.vehicleRegistration?.Co2Emissions ?? "N/A"} g/km
                  </div>
                </div>
                <div className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                  <div className="text-sm font-medium text-slate-600 mb-1">
                    Euro Status
                  </div>
                  <div className="text-lg font-bold text-slate-800">
                    {quote?.otherVehicleData?.EuroStatus || "N/A"}
                  </div>
                </div>
                <div className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                  <div className="text-sm font-medium text-slate-600 mb-1">
                    Engine Number
                  </div>
                  <div className="text-lg font-bold text-slate-800">
                    {quote?.vehicleRegistration?.EngineNumber || "N/A"}
                  </div>
                </div>
                <div className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                  <div className="text-sm font-medium text-slate-600 mb-1">
                    Transmission
                  </div>
                  <div className="text-lg font-bold text-slate-800">
                    {quote?.vehicleRegistration?.Transmission || "N/A"}
                  </div>
                </div>
                <div className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                  <div className="text-sm font-medium text-slate-600 mb-1">
                    Transmission Type
                  </div>
                  <div className="text-lg font-bold text-slate-800">
                    {quote?.vehicleRegistration?.TransmissionType || "N/A"}
                  </div>
                </div>
                <div className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                  <div className="text-sm font-medium text-slate-600 mb-1">
                    Transmission Code
                  </div>
                  <div className="text-lg font-bold text-slate-800">
                    {quote?.vehicleRegistration?.TransmissionCode || "N/A"}
                  </div>
                </div>
                <div className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                  <div className="text-sm font-medium text-slate-600 mb-1">
                    Gear Count
                  </div>
                  <div className="text-lg font-bold text-slate-800">
                    {quote?.vehicleRegistration?.GearCount ?? "N/A"}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ==================== Registration & Legal ==================== */}
          <div className="info-section mb-6 bg-white rounded-xl shadow-md border-2 border-slate-300 overflow-hidden">
            <div
              className="section-header bg-gradient-to-r from-purple-50 to-pink-50 p-4 cursor-pointer hover:from-purple-100 hover:to-pink-100 transition-all duration-300 border-b-2 border-slate-300"
              onClick={() => toggleSection("registration")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-700">
                    Registration & Legal
                  </h4>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${
                    expandedSections.registration ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
            {expandedSections.registration && (
              <div className="info-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-purple-50/30">
                {[
                  {
                    label: "First Registered",
                    value: quote?.vehicleRegistration?.DateFirstRegistered
                      ? new Date(
                          quote.vehicleRegistration.DateFirstRegistered
                        ).toLocaleDateString()
                      : "N/A",
                  },
                  {
                    label: "First Registered UK",
                    value: quote?.vehicleRegistration?.DateFirstRegisteredUk
                      ? new Date(
                          quote.vehicleRegistration.DateFirstRegisteredUk
                        ).toLocaleDateString()
                      : "N/A",
                  },
                  { label: "VIN", value: quote?.vehicleRegistration?.Vin || "N/A", break: true },
                  { label: "VIN Last 5", value: quote?.vehicleRegistration?.VinLast5 || "N/A" },
                  { label: "Vehicle Class", value: quote?.vehicleRegistration?.VehicleClass || "N/A" },
                  {
                    label: "Exported",
                    value: quote?.vehicleRegistration?.Exported !== undefined
                      ? quote.vehicleRegistration.Exported
                        ? "Yes"
                        : "No"
                      : "N/A",
                  },
                  {
                    label: "Date Exported",
                    value: quote?.vehicleRegistration?.DateExported
                      ? new Date(
                          quote.vehicleRegistration.DateExported
                        ).toLocaleDateString()
                      : "N/A",
                  },
                  {
                    label: "Imported",
                    value: quote?.vehicleRegistration?.Imported !== undefined
                      ? quote.vehicleRegistration.Imported
                        ? "Yes"
                        : "No"
                      : "N/A",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                    <div className="text-sm font-medium text-slate-600 mb-1">
                      {item.label}
                    </div>
                    <div className={`text-lg font-bold text-slate-800 ${item.break ? "break-all" : ""}`}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ==================== Physical Specifications ==================== */}
          <div className="info-section mb-6 bg-white rounded-xl shadow-md border-2 border-slate-300 overflow-hidden">
            <div
              className="section-header bg-gradient-to-r from-green-50 to-teal-50 p-4 cursor-pointer hover:from-green-100 hover:to-teal-100 transition-all duration-300 border-b-2 border-slate-300"
              onClick={() => toggleSection("dimensions")}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Ruler className="w-5 h-5 text-green-600" />
                  </div>
                  <h4 className="text-lg font-semibold text-slate-700">
                    Physical Specifications
                  </h4>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${
                    expandedSections.dimensions ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>
            {expandedSections.dimensions && (
              <div className="info-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6 bg-green-50/30">
                {[
                  { label: "Body Style", value: quote?.otherVehicleData?.BodyStyle || "N/A" },
                  { label: "Number of Doors", value: quote?.otherVehicleData?.NumberOfDoors ?? "N/A" },
                  { label: "Door Plan", value: quote?.vehicleRegistration?.DoorPlan || "N/A" },
                  { label: "Door Plan Literal", value: quote?.vehicleRegistration?.DoorPlanLiteral || "N/A" },
                  { label: "Wheel Plan", value: quote?.vehicleRegistration?.WheelPlan || "N/A" },
                  { label: "Number of Axles", value: quote?.otherVehicleData?.NumberOfAxles ?? "N/A" },
                  { label: "Seating Capacity", value: quote?.vehicleRegistration?.SeatingCapacity ?? "N/A" },
                  { label: "Gross Weight", value: `${quote?.vehicleRegistration?.GrossWeight ?? "N/A"} kg` },
                  { label: "Max Permissible Mass", value: quote?.vehicleRegistration?.MaxPermissibleMass ?? "N/A" },
                ].map((item, idx) => (
                  <div key={idx} className="info-item bg-white border-2 border-slate-300 rounded-lg p-4 hover:shadow-lg transition-all duration-300">
                    <div className="text-sm font-medium text-slate-600 mb-1">
                      {item.label}
                    </div>
                    <div className="text-lg font-bold text-slate-800">
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetails;