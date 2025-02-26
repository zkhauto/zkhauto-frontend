import { Search } from "lucide-react";

const CarListing = () => {
  return (
    <div className="bg-gray-900 p-8">
      {/* Title */}
      <h1 className="text-white text-4xl font-bold mb-8 text-center">
        Find your dream car with
      </h1>

      {/* Search Bar */}
      <div className="flex gap-2 mb-8 max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Search your dream car"
          className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none focus:border-blue-500"
        />
        <button className="bg-blue-500 hover:bg-blue-600 px-6 py-2 rounded-lg text-white flex items-center gap-2 transition-colors">
          <Search size={20} />
          Search
        </button>
      </div>

      {/* Filters Grid */}
      <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
        {/* Row 1 */}
        <select className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500">
          <option value="">Make</option>
        </select>
        <select className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500">
          <option value="">Model</option>
        </select>
        <select className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500">
          <option value="">Type</option>
        </select>
        {/* Row 2 */}
        <select className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500">
          <option value="">Steering</option>
        </select>
        <select className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500">
          <option value="">Min Year</option>
        </select>
        <select className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500">
          <option value="">Max Year</option>
        </select>
        {/* Row 3 */}
        <select className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-blue-500">
          <option value="">Stock ID</option>
        </select>
        <div className="col-span-2"></div> {/* Empty space for alignment */}
      </div>
    </div>
  );
};

export default CarListing;
