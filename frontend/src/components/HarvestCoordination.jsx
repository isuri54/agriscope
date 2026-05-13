import { Calendar, Trash2, Sparkles, CheckCircle, Pencil } from "lucide-react";
import Navbar from "../navbar/Navbar";
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function HarvestCoordination() {
  const [schedules, setSchedules] = useState([]);
  const [formData, setFormData] = useState({
    crop: '', district: '', plantingDate: '', harvestDate: '', area: '', expectedHarvest: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);

  // states for prediction
  const [predictedExcess, setPredictedExcess] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState('');
  const [recommendedProduction, setRecommendedProduction] = useState(null);
  const [forecastDetails, setForecastDetails] = useState(null);

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
      let res;

      if (editingId) {
        // UPDATE existing schedule
        res = await axios.put(
          `http://localhost:5000/api/harvest/schedules/${editingId}`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSchedules(
          schedules.map(s =>
            s._id === editingId ? res.data : s
          )
        );

        setEditingId(null);
        setSuccess('Schedule updated successfully!');
        setTimeout(() => setSuccess(''), 4000);
      } else {
        // ADD new schedule
        res = await axios.post(
          'http://localhost:5000/api/harvest/schedules',
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setSchedules([...schedules, res.data]);
        setSuccess('Planting schedule added successfully!');
        setTimeout(() => setSuccess(''), 4000);
      }

      setFormData({
        crop: '',
        district: '',
        plantingDate: '',
        harvestDate: '',
        area: '',
        expectedHarvest: ''
      });

    } catch (err) {
      setError('Operation failed');
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

  const handleEdit = (schedule) => {
    setFormData({
      crop: schedule.crop,
      district: schedule.district,
      plantingDate: schedule.plantingDate.split('T')[0],
      harvestDate: schedule.harvestDate.split('T')[0],
      area: schedule.area,
      expectedHarvest: schedule.expectedHarvest
    });

    setEditingId(schedule._id);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Real prediction from FastAPI
  const handleViewPredictions = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setPredictionError('Please login first');
      return;
    }

    setPredictionLoading(true);
    setPredictionError('');
    setPredictedExcess(null);
    setRecommendedProduction(null);

    // If the user has typed a yield in the form, use it. 
    // Otherwise, send an empty payload and let the backend use its averages.
    const productionValue = Number(formData.expectedYield);
    const payload = productionValue > 0 ? { production: productionValue } : {};

    try {
      const res = await axios.post(
        'http://localhost:8000/predict',
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const excess = res.data.predicted_excess;
      
      // Calculate recommendation based on what was actually used by the backend
      const usedProduction = res.data.forecast_context.production_used;
      const recommended = Number((usedProduction - excess).toFixed(2));

      setPredictedExcess(excess);
      setRecommendedProduction(recommended > 0 ? recommended : 0);
      
      // Store the context to show which season was predicted
      setForecastDetails(res.data.forecast_context); 

    } catch (err) {
      setPredictionError(err.response?.data?.detail || 'Failed to get prediction');
    } finally {
      setPredictionLoading(false);
    }
  };

  return (
    <div className="bg-green-50 min-h-screen p-8 space-y-10">
      <Navbar />

      {error && <p className="text-red-600 text-center font-medium">{error}</p>}
      {success && (
        <div className="flex items-center justify-center gap-2 text-green-600 font-medium bg-green-50 p-3 rounded-lg animate-fade-in">
          <CheckCircle size={20} />
          {success}
        </div>
      )}

      {/* View Predictions Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Future Forecasts</h2>
          <button
            onClick={handleViewPredictions}
            disabled={predictionLoading || loading}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50 transition"
          >
            <Sparkles size={16} />
            {predictionLoading ? 'Predicting...' : 'View Predictions'}
          </button>
        </div>

        {predictionError && <p className="text-red-600 text-sm">{predictionError}</p>}

        {predictedExcess !== null && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-xs font-bold uppercase tracking-wider mb-2">
              Forecast for {forecastDetails.season} {forecastDetails.year}
            </div>
            <p className="text-green-700 font-medium text-lg">
              Tomatoes will be oversupplied by <span className="text-2xl font-bold">{predictedExcess} tons</span>
            </p>
            <div className="mt-4 p-3 bg-white rounded-md border border-green-100 inline-block">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-green-700">Action Plan:</span> Aim for a total production of <strong>{recommendedProduction} tons</strong> to stabilize the market.
              </p>
            </div>
          </div>
        )}

        {predictedExcess === null && !predictionLoading && !predictionError && (
          <p className="text-sm text-gray-500 text-center">
            Click "View Predictions" to forecast excess harvest.
          </p>
        )}
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
          <Input label="Expected Harvest (tons)" name="expectedHarvest" type="number" value={formData.expectedHarvest} onChange={handleInputChange} />

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {editingId ? "Update Schedule" : "+ Add Schedule"}
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
                  <th className="py-2 text-left">Expected Harvest (tons)</th>
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
                    <td>{s.expectedHarvest}</td>
                    <td className="text-center flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(s)}
                      className="text-blue-500 hover:text-blue-600"
                    >
                      <Pencil size={16} />
                    </button>

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