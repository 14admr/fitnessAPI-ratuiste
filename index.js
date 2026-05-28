require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const userRoutes = require("./routes/user");
const workoutRoutes = require("./routes/workout");
const app = express();

app.use(express.json());
app.use(cors());
app.use("/users", userRoutes);
app.use("/workouts", workoutRoutes);

mongoose.connect(process.env.MONGODB_STRING);

mongoose.connection.once("open", () => {
    console.log("Now connected to MongoDB Atlas.");
});

if (require.main === module) {
    app.listen(process.env.PORT || 4000, () => {
        console.log(`API is now online on port ${process.env.PORT || 4000}`);
    });
}

module.exports = { app, mongoose };
