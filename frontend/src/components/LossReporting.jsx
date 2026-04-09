import { AlertTriangle, Trash2, Pencil, CheckCircle } from "lucide-react";
import Navbar from "../navbar/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";

export default function LossReporting() {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({ totalReports: 0, totalQuantity: 0, mostCommonCause: "None" });
  const [form, setForm] = useState({
    date: "",
    district: "",
    crop: "",
    type: "",
    cause: "",
    quantityLost: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingId, setEditingId] = useState(null); // Track report being edited

  // Fetch reports and stats on mount
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        return;
      }

      try {
        const [reportsRes, statsRes] = await Promise.all([
          axios.get("http://localhost:5000/api/loss/reports", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/loss/stats", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setReports(reportsRes.data);
        setStats(statsRes.data);
      } catch (err) {
        setError("Failed to load data");
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmitReport = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const token = localStorage.getItem("token");
    try {
      let res;
      if (editingId) {
        // UPDATE existing report
        res = await axios.put(
          `http://localhost:5000/api/loss/reports/${editingId}`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setReports(reports.map(r => r._id === editingId ? res.data : r));
        setSuccess("Loss report updated successfully!");
      } else {
        // ADD new report
        res = await axios.post("http://localhost:5000/api/loss/reports", form, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setReports([...reports, res.data]);
        setSuccess("Loss report submitted successfully!");
      }

      // Reset form
      setForm({
        date: "",
        district: "",
        crop: "",
        type: "",
        cause: "",
        quantityLost: "",
        description: "",
      });
      setEditingId(null);

      // Refresh stats
      const statsRes = await axios.get("http://localhost:5000/api/loss/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(statsRes.data);

      setTimeout(() => setSuccess(""), 4000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit report");
    } finally {
      setLoading(false);
    }
  };

  const handleEditReport = (report) => {
    setForm({
      date: report.date.split('T')[0], // Format for date input
      district: report.district,
      crop: report.crop,
      type: report.type,
      cause: report.cause,
      quantityLost: report.quantityLost,
      description: report.description || "",
    });
    setEditingId(report._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDeleteReport = async (id) => {
    if (!window.confirm("Delete this report?")) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/api/loss/reports/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(reports.filter((r) => r._id !== id));
      setSuccess("Report deleted successfully!");
      setTimeout(() => setSuccess(""), 4000);

      // Refresh stats
      const statsRes = await axios.get("http://localhost:5000/api/loss/stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(statsRes.data);
    } catch (err) {
      setError("Failed to delete report");
    }
  };

  return (
    <div className="bg-green-50 min-h-screen p-8 space-y-10">
      <Navbar />

      {/* Messages */}
      {error && <p className="text-red-600 text-center font-medium bg-red-50 p-3 rounded-lg">{error}</p>}
      {success && (
        <div className="flex items-center justify-center gap-2 text-green-600 font-medium bg-green-50 p-3 rounded-lg animate-fade-in">
          <CheckCircle size={20} />
          {success}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Loss Reports" value={stats.totalReports} />
        <StatCard title="Total Quantity Lost" value={`${stats.totalQuantity} tons`} />
        <StatCard title="Most Common Cause" value={stats.mostCommonCause} />
      </div>

      {/* Report New Loss Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <AlertTriangle size={18} className="text-green-600" />
          {editingId ? "Edit Loss Report" : "Report New Loss"}
        </h2>

        <form onSubmit={handleSubmitReport} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input label="Date of Loss" name="date" type="date" value={form.date} onChange={handleInputChange} />
          <Input label="District" name="district" value={form.district} onChange={handleInputChange} placeholder="Affected district" />
          <Input label="Crop Type" name="crop" value={form.crop} onChange={handleInputChange} placeholder="e.g., Rice, Maize" />
          <Select label="Loss Type" name="type" value={form.type} onChange={handleInputChange} options={["Weather", "Pest", "Excess", "Disease", "Other"]} />
          <Input label="Quantity Lost (tons)" name="quantityLost" type="number" value={form.quantityLost} onChange={handleInputChange} />
          <Input label="Specific Cause" name="cause" value={form.cause} onChange={handleInputChange} placeholder="e.g., Flood, Drought" />

          <div className="md:col-span-2">
            <Textarea label="Description" name="description" value={form.description} onChange={handleInputChange} placeholder="Additional details..." />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="mt-4 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {editingId ? "Update Report" : "+ Submit Report"}
            </button>
          </div>
        </form>
      </div>

      {/* Loss Reports History */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-4">Loss Reports History</h2>

        {reports.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No loss reports submitted yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-gray-600">
                <tr>
                  <th className="py-2 text-left">Date</th>
                  <th className="py-2 text-left">District</th>
                  <th className="py-2 text-left">Crop</th>
                  <th className="py-2 text-left">Type</th>
                  <th className="py-2 text-left">Cause</th>
                  <th className="py-2 text-left">Quantity (tons)</th>
                  <th className="py-2 text-left">Description</th>
                  <th className="py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((r) => (
                  <tr key={r._id} className="border-b last:border-none hover:bg-gray-50">
                    <td className="py-3">{new Date(r.date).toLocaleDateString()}</td>
                    <td>{r.district}</td>
                    <td>{r.crop}</td>
                    <td>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs">
                        {r.type}
                      </span>
                    </td>
                    <td>{r.cause}</td>
                    <td>{r.quantityLost} tons</td>
                    <td className="truncate max-w-xs">{r.description || '-'}</td>
                    <td className="text-center flex justify-center gap-3">
                      <button
                        onClick={() => handleEditReport(r)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteReport(r._id)}
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

function Textarea({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
}

function Select({ label, name, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="">Select type</option>
        {options.map(opt => (
          <option key={opt} value={opt}>{opt}</option>
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