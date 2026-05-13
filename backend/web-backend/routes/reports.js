import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import LossReport from '../models/LossReport.js';
import StorageFacility from '../models/StorageFacility.js';
import TransportVehicle from '../models/TransportVehicle.js';
import PlantingSchedule from '../models/PlantingSchedule.js';
import PDFDocument from 'pdfkit';
import { format } from 'date-fns';

router.post('/generate', auth, async (req, res) => {
  try {
    const officer = req.officer;
    let { predictedExcess } = req.body;

    console.log("Received predictedExcess from frontend:", predictedExcess);

    // Clean the value
    if (predictedExcess !== null && predictedExcess !== undefined) {
      const num = parseFloat(predictedExcess);
      predictedExcess = !isNaN(num) ? num.toFixed(2) + " tons" : "No valid prediction";
    } else {
      predictedExcess = "No recent prediction available";
    }

    // Fetch real loss data for this officer
    const lossReports = await LossReport.find({ officer: officer.id });

    const totalLoss = lossReports.reduce((sum, r) => sum + r.quantityLost, 0);
    const totalReports = lossReports.length;

    // Calculate most common cause
    const typeCount = lossReports.reduce((acc, r) => {
      acc[r.type] = (acc[r.type] || 0) + 1;
      return acc;
    }, {});
    const mostCommonCause = Object.keys(typeCount).reduce((a, b) =>
      typeCount[a] > typeCount[b] ? a : b, 'None'
    );

    // Fetch storage & transport data
    const facilities = await StorageFacility.find({ officer: officer.id });
    const totalCapacity = facilities.reduce((sum, f) => sum + f.capacity, 0);
    const totalAllocated = facilities.reduce((sum, f) => sum + f.allocated, 0);
    const utilization = totalCapacity > 0 ? Math.round((totalAllocated / totalCapacity) * 100) : 0;

    const vehicles = await TransportVehicle.find({ officer: officer.id });
    const totalVehicles = vehicles.length;

    //Fetch planting schedules for production data
    const plantingSchedules = await PlantingSchedule.find({ officer: officer.id });

    // Average Monthly Production: Group by harvest month and crop
    const monthlyProduction = plantingSchedules.reduce((acc, s) => {
      if (!s.harvestDate) return acc;
      const harvestMonth = format(new Date(s.harvestDate), 'MMMM');
      const key = `${s.crop || 'Unknown Crop'} - ${harvestMonth}`;
      acc[key] = (acc[key] || 0) + (s.expectedHarvest || 0);
      return acc;
    }, {});

    // Format as list
    const productionSummary = Object.entries(monthlyProduction)
      .map(([key, value]) => `${key}: ${value.toLocaleString()} tons`)
      .join('\n') || 'No production data available';

    // Year-over-Year Growth: Total expectedHarvest for current vs previous year
    const currentYear = new Date().getFullYear();
    const prevYear = currentYear - 1;

    const currentTotal = plantingSchedules
      .filter(s => new Date(s.harvestDate).getFullYear() === currentYear)
      .reduce((sum, s) => sum + (s.expectedHarvest || 0), 0);

    const prevTotal = plantingSchedules
      .filter(s => new Date(s.harvestDate).getFullYear() === prevYear)
      .reduce((sum, s) => sum + (s.expectedHarvest || 0), 0);

    const growth = prevTotal > 0 ? Math.round(((currentTotal - prevTotal) / prevTotal) * 100) : 0;
    const growthText = growth > 0 ? `+${growth}%` : `${growth}%`;

    // Create PDF
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="AgriScope_Report.pdf"');

    doc.pipe(res);

    // Header
    doc.fontSize(20).font('Helvetica-Bold').text('AgriScope Report', { align: 'center' });
    doc.fontSize(12).text(`Generated for: ${officer.fullName || officer.username}`, { align: 'center' });
    doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
    doc.moveDown(2);

    // Executive Summary
    doc.fontSize(14).font('Helvetica-Bold').text('Executive Summary');
    doc.fontSize(11).font('Helvetica').moveDown(0.5);
    doc.text(
      'This report summarizes your agricultural records, including loss analysis, storage/transport status, and recommendations to manage tomato oversupply and reduce waste.',
      { align: 'justify' }
    );
    doc.moveDown(1.5);

    // Production Overview (static placeholder – add real data later if needed)
    doc.fontSize(14).font('Helvetica-Bold').text('Production Overview');
    doc.fontSize(11).moveDown(0.5);
    doc.text(`Year-over-Year Growth: ${growthText}`);
    doc.text(`Latest Forecasted Excess Harvest: ${predictedExcess}`);
    doc.moveDown(0.5);
    doc.text('Monthly Production Summary:', { underline: true });
    doc.text(productionSummary || 'No data available', { align: 'left' });
    doc.moveDown(1.5);

    // Loss Analysis (uses real calculated values)
    doc.fontSize(14).font('Helvetica-Bold').text('Loss Analysis');
    doc.fontSize(11).moveDown(0.5);
    doc.text(`• Total Loss Reports: ${totalReports}`);
    doc.text(`• Total Quantity Lost: ${totalLoss.toLocaleString()} tons`);
    doc.text(`• Most Common Cause: ${mostCommonCause}`);
    doc.moveDown(1.5);

    // Storage & Transport (real data)
    doc.fontSize(14).font('Helvetica-Bold').text('Storage & Transport Status');
    doc.fontSize(11).moveDown(0.5);
    doc.text(`• Total Storage Capacity: ${totalCapacity.toLocaleString()} tons`);
    doc.text(`• Current Utilization: ${utilization}%`);
    doc.text(`• Active Transport Vehicles: ${totalVehicles}`);
    doc.moveDown(1.5);

    // Recommendations
    doc.fontSize(14).font('Helvetica-Bold').text('Recommendations');
    doc.fontSize(11).moveDown(0.5);
    doc.text('1. Increase weather monitoring during monsoon season to reduce flood-related losses.');
    doc.text('2. Optimize planting schedules to avoid peak oversupply periods.');
    doc.text('3. Improve storage allocation in high-production districts.');
    doc.text('4. Enhance transport readiness during peak harvest months.');

    // Footer
    const pageCount = doc.bufferedPageRange().count;
    doc.fontSize(10).text(
      `Generated by Agriscope - Confidential • Page 1 of ${pageCount}`,
      50,
      doc.page.height - 50,
      { align: 'center' }
    );

    doc.end();
  } catch (err) {
    console.error('Report generation error:', err);
    // Send error response only if headers not already sent
    if (!res.headersSent) {
      res.status(500).json({ message: 'Failed to generate report' });
    }
  }
});

export default router;