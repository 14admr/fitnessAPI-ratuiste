const User = require("../models/user");
const bcrypt = require("bcrypt");
const auth = require("../auth");

// User registration
module.exports.registerUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res
                .status(400)
                .send({ error: "Email and password are required." });
        }

        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res
                .status(409)
                .send({ error: "User with that email already exists." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            email: email,
            password: hashedPassword,
        });

        await newUser.save();

        return res.status(201).send({ message: "Registered Successfully" });
    } catch (err) {
        next(err);
    }
};

// User login
module.exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res
                .status(404)
                .send({ error: "Authentication failed. User not found." });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res
                .status(401)
                .send({ error: "Authentication failed. Wrong password." });
        }

        return res.status(200).send({ access: auth.createAccessToken(user) });
    } catch (err) {
        next(err);
    }
};

// Get user details
module.exports.getUserDetails = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }
        
        return res.status(200).send({ user });
    } catch (err) {
        next(err);
    }
};
