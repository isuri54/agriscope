import { useState } from "react";
import { Calendar, Trash2, Sprout, Truck, AlertTriangle, BarChart3, FileText, Warehouse } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';

export default function StorageTransport() {
  const [facilities, setFacilities] = useState([
    {
      name: "Central Warehouse A",
      district: "Colombo",
      type: "Cold Storage",
      capacity: 5000,
      allocated: 3200,
    },
    {
      name: "Regional Hub B",
      district: "Kandy",
      type: "Dry Storage",
      capacity: 3000,
      allocated: 1800,
    },
  ]);

  const [vehicles, setVehicles] = useState([
    {
      id: "Truck-001",
      district: "Galle",
      capacity: 10,
      route: "Galle to Colombo",
    },
  ]);

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
                <NavItem icon={<Sprout size={16} />} label="Harvest Coordination" to="/harvest" />
                <NavItem icon={<Truck size={16} />} label="Storage & Transport" to="/storage" active />
                <NavItem icon={<Calendar size={16} />} label="Seasonal Calendar" to="/seasonalcalendar"/>
                <NavItem icon={<AlertTriangle size={16} />} label="Loss Reporting" />
                <NavItem icon={<BarChart3 size={16} />} label="Data Viewer" />
                <NavItem icon={<FileText size={16} />} label="Report Generation" />
            </div>
        </div>

      {/* Storage facilities */}
      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Warehouse size={18} className="text-green-600" />
          Storage Facilities
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <Input label="Warehouse Name" placeholder="e.g., Central Warehouse A" />
          <Input label="Location" placeholder="e.g., Colombo" />
          <select className="input">
            <option>Select type</option>
            <option>Cold Storage</option>
            <option>Dry Storage</option>
          </select>
          <Input label="Capacity" type="number" placeholder="Capacity (tons)" />
          <Input label="Allocated Extent" type="number" placeholder="Allocated (tons)" />
        </div>

        <button className="mt-5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">+ Add Storage Facility</button>
      </section>

      {/* STtorage table */}
      <section className="bg-white rounded-xl shadow p-6">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-600">
            <tr className="border-b">
              <th className="th">Facility</th>
              <th className="th">District</th>
              <th className="th">Type</th>
              <th className="th">Capacity</th>
              <th className="th">Allocated</th>
              <th className="th">Available</th>
              <th className="th">Utilization</th>
              <th className="th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {facilities.map((f, i) => {
              const available = f.capacity - f.allocated;
              const percent = Math.round((f.allocated / f.capacity) * 100);
              return (
                <tr key={i} className="border-b">
                  <td className="td">{f.name}</td>
                  <td className="td">{f.district}</td>
                  <td className="td">{f.type}</td>
                  <td className="td">{f.capacity} tons</td>
                  <td className="td">{f.allocated} tons</td>
                  <td className="td">{available} tons</td>
                  <td className="td">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-green-100 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      {percent}%
                    </div>
                  </td>
                  <td className="td text-red-500 cursor-pointer">
                    <Trash2 size={16} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* Transport vehicles */}
      <section className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Truck size={18} className="text-green-600" />
            Transport Vehicles
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Input label="Vehicle ID" placeholder="e.g., Truck-001" />
          <Input label="District Name" placeholder="e.g., Colombo" />
          <Input label="Capacity" type="number" placeholder="Capacity (tons)" />
          <Input label="Route" placeholder="From - To" />
        </div>

        <button className="mt-5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">+ Add Transport Vehicle</button>
      </section>

      {/* Vehicle table */}
      <section className="bg-white rounded-xl shadow p-6">
        <table className="w-full text-sm">
          <thead className="border-b text-gray-600">
            <tr className="border-b">
              <th className="th">Vehicle ID</th>
              <th className="th">District</th>
              <th className="th">Capacity</th>
              <th className="th">Route</th>
              <th className="th">Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v, i) => (
              <tr key={i} className="border-b">
                <td className="td">{v.id}</td>
                <td className="td">{v.district}</td>
                <td className="td">{v.capacity} tons</td>
                <td className="td">{v.route}</td>
                <td className="td text-red-500 cursor-pointer">
                  <Trash2 size={16} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

    </div>
  );
}

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