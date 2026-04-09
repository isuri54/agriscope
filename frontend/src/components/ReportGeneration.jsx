import { Download, FileText } from "lucide-react";
import Navbar from "../navbar/Navbar";
import { useState } from "react";
import axios from "axios";

export default function ReportGeneration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerateReport = async () => {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login first");
      setLoading(false);
      return;
    }

    const latestExcess = localStorage.getItem('latestPredictedExcess') || null;

    try {
      const response = await axios.post(
        "http://localhost:5000/api/report/generate",
        { predictedExcess: latestExcess },
        {
          headers: { Authorization: `Bearer ${token}` },
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Agriscope_Report.pdf");
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("=== REPORT ERROR ===");
      console.error("Status:", err.response?.status);
      console.error("Error Data:", err.response?.data);
      console.error("Full Error:", err);

      const errorMessage = err.response?.data?.message || err.message || "Failed to generate report";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-green-50 min-h-screen p-8 space-y-10">
      {/* Navbar */}
      <Navbar />

      {/* Generate Report Card */}
      <div className="bg-white rounded-xl shadow-sm p-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FileText size={18} className="text-green-600" />
            Report Generation
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Generate comprehensive PDF reports including production forecasts, loss analysis, and management recommendations.
          </p>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>

        <button
          onClick={handleGenerateReport}
          disabled={loading}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          <Download size={16} />
          {loading ? "Generating..." : "Generate PDF Report"}
        </button>
      </div>

      {/* Report Contents Preview */}
      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <h3 className="text-lg font-semibold">Report Contents</h3>

        <Section
          title="Executive Summary"
          content="Overview of agricultural activities and key performance indicators based on your records."
        />

        <Section
          title="Production Overview"
          list={[
            "Average Monthly Production: Calculated from schedules",
            "Year-over-Year Growth: Pending real comparison data",
            "Peak Production Month: To be derived from trends",
          ]}
        />

        <Section
          title="Loss Analysis"
          list={[
            "Total Losses: Aggregated from your reports",
            "Primary Cause: Most frequent cause from data",
            "Secondary Cause: Second most frequent",
          ]}
        />

        <Section
          title="Storage & Transport Status"
          list={[
            "Total Storage Capacity: Sum from facilities",
            "Current Utilization: Calculated percentage",
            "Active Transport Vehicles: Count from records",
          ]}
        />

        <Section
          title="Recommendations"
          list={[
            "Increase weather monitoring during monsoon season",
            "Optimize planting schedules to avoid peak oversupply",
            "Improve storage allocation in high-production districts",
            "Enhance transport readiness during peak harvest months",
          ]}
        />
      </div>
    </div>
  );
}

function Section({ title, content, list }) {
  return (
    <div className="bg-green-50 rounded-lg p-4">
      <h4 className="font-semibold mb-2">{title}</h4>
      {content && <p className="text-sm text-gray-700">{content}</p>}
      {list && (
        <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
          {list.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}