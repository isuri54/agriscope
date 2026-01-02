import { Sprout, Truck, Calendar, AlertTriangle, BarChart3, FileText, TrendingUp, Eye, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

const data = [
  { month: "Jan", rice: 4200, vegetables: 2800, fruits: 1800 },
  { month: "Feb", rice: 3900, vegetables: 3100, fruits: 2000 },
  { month: "Mar", rice: 4500, vegetables: 2900, fruits: 2200 },
  { month: "Apr", rice: 5000, vegetables: 3300, fruits: 2500 },
  { month: "May", rice: 4800, vegetables: 3100, fruits: 2300 },
  { month: "Jun", rice: 5300, vegetables: 3500, fruits: 2700 },
];

const lossData = [
  { month: "Jan", weather: 120, pest: 80, disease: 50 },
  { month: "Feb", weather: 90, pest: 110, disease: 60 },
  { month: "Mar", weather: 150, pest: 95, disease: 45 },
  { month: "Apr", weather: 200, pest: 120, disease: 70 },
  { month: "May", weather: 180, pest: 100, disease: 55 },
  { month: "Jun", weather: 140, pest: 85, disease: 50 },
];

export default function DataViewer() {
  return (
    <div className="bg-green-50 min-h-screen p-8 space-y-10">
      <div className="flex items-center justify-between border-b">
        {/*Logo */}
        <div className="flex items-center">
          <img
            src="/agri.png"
            alt="Agriscope Logo"
            className="h-20 w-20 object-contain"
          />
          <span className="text-lg font-bold text-green-700">Agriscope</span>
        </div>
        {/*Navigation bar */}
        <div className="flex items-center gap-8 text-sm font-medium">
          <NavItem icon={<Sprout size={16} />} label="Harvest Coordination" to="/harvest" />
          <NavItem icon={<Truck size={16} />} label="Storage & Transport" to="/storage" />
          <NavItem icon={<Calendar size={16} />} label="Seasonal Calendar" to="/seasonalcalendar" />
          <NavItem icon={<AlertTriangle size={16} />} label="Loss Reporting" to="/lossreporting" />
          <NavItem icon={<BarChart3 size={16} />} label="Data Viewer" to="/dataviewer" active />
          <NavItem icon={<FileText size={16} />} label="Report Generation" to="/reports" />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <StatCard
          title="Avg Production"
          value="4,783 tons"
          sub="↑ 12% from last year"
          icon={<TrendingUp size={28} />}
          positive
        />
        <StatCard
          title="Total Loss"
          value="1,120 tons"
          sub="↓ 8% from last month"
          icon={<Eye size={28} />}
          negative
        />
        <StatCard
          title="Peak Season"
          value="June – Aug"
          sub="Rice harvest"
          icon={<Sparkles size={28} />}
        />
        <StatCard
          title="Districts Active"
          value="18"
          sub="Out of 25"
          icon={<Eye size={28} />}
        />
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">
          Production Trends (Last 6 Months)
        </h2>

        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey="rice"
                name="Rice (tons)"
                stroke="#22c55e"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="vegetables"
                name="Vegetables (tons)"
                stroke="#16a34a"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey="fruits"
                name="Fruits (tons)"
                stroke="#06b6d4"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Loss analysis by cause*/}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold mb-6">
          Loss Analysis by Cause
        </h2>

        <div className="h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={lossData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="weather" name="Weather (tons)" fill="#22c55e" />
              <Bar dataKey="pest" name="Pest (tons)" fill="#10b981" />
              <Bar dataKey="disease" name="Disease (tons)" fill="#059669" />
            </BarChart>
          </ResponsiveContainer>
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

function StatCard({ title, value, sub, icon, positive, negative }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 flex justify-between items-center">
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
        <p
          className={`text-sm mt-1 ${
            positive
              ? "text-green-600"
              : negative
              ? "text-red-500"
              : "text-gray-500"
          }`}
        >
          {sub}
        </p>
      </div>
      <div className="text-green-200">{icon}</div>
    </div>
  );
}
