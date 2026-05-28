const Workout = require("../models/workout");

// Add a new workout
module.exports.addWorkout = async (req, res, next) => {
    try {
        const { name, duration } = req.body;
        const userId = req.user.id;
        const newWorkout = new Workout({
            name,
            duration,
            userId,
        });
        const savedWorkout = await newWorkout.save();

        return res.status(201).send(savedWorkout);
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).send({ error: err.message });
        }

        next(err);
    }
};

// Get all workouts for a user
module.exports.getMyWorkouts = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const workouts = await Workout.find({ userId: userId });

        return res.status(200).send({ workouts });
    } catch (err) {
        next(err);
    }
};

// Update a specific workout
module.exports.updateWorkout = async (req, res, next) => {
    try {
        const workoutId = req.params.workoutId;
        const userId = req.user.id;
        const { name, duration } = req.body;
        const updatedWorkout = await Workout.findOneAndUpdate(
            { _id: workoutId, userId: userId },
            { name, duration },
            { new: true, runValidators: true },
        );

        if (!updatedWorkout) {
            return res
                .status(404)
                .send({ error: "Workout not found or user not authorized to update." });
        }

        return res.status(200).send({
            message: "Workout updated successfully",
            workout: updatedWorkout,
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            return res.status(400).send({ error: err.message });
        }
        next(err);
    }
};

// Delete a specific workout
module.exports.deleteWorkout = async (req, res, next) => {
    try {
        const workoutId = req.params.workoutId;
        const userId = req.user.id;
        const deletedWorkout = await Workout.findOneAndDelete({
            _id: workoutId,
            userId: userId,
        });

        if (!deletedWorkout) {
            return res
                .status(404)
                .send({ error: "Workout not found or user not authorized to delete." });
        }

        return res.status(200).send({
            message: "Workout deleted successfully",
            workout: deletedWorkout,
        });
    } catch (err) {
        next(err);
    }
};

// Complete a workout's status
module.exports.completeWorkoutStatus = async (req, res, next) => {
    try {
        const workoutId = req.params.workoutId;
        const userId = req.user.id;
        const completedWorkout = await Workout.findOneAndUpdate(
            { _id: workoutId, userId: userId },
            { status: "completed" },
            { new: true },
        );

        if (!completedWorkout) {
            return res
                .status(404)
                .send({ error: "Workout not found or user not authorized to update." });
        }

        return res.status(200).send({
            message: "Workout status updated to completed",
            workout: completedWorkout,
        });
    } catch (err) {
        next(err);
    }
};
