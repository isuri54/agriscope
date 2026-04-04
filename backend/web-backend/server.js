import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './routes/auth.js';
import harvestRoutes from './routes/plantingschedule.js';
import storageRoutes from './routes/storage.js';
import calendarRoutes from './routes/calendar.js';
import lossRoutes from './routes/loss.js';
import reportRoutes from './routes/reports.js';

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Test route
app.get("/", (req, res) => {
  res.send("API is running");
});

// routes
app.use('/api/auth', authRoutes);
app.use('/api/harvest', harvestRoutes);
app.use('/api/storage', storageRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/loss', lossRoutes);
app.use('/api/report', reportRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
