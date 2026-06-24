const userModel = require("../models/user.models");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');



async function registerUser(req, res) {
    const { email, password, fullName: { firstName, lastName } } = req.body;


    const isUserAlreadyExists = await userModel.findOne({ email });
    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "user already exists"
        });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        email: email,
        fullName: {
            firstName,
            lastName
        },
        password: hashPassword
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

     res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });

    res.status(201).json({
        message: "user created successfully",
        user: {
            email: user.email,
            fullName: user.fullName,
            id: user._id
        }
    });
}


async function loginUser(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email });

    if (!user) {
        return res.status(400).json({
            message: "user not found"
        });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
        return res.status(400).json({
            message: "Invalid Password"
        });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.cookie("token", token, {
        httpOnly: true,
        secure: true,        // HTTPS required (Render pe true hoga)
        sameSite: "none"     // frontend-backend different domain ho to required
    });

    res.status(200).json({
        message: "user logged in successfully!",
        user: {
            email: user.email,
            fullName: user.fullName,
            id: user._id
        }
    });
}

async function logoutUser(req, res) {
     res.clearCookie("token", {
        httpOnly: true,
        secure: true,
        sameSite: "none"
    });


    return res.status(200).json({ message: "Logged out successfully" });
}
module.exports = {
    registerUser,
    loginUser,
    logoutUser
}