import { CalendarDays, Trash2, Sprout, Truck, Calendar, AlertTriangle, BarChart3, FileText } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';

export default function SeasonalCalendar() {
  const events = [
    {
      id: 1,
      date: "2025-04-15",
      type: "Weather",
      impact: "High Impact",
      title: "Heavy monsoon expected",
      district: "Ratnapura",
      description: "Heavy rainfall expected causing possible floods and crop damage.",
    },
  ];

  return (
    <div className="bg-green-50 min-h-screen p-8 space-y-10">
      {/* Navbar */}
      <div className="flex items-center justify-between border-b pb-3 mb-6">
        {/* Logo */}
        <Link to="/harvest" className="flex items-center gap-3">
          <img 
            src="/agri.png"
            alt="Agriscope Logo"
            className="h-20 w-20 object-contain"
          />
          <span className="text-lg font-bold text-green-700">Agriscope</span>
        </Link>

        {/* Navigation bar */}
        <div className="flex items-center gap-8 text-sm font-medium">
          <NavItem icon={<Sprout size={16} />} label="Harvest Coordination" to="/harvest" />
          <NavItem icon={<Truck size={16} />} label="Storage & Transport" to="/storage" />
          <NavItem icon={<Calendar size={16} />} label="Seasonal Calendar" to="/seasonalcalendar" active />
          <NavItem icon={<AlertTriangle size={16} />} label="Loss Reporting" to="/lossreporting" />
          <NavItem icon={<BarChart3 size={16} />} label="Data Viewer" to="/dataviewer" />
          <NavItem icon={<FileText size={16} />} label="Report Generation" to="/report-generation" />
        </div>
      </div>

      {/* Log Seasonal Event */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <CalendarDays size={18} className="text-green-600" />
          Log Seasonal Event
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Date" type="date" />
          <Select label="Event Type" options={["Weather", "Pest", "Disease", "Other"]}/>
          <Input label="District" placeholder="Affected district" />
          <Input label="Impact Level" as="select">
            <option>Select impact</option>
            <option>Low Impact</option>
            <option>Medium Impact</option>
            <option>High Impact</option>
          </Input>
          <div className="md:col-span-2">
            <Input label="Description" as="textarea" rows={4} placeholder="Event details..." />
          </div>
        </div>

        <button className="mt-5 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          + Add Event
        </button>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">
          Upcoming Events
        </h2>

        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border rounded-lg p-4 flex justify-between items-start"
            >
              <div>
                <div className="flex items-center gap-3 text-sm mb-2">
                  <span className="text-gray-500">{event.date}</span>
                  <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs">
                    {event.type}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    event.impact === "High Impact" ? "bg-red-100 text-red-600" : 
                    event.impact === "Medium Impact" ? "bg-yellow-100 text-yellow-700" : 
                    "bg-gray-100 text-gray-700"
                  }`}>
                    {event.impact}
                  </span>
                </div>

                <h3 className="font-semibold">{event.title}</h3>
                <p className="text-sm text-gray-600">District: {event.district}</p>
                <p className="text-sm text-gray-500 mt-1">{event.description}</p>
              </div>

              <button className="text-red-500 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, to, active }) {
  const location = useLocation();
  const isActive = active || location.pathname === to;

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