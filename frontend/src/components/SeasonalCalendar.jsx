import { CalendarDays, Trash2, Sprout, Truck, Calendar, AlertTriangle, BarChart3, FileText, CheckCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import ReactCalendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function SeasonalCalendar() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ type: "", district: "", description: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const location = useLocation();

  // Fetch events on mount
  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/calendar/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(res.data);
      } catch (err) {
        setError("Failed to load events");
      }
    };

    fetchEvents();
  }, []);

  const addEvent = async () => {
    if (!selectedDate || !form.type || !form.district) {
      setError("Please select date, event type, and district");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        "http://localhost:5000/api/calendar/events",
        {
          date: selectedDate.toISOString(),
          type: form.type,
          district: form.district,
          description: form.description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEvents([...events, res.data]);
      setSuccess("Event added successfully!");
      setForm({ type: "", district: "", description: "" });
      setSelectedDate(null);

      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError("Failed to add event");
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Delete this event?")) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/calendar/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(events.filter((e) => e._id !== id));
      setSuccess("Event deleted successfully!");
      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError("Failed to delete event");
    }
  };

  const today = new Date();
  const next30Days = new Date();
  next30Days.setDate(today.getDate() + 30);

  const upcomingEvents = events.filter((e) => {
    const eventDate = new Date(e.date);
    return eventDate >= today && eventDate <= next30Days;
  });

  return (
    <div className="bg-green-50 min-h-screen p-8 space-y-10">
      {/* Header & Navigation */}
      <div className="flex items-center justify-between border-b pb-4 px-8 pt-6 bg-white">
        <div className="flex items-center">
          <Link to="/home">
            <img src="/logo.png" alt="Agriscope Logo" className="h-30 w-60 object-contain" />
          </Link>
        </div>

        <div className="flex items-center gap-8 text-sm font-medium">
          <NavItem icon={<Sprout size={16} />} label="Harvest Coordination" to="/harvest" />
          <NavItem icon={<Truck size={16} />} label="Storage & Transport" to="/storage" />
          <NavItem icon={<Calendar size={16} />} label="Seasonal Calendar" to="/seasonalcalendar" active />
          <NavItem icon={<AlertTriangle size={16} />} label="Loss Reporting" to="/lossreporting" />
          <NavItem icon={<BarChart3 size={16} />} label="Data Viewer" to="/dataviewer" />
          <NavItem icon={<FileText size={16} />} label="Report Generation" to="/reports" />
        </div>
      </div>

      {/* Messages */}
      {error && <p className="text-red-600 text-center font-medium bg-red-50 p-3 rounded-lg">{error}</p>}
      {success && (
        <div className="flex items-center justify-center gap-2 text-green-600 font-medium bg-green-50 p-3 rounded-lg animate-fade-in">
          <CheckCircle size={20} />
          {success}
        </div>
      )}

      {/* Calendar + Form */}
      <div className="bg-white rounded-xl shadow-sm p-6 grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <CalendarDays size={18} className="text-green-600" />
            Seasonal Calendar
          </h2>
          <ReactCalendar
            onClickDay={(date) => setSelectedDate(date)}
            className="rounded-lg border p-2"
            tileContent={({ date }) => {
              const hasEvent = events.some(
                (e) => new Date(e.date).toDateString() === date.toDateString()
              );
              return hasEvent ? <div className="w-2 h-2 bg-green-500 rounded-full mx-auto mt-1"></div> : null;
            }}
          />
        </div>

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
                disabled={loading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {loading ? "Adding..." : "+ Add Event"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">
          Upcoming Events (Next 30 Days)
        </h2>

        {upcomingEvents.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No upcoming events</p>
        ) : (
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event._id} className="border rounded-lg p-4 flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">
                    {new Date(event.date).toLocaleDateString()}
                  </p>
                  <h3 className="font-semibold">{event.type}</h3>
                  <p className="text-sm">District: {event.district}</p>
                  {event.description && <p className="text-sm text-gray-600 mt-1">{event.description}</p>}
                </div>

                <button
                  onClick={() => deleteEvent(event._id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* Reusable Components (unchanged) */
function NavItem({ icon, label, to, active }) {
  const location = useLocation();
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 pb-2 transition-colors ${
        active ? "text-green-600 border-b-2 border-green-600" : "text-gray-600 hover:text-green-600"
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

function Select({ label, options, value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-green-500"
      >
        <option value="">Select type</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}