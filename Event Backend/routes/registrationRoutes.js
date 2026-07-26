const express = require("express");

const Registration = require("../models/Registration");
const Event = require("../models/Event");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");
const transporter = require("../config/email");

const router = express.Router();



// REGISTER FOR EVENT
router.post("/:eventId", protect, async (req, res) => {
    try {

        if (req.user.role !== "student") {
            return res.status(403).json({
                message: "Only students can register for events"
            });
        }

        const event = await Event.findById(req.params.eventId);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        // Check deadline
        if (new Date() > new Date(event.registrationDeadline)) {
            return res.status(400).json({
                message: "Registration deadline has passed"
            });
        }

        // Check duplicate registration
        const existingRegistration = await Registration.findOne({
            student: req.user._id,
            event: event._id
        });

        if (existingRegistration) {
            return res.status(400).json({
                message: "You have already registered for this event"
            });
        }

        // Check capacity
        const participantCount = await Registration.countDocuments({
            event: event._id,
            status: "registered"
        });

        if (participantCount >= event.maxParticipants) {
            return res.status(400).json({
                message: "Event registration is full"
            });
        }

        // Create registration
        const registration = await Registration.create({
            student: req.user._id,
            event: event._id
        });

// Send confirmation email
try {
    const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: req.user.email,

        subject: `Registration Confirmed - ${event.title}`,

        text: `
Hello ${req.user.name},

Your registration for ${event.title} has been confirmed.

Event Details:

Event: ${event.title}
Date: ${new Date(event.date).toLocaleDateString("en-IN")}
Time: ${event.time}
Venue: ${event.venue}

Thank you for registering.

Event Management System
        `
    });

    console.log("Confirmation email sent successfully");
    console.log("Recipient:", req.user.email);
    console.log("Message ID:", info.messageId);

} catch (emailError) {

    console.error(
        "Confirmation email failed:",
        emailError.message
    );
}

res.status(201).json({
    message: "Event registration successful",
    registration
});

    } catch (error) {

        if (error.code === 11000) {
            return res.status(400).json({
                message: "You have already registered for this event"
            });
        }

        res.status(500).json({
            message: error.message
        });
    }
});


// GET STUDENT REGISTRATIONS
router.get("/my/events", protect, async (req, res) => {
    try {

        const registrations = await Registration.find({
            student: req.user._id
        })
            .populate("event")
            .sort({ createdAt: -1 });

        res.status(200).json(registrations);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
});


// CANCEL REGISTRATION
router.put("/:registrationId/cancel", protect, async (req, res) => {
    try {

        const registration = await Registration.findOne({
            _id: req.params.registrationId,
            student: req.user._id
        });

        if (!registration) {
            return res.status(404).json({
                message: "Registration not found"
            });
        }

        if (registration.status === "cancelled") {
            return res.status(400).json({
                message: "Registration is already cancelled"
            });
        }

        registration.status = "cancelled";

        await registration.save();

        res.status(200).json({
            message: "Registration cancelled successfully",
            registration
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
});


// ADMIN - VIEW ALL REGISTRATIONS
router.get("/", protect, adminOnly, async (req, res) => {
    try {

        const registrations = await Registration.find()
            .populate("student", "name email")
            .populate("event", "title date time venue")
            .sort({ createdAt: -1 });

        res.status(200).json(registrations);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
});


module.exports = router;