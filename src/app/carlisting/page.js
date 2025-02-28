"use client";
import { Search } from "lucide-react";
import Navbar from "../ui/Navbar";
import { useState } from "react";

const CarListing = () => {
  const [search, setSearch] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [type, setType] = useState("");
  const [steering, setSteering] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");
  const [stockId, setStockId] = useState("");

  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(search, make, model, type, steering, minYear, maxYear, stockId);
  };

  const handleClear = () => {
    setSearch("");
    setMake("");
    setModel("");
    setType("");
    setSteering("");
  };

  const demodata = [
    {
      id: 1,
      make: "Toyota",
      model: "Camry",
      type: "Sedan",
      steering: "Left",
      year: 2020,
      stockId: "1234567890",
    },
    {
      id: 2,
      make: "Toyota",
      model: "Camry",
      type: "Sedan",
      steering: "Left",
      year: 2020,
      stockId: "1234567890",
    },
    {
      id: 3,
      make: "Toyota",
      model: "Camry",
      type: "Sedan",
      steering: "Left",
      year: 2020,
      stockId: "1234567890",
    },
    {
      id: 4,
      make: "Toyota",
      model: "Camry",
      type: "Sedan",
      steering: "Left",
      year: 2020,
      stockId: "1234567890",
    },
    {
      id: 5,
      make: "Toyota",
      model: "Camry",
      type: "Sedan",
      steering: "Left",
      year: 2020,
      stockId: "1234567890",
    },
    {
      id: 6,
      make: "Toyota",
      model: "Camry",
      type: "Sedan",
      steering: "Left",
      year: 2020,
      stockId: "1234567890",
    },
  ];
  return (
    <div>
      <Navbar />
      <div className="bg-gray-900 p-8">
        {/* Title */}
        <h1 className="text-white text-4xl font-bold mb-8 text-center">
          Find your dream car with
        </h1>

        {/* Search Bar */}
        <div className="flex gap-2 mb-8 max-w-4xl mx-auto">
          <input
            value={search}
            onChange={(e) => handleInputChange(e, setSearch)}
            type="text"
            placeholder="Search your dream car"
            className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleSubmit}
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg text-white flex items-center gap-2 transition-colors"
          >
            <Search size={20} />
            Search
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          {/* Row 1 */}
          <select
            value={make}
            onChange={(e) => handleInputChange(e, setMake)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option value="">Make</option>
            <option value="toyota">Toyota</option>
            <option value="honda">Honda</option>
            {/* Add more makes as needed */}
          </select>
          <select
            value={model}
            onChange={(e) => handleInputChange(e, setModel)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option value="">Model</option>
            <option value="camry">Camry</option>
            <option value="civic">Civic</option>
            {/* Add more models as needed */}
          </select>
          <select
            value={type}
            onChange={(e) => handleInputChange(e, setType)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option value="">Type</option>
            <option value="sedan">Sedan</option>
            <option value="suv">SUV</option>
            {/* Add more types as needed */}
          </select>
          {/* Row 2 */}
          <select
            value={steering}
            onChange={(e) => handleInputChange(e, setSteering)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option value="">Steering</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
          <select
            value={minYear}
            onChange={(e) => handleInputChange(e, setMinYear)}
            className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500"
          >
            <option value="">Min Year</option>
            {Array.from({ length: 24 }, (_, i) => 2000 + i).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <div className="col-span-2"></div>
        </div>
        {/* Car Listing */}
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto text-white">
          {demodata.map((car) => (
            <div key={car.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-2">{car.make}</h2>
              <p className="text-gray-400">{car.model}</p>
              <p className="text-gray-400">{car.type}</p>
              <p className="text-gray-400">{car.steering}</p>
              <p className="text-gray-400">{car.year}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarListing;
