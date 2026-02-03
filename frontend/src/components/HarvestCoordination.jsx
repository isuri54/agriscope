import { Calendar, Trash2, Sprout, Truck, AlertTriangle, BarChart3, FileText, Sparkles, CheckCircle } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function HarvestCoordination() {
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    crop: '', district: '', plantingDate: '', harvestDate: '', area: '', expectedYield: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const location = useLocation();

  // Fetch schedules on mount
  useEffect(() => {
    const fetchSchedules = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        return;
      }

      try {
        const res = await axios.get('http://localhost:5000/api/harvest/schedules', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSchedules(res.data);
      } catch (err) {
        setError('Failed to load schedules');
      }
    };

    fetchSchedules();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSchedule = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    try {
      const res = await axios.post('http://localhost:5000/api/harvest/schedules', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchedules([...schedules, res.data]);
      setSuccess('Planting schedule added successfully!');
      setFormData({ crop: '', district: '', plantingDate: '', harvestDate: '', area: '', expectedYield: '' });
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError('Failed to add schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this schedule?')) return;

    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/harvest/schedules/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSchedules(schedules.filter(s => s._id !== id));
    } catch (err) {
      setError('Failed to delete');
    }
  };

  return (
    <div className="bg-green-50 min-h-screen p-8 space-y-10">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center">
          <img src="/agri.png" alt="Agriscope Logo" className="h-20 w-20 object-contain" />
          <span className="text-lg font-bold text-green-700 ml-2">Agriscope</span>
        </div>

        <div className="flex items-center gap-8 text-sm font-medium">
          <NavItem icon={<Sprout size={16} />} label="Harvest Coordination" to="/harvest" active={location.pathname === '/harvest'} />
          <NavItem icon={<Truck size={16} />} label="Storage & Transport" to="/storage" />
          <NavItem icon={<Calendar size={16} />} label="Seasonal Calendar" to="/seasonalcalendar" />
          <NavItem icon={<AlertTriangle size={16} />} label="Loss Reporting" to="/lossreporting" />
          <NavItem icon={<BarChart3 size={16} />} label="Data Viewer" to="/dataviewer" />
          <NavItem icon={<FileText size={16} />} label="Report Generation" to="/reports" />
        </div>
      </div>

      {error && <p className="text-red-600 text-center font-medium">{error}</p>}
      {success && (
        <div className="flex items-center justify-center gap-2 text-green-600 font-medium bg-green-50 p-3 rounded-lg animate-fade-in">
          <CheckCircle size={20} />
          {success}
        </div>
      )}

      {/*View predictions */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Future Forecasts</h2>
        <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2">
          <Sparkles size={16} />
          View Predictions
        </button>
      </div>

      {/* Add Planting Schedule Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Calendar size={18} className="text-green-600" />
          Add Planting Schedule
        </h2>

        <form onSubmit={handleAddSchedule} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input label="Crop Type" name="crop" value={formData.crop} onChange={handleInputChange} placeholder="e.g., Rice, Maize" />
          <Input label="District" name="district" value={formData.district} onChange={handleInputChange} placeholder="e.g., Colombo" />
          <Input label="Planting Date" name="plantingDate" type="date" value={formData.plantingDate} onChange={handleInputChange} />
          <Input label="Harvest Date" name="harvestDate" type="date" value={formData.harvestDate} onChange={handleInputChange} />
          <Input label="Area (hectares)" name="area" type="number" value={formData.area} onChange={handleInputChange} />
          <Input label="Expected Yield (tons)" name="expectedYield" type="number" value={formData.expectedYield} onChange={handleInputChange} />

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              + Add Schedule
            </button>
          </div>
        </form>
      </div>

      {/* Current Planting Schedules Table */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Current Planting Schedules</h2>

        {schedules.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No schedules added yet.</p>
        ) : (
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
                {schedules.map((s) => (
                  <tr key={s._id} className="border-b last:border-none hover:bg-gray-50">
                    <td className="py-3">{s.crop}</td>
                    <td>{s.district}</td>
                    <td>{new Date(s.plantingDate).toLocaleDateString()}</td>
                    <td>{new Date(s.harvestDate).toLocaleDateString()}</td>
                    <td>{s.area}</td>
                    <td>{s.expectedYield}</td>
                    <td className="text-center">
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// Reusable NavItem and Input (unchanged)
function NavItem({ icon, label, to, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 cursor-pointer pb-2 transition-colors ${
        active ? "text-green-600 border-b-2 border-green-600" : "text-gray-600 hover:text-green-600"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function Input({ label, name, type = "text", value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}