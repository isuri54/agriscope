import { Routes, Route, Navigate } from "react-router-dom";
import HarvestCoordination from "./components/HarvestCoordination";
import StorageTransport from "./components/StorageTransport";
import SeasonalCalendar from "./components/SeasonalCalendar";
import LossReporting from "./components/LossReporting";
import DataViewer from "./components/DataViewer";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/harvest" />} /> 
      <Route path="/harvest" element={<HarvestCoordination />} />
      <Route path="/storage" element={<StorageTransport />}/>
      <Route path="/seasonalcalendar" element={<SeasonalCalendar/>}/>
      <Route path="/lossreporting" element={<LossReporting/>}/>
      <Route path="/dataviewer" element={<DataViewer/>}/>
    </Routes>
  );
}

export default App;
