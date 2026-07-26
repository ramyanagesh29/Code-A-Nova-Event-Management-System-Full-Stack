const express = require("express");

const Event = require("../models/Event");

const protect = require("../middleware/authMiddleware");
const adminOnly = require("../middleware/adminMiddleware");

const router = express.Router();


// GET ALL EVENTS
router.get("/", async (req, res) => {

    try {

        const events = await Event.find()
            .sort({ date: 1 });

        res.status(200).json(events);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// GET SINGLE EVENT
router.get("/:id", async (req, res) => {

    try {

        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json(event);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// CREATE EVENT - ADMIN ONLY
router.post("/", protect, adminOnly, async (req, res) => {

    try {

        const {
            title,
            description,
            category,
            date,
            time,
            venue,
            maxParticipants,
            registrationDeadline
        } = req.body;

        if (
            !title ||
            !description ||
            !category ||
            !date ||
            !time ||
            !venue ||
            !maxParticipants ||
            !registrationDeadline
        ) {
            return res.status(400).json({
                message: "Please provide all event details"
            });
        }

        const event = await Event.create({
            title,
            description,
            category,
            date,
            time,
            venue,
            maxParticipants,
            registrationDeadline,
            createdBy: req.user._id
        });

        res.status(201).json({
            message: "Event created successfully",
            event
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// UPDATE EVENT - ADMIN ONLY
router.put("/:id", protect, adminOnly, async (req, res) => {

    try {

        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json({
            message: "Event updated successfully",
            event
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// DELETE EVENT - ADMIN ONLY
router.delete("/:id", protect, adminOnly, async (req, res) => {

    try {

        const event = await Event.findByIdAndDelete(
            req.params.id
        );

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json({
            message: "Event deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});

module.exports = router;