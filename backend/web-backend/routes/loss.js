import express from 'express';
const router = express.Router();
import auth from '../middleware/auth.js';
import LossReport from '../models/LossReport.js';

// GET all loss reports for the logged-in officer
router.get('/reports', auth, async (req, res) => {
  try {
    const reports = await LossReport.find({ officer: req.officer.id })
      .sort({ date: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST - Submit new loss report
router.post('/reports', auth, async (req, res) => {
  const { date, district, crop, type, cause, quantityLost, description } = req.body;

  if (!date || !district || !crop || !type || !cause || !quantityLost) {
    return res.status(400).json({ message: 'Required fields missing' });
  }

  try {
    const report = new LossReport({
      officer: req.officer.id,
      date: new Date(date),
      district,
      crop,
      type,
      cause,
      quantityLost,
      description: description || '',
    });

    await report.save();
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE - Remove report (only owner)
router.delete('/reports/:id', auth, async (req, res) => {
  try {
    const report = await LossReport.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    if (report.officer.toString() !== req.officer.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await report.deleteOne();
    res.json({ message: 'Report deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET stats (total reports, total quantity, most common cause) for the officer
router.get('/stats', auth, async (req, res) => {
  try {
    const reports = await LossReport.find({ officer: req.officer.id });

    const totalReports = reports.length;
    const totalQuantity = reports.reduce((sum, r) => sum + r.quantityLost, 0);

    // Most common cause
    const causeCount = reports.reduce((acc, r) => {
      acc[r.cause] = (acc[r.cause] || 0) + 1;
      return acc;
    }, {});
    const mostCommonCause = Object.keys(causeCount).reduce((a, b) =>
      causeCount[a] > causeCount[b] ? a : b, null
    );

    res.json({
      totalReports,
      totalQuantity,
      mostCommonCause: mostCommonCause || 'None',
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/loss/trends
// @desc    Get monthly loss trends by cause (aggregated for charts)
router.get('/trends', auth, async (req, res) => {
  try {
    const trends = await LossReport.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$date" },
            month: { $month: "$date" },
            type: "$type",
          },
          totalQuantity: { $sum: "$quantityLost" },
        },
      },
      {
        $project: {
          month: {
            $concat: [
              { $toString: "$_id.year" },
              "-",
              {
                $cond: [
                  { $lt: ["$_id.month", 10] },
                  { $concat: ["0", { $toString: "$_id.month" }] },
                  { $toString: "$_id.month" },
                ],
              },
            ],
          },
          cause: "$_id.type",
          totalQuantity: 1,
        },
      },
      {
        $sort: { month: 1 },
      },
    ]);

    // Format for Recharts (group by month, each cause as a key)
    const formatted = [];
    const months = [...new Set(trends.map(t => t.month))].sort();

    months.forEach((month) => {
      const monthData = { month };
      trends
        .filter(t => t.month === month)
        .forEach(t => {
          monthData[t.cause] = t.totalQuantity;
        });
      formatted.push(monthData);
    });

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;