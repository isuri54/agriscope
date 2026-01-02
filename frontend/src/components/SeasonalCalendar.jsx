import { useState } from "react";
import { CalendarDays, Trash2, Sprout, Truck, Calendar, AlertTriangle, BarChart3, FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function SeasonalCalendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);

  const [form, setForm] = useState({
    type: "",
    district: "",
    description: "",
  });

  const today = new Date();
  const next30Days = new Date();
  next30Days.setDate(today.getDate() + 30);

  const upcomingEvents = events.filter(
    (e) => new Date(e.date) >= today && new Date(e.date) <= next30Days
  );

  const addEvent = () => {
    if (!form.type || !form.district) return;

    setEvents([
      ...events,
      {
        id: Date.now(),
        date: selectedDate.toISOString().split("T")[0],
        ...form,
      },
    ]);

    setForm({ type: "", district: "", description: "" });
    setSelectedDate(null);
  };

  return (
    <div className="bg-green-50 min-h-screen p-8 space-y-10">
      <div className="flex items-center justify-between border-b">
        {/* Logo */}
        <div className="flex items-center">
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
          <NavItem icon={<Calendar size={16} />} label="Seasonal Calendar" to="/seasonalcalendar" active />
          <NavItem icon={<AlertTriangle size={16} />} label="Loss Reporting" to="/lossreporting" />
          <NavItem icon={<BarChart3 size={16} />} label="Data Viewer" to="/dataviewer" />
          <NavItem icon={<FileText size={16} />} label="Report Generation" to="/report-generation" />
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-white rounded-xl shadow-sm p-6 grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <CalendarDays size={18} className="text-green-600" />
            Seasonal Calendar
          </h2>

          <ReactCalendar
            onClickDay={(date) => setSelectedDate(date)}
            className="rounded-lg border p-2"
          />
        </div>

        {/* Event form */}
        {selectedDate && (
          <div>
            <h3 className="font-semibold mb-3">
              Add Event – {selectedDate.toDateString()}
            </h3>

            <div className="space-y-3">
              <Select
                label="Event Type"
                options={["Festival", "Weather", "Government Program", "Other"]}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              />

              <Input
                label="District"
                placeholder="e.g. Ratnapura"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
              />

              <Textarea
                label="Description"
                placeholder="Event details..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <button
                onClick={addEvent}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                + Add Event
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upcoming events */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">
          Upcoming Events (Next 30 Days)
        </h2>

        {upcomingEvents.length === 0 && (
          <p className="text-sm text-gray-500">No upcoming events</p>
        )}

        <div className="space-y-4">
          {upcomingEvents.map((event) => (
            <div key={event.id} className="border rounded-lg p-4 flex justify-between">
              <div>
                <p className="text-sm text-gray-500">{event.date}</p>
                <h3 className="font-semibold">{event.type}</h3>
                <p className="text-sm">District: {event.district}</p>
                <p className="text-sm text-gray-500">{event.description}</p>
              </div>

              <button
                onClick={() => setEvents(events.filter(e => e.id !== event.id))}
                className="text-red-500 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function NavItem({ icon, label, to }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 pb-2 ${
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

function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        {...props}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}

function Textarea({ label, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea
        {...props}
        rows={3}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}

function Select({ label, options, ...props }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        {...props}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
      >
        <option value="">Select type</option>
        {options.map(opt => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}
