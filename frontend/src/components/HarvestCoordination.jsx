import { Calendar, Trash2, Sprout, Truck, AlertTriangle, BarChart3, FileText } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';

export default function HarvestCoordination() {
  const schedules = [
    {
      crop: "Rice",
      district: "Kurunegala",
      plantingDate: "2025-03-15",
      harvestDate: "2025-07-15",
      area: 250,
      yield: 1250,
    },
    {
      crop: "Maize",
      district: "Anuradhapura",
      plantingDate: "2025-04-01",
      harvestDate: "2025-07-20",
      area: 180,
      yield: 720,
    },
  ];

  return (
    <div className="bg-green-50 min-h-screen p-8 space-y-10">
        <div className="flex items-center justify-between border-b pb-3 mb-6">
            {/* Logo*/}
            <div className="flex items-center gap-3">
                <img 
                    src="/agriscope.png"
                    alt="Agriscope Logo"
                    className="h-10 w-10 object-contain"
                />
                <span className="text-lg font-bold text-green-700">Agriscope</span>
            </div>

            {/* Navigation bar*/}
            <div className="flex items-center gap-8 text-sm font-medium">
                <NavItem icon={<Sprout size={16} />} label="Harvest Coordination" to="/harvest" active />
                <NavItem icon={<Truck size={16} />} label="Storage & Transport" to="/storage" />
                <NavItem icon={<Calendar size={16} />} label="Seasonal Calendar" to="/seasonalcalendar"/>
                <NavItem icon={<AlertTriangle size={16} />} label="Loss Reporting" />
                <NavItem icon={<BarChart3 size={16} />} label="Data Viewer" />
                <NavItem icon={<FileText size={16} />} label="Report Generation" />
            </div>
        </div>

      {/* Add planting schedule */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Calendar size={18} className="text-green-600" />
          Add Planting Schedule
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Crop Type" placeholder="e.g., Rice, Maize" />
          <Input label="District" placeholder="e.g., Colombo" />
          <Input label="Planting Date" type="date" />
          <Input label="Harvest Date" type="date" />
          <Input label="Area (hectares)" type="number" />
          <Input label="Expected Yield (tons)" type="number" />
        </div>

        <button className="mt-5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          + Add Schedule
        </button>
      </div>

      {/* Current planting schedules */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">
          Current Planting Schedules
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-gray-600">
              <tr>
                <th className="py-2 text-left">Crop</th>
                <th className="py-2 text-left">District</th>
                <th className="py-2 text-left">Planting Date</th>
                <th className="py-2 text-left">Harvest Date</th>
                <th className="py-2 text-left">Area (ha)</th>
                <th className="py-2 text-left">Expected Yield (tons)</th>
                <th className="py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {schedules.map((s, index) => (
                <tr key={index} className="border-b last:border-none">
                  <td className="py-3">{s.crop}</td>
                  <td>{s.district}</td>
                  <td>{s.plantingDate}</td>
                  <td>{s.harvestDate}</td>
                  <td>{s.area}</td>
                  <td>{s.yield}</td>
                  <td className="text-center">
                    <button className="text-red-500 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/*Reusable Components*/

function NavItem({ icon, label, to }) {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 cursor-pointer pb-2 transition-colors ${
        isActive
          ? "text-green-600 border-b-2 border-green-600"
          : "text-gray-600 hover:text-green-600"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function Input({ label, type = "text", placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}
