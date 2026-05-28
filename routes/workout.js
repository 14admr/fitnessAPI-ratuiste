const express = require("express");
const router = express.Router();
const workoutController = require("../controllers/workout");
const { verify } = require("../auth");

router.post("/addWorkout", verify, workoutController.addWorkout);
router.get("/getMyWorkouts", verify, workoutController.getMyWorkouts);
router.put(
    "/updateWorkout/:workoutId",
    verify,
    workoutController.updateWorkout,
);
router.delete(
    "/deleteWorkout/:workoutId",
    verify,
    workoutController.deleteWorkout,
);
router.patch(
    "/completeWorkoutStatus/:workoutId",
    verify,
    workoutController.completeWorkoutStatus,
);

module.exports = router;
