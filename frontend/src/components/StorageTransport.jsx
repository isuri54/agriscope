import { Calendar, Trash2, Pencil, Sprout, Truck, AlertTriangle, BarChart3, FileText, Warehouse, Plus, CheckCircle } from "lucide-react";
import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function StorageTransport() {
  const [facilities, setFacilities] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [facilityForm, setFacilityForm] = useState({ name: '', district: '', type: 'Dry Storage', capacity: '', allocated: '' });
  const [vehicleForm, setVehicleForm] = useState({ vehicleId: '', district: '', capacity: '', route: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [nameInput, setNameInput] = useState(''); // for controlled input + search
  const [filteredFacilities, setFilteredFacilities] = useState([]); // matching facilities
  const [selectedFacility, setSelectedFacility] = useState(null); // if existing one selected
  const [editingFacilityId, setEditingFacilityId] = useState(null);
  const [editingVehicleId, setEditingVehicleId] = useState(null);

  const location = useLocation();

  // Fetch data on mount
  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please login first');
        return;
      }

      try {
        const [facRes, vehRes] = await Promise.all([
          axios.get('http://localhost:5000/api/storage/facilities', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/storage/vehicles', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setFacilities(facRes.data);
        setVehicles(vehRes.data);
      } catch (err) {
        setError('Failed to load data');
      }
    };

    fetchData();
  }, []);

  // Handle form changes
  const handleFacilityChange = (e) => {
    const { name, value } = e.target;

    if (name === 'name') {
      setNameInput(value);

      // Filter facilities starting with input (case-insensitive)
      const filtered = facilities.filter(f =>
        f.name.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredFacilities(filtered);
    } else {
      setFacilityForm({ ...facilityForm, [name]: value });
    }
  };

  useEffect(() => {
    if (selectedFacility) {
      setFacilityForm({
        name: selectedFacility.name,
        district: selectedFacility.district,
        type: selectedFacility.type,
        capacity: selectedFacility.capacity,
        allocated: '' // keep empty for new allocation
      });
      setNameInput(selectedFacility.name);
      setFilteredFacilities([]); // hide dropdown after selection
    }
  }, [selectedFacility]);

  const handleVehicleChange = (e) => {
    setVehicleForm({ ...vehicleForm, [e.target.name]: e.target.value });
  };

  // Add/Update facility
  const handleAddOrUpdateFacility = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');

    try {
      let res;
      if (editingFacilityId) {
        // Full update for editing
        res = await axios.put(
          `http://localhost:5000/api/storage/facilities/${editingFacilityId}`,
          facilityForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFacilities(facilities.map(f => f._id === editingFacilityId ? res.data : f));
        setSuccess('Facility updated successfully!');
      } else if (selectedFacility) {
        // Incremental allocation update
        res = await axios.put(
          `http://localhost:5000/api/storage/facilities/${selectedFacility._id}`,
          { allocated: Number(facilityForm.allocated) || 0 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setFacilities(facilities.map(f => f._id === selectedFacility._id ? res.data : f));
        setSuccess(`Allocated updated for ${selectedFacility.name}!`);
      } else {
        // Add new facility
        res = await axios.post('http://localhost:5000/api/storage/facilities', facilityForm, {
          headers: { Authorization: `Bearer ${token}` } 
        });
        setFacilities([...facilities, res.data]);
        setSuccess('Storage facility added successfully!');
      }

      // Reset form
      setFacilityForm({ name: '', district: '', type: 'Dry Storage', capacity: '', allocated: '' });
      setSelectedFacility(null);
      setNameInput('');
      setEditingFacilityId(null);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEditFacility = (facility) => {
    setFacilityForm({
      name: facility.name,
      district: facility.district,
      type: facility.type,
      capacity: facility.capacity,
      allocated: facility.allocated
    });
    setNameInput(facility.name);
    setEditingFacilityId(facility._id);
    setSelectedFacility(null);  // Clear search selection for full edit
  };

  // Add/Update vehicle
  const handleAddOrUpdateVehicle = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token');
    try {
      let res;
      if (editingVehicleId) {
        // Update existing vehicle
        res = await axios.put(
          `http://localhost:5000/api/storage/vehicles/${editingVehicleId}`,
          vehicleForm,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setVehicles(vehicles.map(v => v._id === editingVehicleId ? res.data : v));
        setSuccess('Vehicle updated successfully!');
      } else {
        // Add new vehicle
        res = await axios.post('http://localhost:5000/api/storage/vehicles', vehicleForm, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setVehicles([...vehicles, res.data]);
        setSuccess('Transport vehicle added successfully!');
      }

      // Reset form
      setVehicleForm({ vehicleId: '', district: '', capacity: '', route: '' });
      setEditingVehicleId(null);
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEditVehicle = (vehicle) => {
    setVehicleForm({
      vehicleId: vehicle.vehicleId,
      district: vehicle.district,
      capacity: vehicle.capacity,
      route: vehicle.route
    });
    setEditingVehicleId(vehicle._id);
  };

  // Delete facility
  const handleDeleteFacility = async (id) => {
    if (!window.confirm('Delete this facility?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/storage/facilities/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFacilities(facilities.filter(f => f._id !== id));
    } catch (err) {
      setError('Failed to delete');
    }
  };

  // Delete vehicle
  const handleDeleteVehicle = async (id) => {
    if (!window.confirm('Delete this vehicle?')) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5000/api/storage/vehicles/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVehicles(vehicles.filter(v => v._id !== id));
    } catch (err) {
      setError('Failed to delete');
    }
  };

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
          <NavItem icon={<Truck size={16} />} label="Storage & Transport" to="/storage" active />
          <NavItem icon={<Calendar size={16} />} label="Seasonal Calendar" to="/seasonalcalendar" />
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

      {/* Storage Facilities */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Warehouse size={18} className="text-green-600" />
          Storage Facilities
        </h2>

        <form onSubmit={handleAddOrUpdateFacility} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Warehouse Name with search dropdown */}
          <div className="relative">
            <label className="block text-sm font-medium mb-1">Warehouse Name</label>
            <input
              type="text"
              name="name"
              value={nameInput}
              onChange={handleFacilityChange}
              placeholder="e.g., Warehouse A or start typing to search"
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              autoComplete="off"
            />

            {/* Dropdown - width matches input */}
            {filteredFacilities.length > 0 && nameInput && (
              <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 max-h-60 overflow-auto shadow-lg">
                {filteredFacilities.map((f) => (
                  <li
                    key={f._id}
                    className="px-3 py-2 hover:bg-green-50 cursor-pointer text-sm"
                    onClick={() => {
                      setSelectedFacility(f);
                    }}
                  >
                    {f.name} ({f.district})
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Input 
            label="District" 
            name="district" 
            value={facilityForm.district} 
            onChange={handleFacilityChange} 
            placeholder="e.g., Colombo" 
            disabled={selectedFacility} 
          />

          <Select 
            label="Storage Type" 
            name="type" 
            value={facilityForm.type} 
            onChange={handleFacilityChange} 
            options={["Dry Storage", "Cold Storage"]} 
            disabled={selectedFacility}
          />

          <Input 
            label="Capacity (tons)" 
            name="capacity" 
            type="number" 
            value={facilityForm.capacity} 
            onChange={handleFacilityChange} 
            placeholder="Total capacity" 
            disabled={selectedFacility}
          />

          <Input 
            label="Allocated Capacity (tons)" 
            name="allocated" 
            type="number" 
            value={facilityForm.allocated} 
            onChange={handleFacilityChange} 
            placeholder="Allocated amount" 
          />

          <div className="md:col-span-3">
            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              <Plus size={16} />
              {editingFacilityId ? 'Update Facility' : (selectedFacility ? 'Update Allocation' : 'Add Storage Facility')}
            </button>
          </div>
        </form>

        {facilities.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No facilities added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-gray-600">
                <tr>
                  <th className="py-2 text-left">Facility</th>
                  <th className="py-2 text-left">District</th>
                  <th className="py-2 text-left">Type</th>
                  <th className="py-2 text-left">Capacity</th>
                  <th className="py-2 text-left">Allocated</th>
                  <th className="py-2 text-left">Available</th>
                  <th className="py-2 text-left">Utilization</th>
                  <th className="py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {facilities.map((f) => {
                  const available = f.capacity - f.allocated;
                  const percent = f.capacity > 0 ? Math.round((f.allocated / f.capacity) * 100) : 0;
                  return (
                    <tr key={f._id} className="border-b last:border-none hover:bg-gray-50">
                      <td className="py-3">{f.name}</td>
                      <td>{f.district}</td>
                      <td>{f.type}</td>
                      <td>{f.capacity} tons</td>
                      <td>{f.allocated} tons</td>
                      <td>{available} tons</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-green-100 rounded-full h-2">
                            <div className={`bg-green-500 h-2 rounded-full ${percent > 90 ? 'bg-red-500' : percent > 70 ? 'bg-yellow-500' : ''}`} style={{ width: `${percent}%` }} />
                          </div>
                          {percent}%
                        </div>
                      </td>
                      <td className="text-center flex justify-center gap-3">
                        <button
                          onClick={() => handleEditFacility(f)}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <Pencil size={16} />
                        </button>
                        <button onClick={() => handleDeleteFacility(f._id)} className="text-red-500 hover:text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transport Vehicles */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Truck size={18} className="text-green-600" />
          Transport Vehicles
        </h2>

        <form onSubmit={handleAddOrUpdateVehicle} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <Input label="Vehicle ID" name="vehicleId" value={vehicleForm.vehicleId} onChange={handleVehicleChange} placeholder="e.g., Truck-001" />
          <Input label="District" name="district" value={vehicleForm.district} onChange={handleVehicleChange} placeholder="e.g., Colombo" />
          <Input label="Capacity (tons)" name="capacity" type="number" value={vehicleForm.capacity} onChange={handleVehicleChange} />
          <Input label="Route" name="route" value={vehicleForm.route} onChange={handleVehicleChange} placeholder="e.g., Galle to Colombo" />

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={loading}
              className="mt-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              <Plus size={16} />
              {editingVehicleId ? 'Update Vehicle' : 'Add Transport Vehicle'}
            </button>
          </div>
        </form>

        {vehicles.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No vehicles added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b text-gray-600">
                <tr>
                  <th className="py-2 text-left">Vehicle ID</th>
                  <th className="py-2 text-left">District</th>
                  <th className="py-2 text-left">Capacity</th>
                  <th className="py-2 text-left">Route</th>
                  <th className="py-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <tr key={v._id} className="border-b last:border-none hover:bg-gray-50">
                    <td className="py-3">{v.vehicleId}</td>
                    <td>{v.district}</td>
                    <td>{v.capacity} tons</td>
                    <td>{v.route}</td>
                    <td className="text-center flex justify-center gap-3">
                      <button
                        onClick={() => handleEditVehicle(v)}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDeleteVehicle(v._id)} className="text-red-500 hover:text-red-600">
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

// NavItem & Input & Select (unchanged from your code)
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
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}