import { Sprout, Truck, Calendar, AlertTriangle, BarChart3, FileText } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { icon: <Sprout size={16} />, label: "Harvest Coordination", to: "/harvest" },
  { icon: <Truck size={16} />, label: "Storage & Transport", to: "/storage" },
  { icon: <Calendar size={16} />, label: "Seasonal Calendar", to: "/seasonalcalendar" },
  { icon: <AlertTriangle size={16} />, label: "Loss Reporting", to: "/lossreporting" },
  { icon: <BarChart3 size={16} />, label: "Data Viewer", to: "/dataviewer" },
  { icon: <FileText size={16} />, label: "Report Generation", to: "/reports" },
];

export default function Navbar() {
  const location = useLocation();

  return (
    <div className="flex items-center justify-between border-b pb-4 px-8 pt-6 bg-white">
      <div className="flex items-center">
        <Link to="/home">
          <img src="/logo.png" alt="Agriscope Logo" className="h-30 w-60 object-contain" />
        </Link>
      </div>

      <div className="flex items-center gap-8 text-sm font-medium">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-2 cursor-pointer pb-2 transition-colors ${
                active
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
