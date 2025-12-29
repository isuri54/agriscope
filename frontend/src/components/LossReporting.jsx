import { AlertTriangle, Trash2, Sprout, Truck, Calendar, BarChart3, FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function LossReporting() {
  const reports = [
    {
      date: "2025-03-20",
      district: "Ampara",
      crop: "Paddy",
      type: "Weather",
      cause: "Flood",
      quantity: "150 tons",
      description: "Heavy rainfall caused flooding in low-lying areas",
    },
    {
      date: "2025-04-05",
      district: "Badulla",
      crop: "Vegetables",
      type: "Pest",
      cause: "Pest Infestation",
      quantity: "80 tons",
      description: "Aphid outbreak affected vegetable crops",
    },
  ];

  return (
    <div className="bg-green-50 min-h-screen p-8 space-y-10">
      <div className="flex items-center justify-between border-b pb-3 mb-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <img
            src="/agri.png"
            alt="Agriscope Logo"
            className="h-20 w-20 object-contain"
          />
          <span className="text-lg font-bold text-green-700">Agriscope</span>
        </div>

        {/* Navigation bar */}
        <div className="flex items-center gap-8 text-sm font-medium">
          <NavItem icon={<Sprout size={16} />} label="Harvest Coordination" to="/harvest" />
          <NavItem icon={<Truck size={16} />} label="Storage & Transport" to="/storage" />
          <NavItem icon={<Calendar size={16} />} label="Seasonal Calendar" to="/seasonalcalendar" />
          <NavItem icon={<AlertTriangle size={16} />} label="Loss Reporting" to="/lossreporting" active/>
          <NavItem icon={<BarChart3 size={16} />} label="Data Viewer" to="/dataviewer" />
          <NavItem icon={<FileText size={16} />} label="Report Generation" to="/reports" />
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Loss Reports" value="2" />
        <StatCard title="Total Quantity Lost" value="230 tons" />
        <StatCard title="Most Common Cause" value="Weather" />
      </div>

      {/* Report new loss */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <AlertTriangle size={18} className="text-green-600" />
          Report New Loss
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Date of Loss" type="date" />
          <Input label="District" placeholder="Affected district" />
          <Input label="Crop Type" placeholder="e.g., Rice, Maize" />
          <Select label="Loss Type" options={["Weather", "Pest", "Excess", "Disease", "Other"]} />
          <Input label="Quantity Lost (tons)" type="number" />
          <Input label="Specific Cause" placeholder="e.g., Flood, Drought" />
        </div>

        <Textarea label="Description" placeholder="Additional details..." />

        <button className="mt-5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          + Submit Report
        </button>
      </div>

      {/* History */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Loss Reports History</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b text-gray-600">
              <tr>
                <th className="py-2 text-left">Date</th>
                <th className="py-2 text-left">District</th>
                <th className="py-2 text-left">Crop</th>
                <th className="py-2 text-left">Type</th>
                <th className="py-2 text-left">Cause</th>
                <th className="py-2 text-left">Quantity</th>
                <th className="py-2 text-left">Description</th>
                <th className="py-2 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r, index) => (
                <tr key={index} className="border-b last:border-none">
                  <td className="py-3">{r.date}</td>
                  <td>{r.district}</td>
                  <td>{r.crop}</td>
                  <td>
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs">
                      {r.type}
                    </span>
                  </td>
                  <td>{r.cause}</td>
                  <td>{r.quantity}</td>
                  <td className="truncate max-w-xs">{r.description}</td>
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


function NavItem({ icon, label, to }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 pb-2 transition-colors ${
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

function Textarea({ label, placeholder }) {
  return (
    <div className="mt-4">
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea
        rows={4}
        placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}

function Select({ label, options }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500">
        <option>Select type</option>
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-xl font-semibold text-gray-800">{value}</p>
      </div>
      <AlertTriangle className="text-green-200" size={32} />
    </div>
  );
}
