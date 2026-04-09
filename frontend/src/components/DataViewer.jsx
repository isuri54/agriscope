import Navbar from "../navbar/Navbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

export default function DataViewer() {
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTrends = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/loss/trends", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTrends(res.data);
      } catch (err) {
        setError("Failed to load loss trends");
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);


  return (
    <div className="bg-green-50 min-h-screen p-8 space-y-10">
      <Navbar />
      

      {/* Loss Trends Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">
          Loss Trends by Cause (Monthly)
        </h2>

        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading trends...</p>
        ) : error ? (
          <p className="text-center text-red-600 py-10">{error}</p>
        ) : trends.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No loss data available yet. Add reports to see trends.</p>
        ) : (
          <div className="h-[520px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends} margin={{ top: 20, right: 30, left: 50, bottom: 60 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e0e0e0" />

                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  label={{ value: "Month", position: "insideBottom", offset: -15 }}
                />

                <YAxis 
                  tickFormatter={(value) => `${value / 1000}k`}
                  label={{ value: "Tons Lost", angle: -90, position: "insideLeft" }}
                  tick={{ fontSize: 12 }}
                  domain={[0, 'dataMax + 2000']}
                />

                <Tooltip 
                  formatter={(value) => [`${Number(value).toLocaleString()} tons`, '']}
                  contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #d1d5db' }}
                />

                <Legend verticalAlign="top" height={50} />

                <Line type="monotone" dataKey="Weather" stroke="#ef4444" strokeWidth={4} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Pest" stroke="#f59e0b" strokeWidth={4} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Disease" stroke="#8b5cf6" strokeWidth={4} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Excess" stroke="#10b981" strokeWidth={4} dot={{ r: 6 }} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Other" stroke="#6b7280" strokeWidth={4} dot={{ r: 6 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

