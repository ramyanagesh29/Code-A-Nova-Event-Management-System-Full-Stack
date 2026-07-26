const express = require("express");

const User = require("../models/User");
const Event = require("../models/Event");
const Registration = require("../models/Registration");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();


// ADMIN DASHBOARD STATISTICS
router.get("/dashboard", protect, adminOnly, async (req, res) => {

    try {

        const totalStudents = await User.countDocuments({
            role: "student"
        });

        const totalEvents = await Event.countDocuments();

        const totalRegistrations =
            await Registration.countDocuments({
                status: "registered"
            });

        const cancelledRegistrations =
            await Registration.countDocuments({
                status: "cancelled"
            });


        res.status(200).json({

            totalStudents,
            totalEvents,
            totalRegistrations,
            cancelledRegistrations

        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// GET ALL STUDENTS
router.get("/students", protect, adminOnly, async (req, res) => {

    try {

        const students = await User.find({
            role: "student"
        })
        .select("-password")
        .sort({ createdAt: -1 });


        res.status(200).json(students);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


module.exports = router;