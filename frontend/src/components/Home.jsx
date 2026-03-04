import { Sprout, Truck, Calendar, AlertTriangle, BarChart3, FileText, Sparkles, CheckCircle } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export default function Home() {
  const location = useLocation();

  return (
    <div className="bg-green-50 min-h-screen">

      {/* Navbar */}
      <div className="flex items-center justify-between border-b pb-4 px-8 pt-6 bg-white">
        <div className="flex items-center">
          <img src="/logo.png" alt="Agriscope Logo" className="h-30 w-60 object-contain" />
        </div>

        <div className="flex items-center gap-8 text-sm font-medium">
          <NavItem icon={<Sprout size={16} />} label="Harvest Coordination" to="/harvest" />
          <NavItem icon={<Truck size={16} />} label="Storage & Transport" to="/storage" />
          <NavItem icon={<Calendar size={16} />} label="Seasonal Calendar" to="/seasonalcalendar" />
          <NavItem icon={<AlertTriangle size={16} />} label="Loss Reporting" to="/lossreporting" />
          <NavItem icon={<BarChart3 size={16} />} label="Data Viewer" to="/dataviewer" />
          <NavItem icon={<FileText size={16} />} label="Report Generation" to="/reports" />
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[600px] flex items-center justify-center text-center text-white"
        style={{
          backgroundImage: "url('/bamboo-plant.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0 bg-green-900 bg-opacity-60"></div>

        <div className="relative z-10 px-6">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Smart Agriculture Begins With <span className="text-green-300">Data & Intelligence</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-gray-200 mb-6">
            “Predict today, plan tomorrow, and prevent oversupply before it happens.”
          </p>

          <Link to="/harvest">
            <button className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-lg font-medium transition">
              Get Started
            </button>
          </Link>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-8">

        <FeatureCard
          icon={<Sprout size={28} />}
          title="Harvest Coordination"
          description="Plan planting and harvesting schedules efficiently to reduce seasonal oversupply risks."
        />

        <FeatureCard
          icon={<Truck size={28} />}
          title="Storage & Transport Monitoring"
          description="Optimize logistics and storage capacity across districts to minimize post-harvest losses."
        />

        <FeatureCard
          icon={<Sparkles size={28} />}
          title="AI-Based Forecasting"
          description="Use Artificial Neural Networks to predict excess tomato harvest and take proactive actions."
        />
      </div>

      {/* About Section */}
      <div className="bg-white px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-6">
          Empowering Agriculture Through Intelligence
        </h2>

        <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed">
          Agriscope is a full-stack intelligent agricultural management system designed
          to assist officers in making proactive, data-driven decisions. By integrating
          machine learning with real-time management tools, the system transforms
          traditional reactive planning into predictive agricultural governance.
        </p>
      </div>

      {/* Additional Modules Section */}
      <div className="px-8 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 bg-green-100">

        <FeatureCard
          icon={<Calendar size={28} />}
          title="Seasonal Event Tracking"
          description="Track important seasonal events to align production planning with demand variations."
        />

        <FeatureCard
          icon={<AlertTriangle size={28} />}
          title="Loss Reporting"
          description="Maintain detailed loss records to improve future preventive strategies."
        />

        <FeatureCard
          icon={<BarChart3 size={28} />}
          title="Data Visualization"
          description="Visualize production and loss trends through interactive dashboards."
        />
      </div>

      {/* Call To Action */}
      <div className="bg-green-700 text-white text-center py-16 px-6">
        <h2 className="text-3xl font-bold mb-4">
          “From Uncertainty to Intelligence”
        </h2>

        <p className="mb-6 text-green-100">
          Make smarter agricultural decisions powered by AI-driven forecasting.
        </p>

        <Link to="/harvest">
          <button className="bg-white text-green-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
            Explore System
          </button>
        </Link>
      </div>

    </div>
  );
}

/* Reusable Components */

function NavItem({ icon, label, to }) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 cursor-pointer pb-2 transition-colors ${
        active
          ? "text-green-600 border-b-2 border-green-600"
          : "text-gray-600 hover:text-green-600"
      }`}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition text-center">
      <div className="text-green-600 mb-4 flex justify-center">{icon}</div>
      <h3 className="text-lg font-semibold mb-3">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}