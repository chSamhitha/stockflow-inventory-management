const mongoose = require("mongoose");

const User = require("../models/User");
const Organization = require("../models/Organization");

const {
    hashPassword,
    comparePassword,
    generateToken
} = require("../services/authService");

// SIGNUP
const signup = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { email, password, organizationName } = req.body;

        // Basic validation
        if (!email || !password || !organizationName) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must contain at least 8 characters"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        const hashedPassword = await hashPassword(password);

        let newUser;
        let newOrganization;

        await session.withTransaction(async () => {
            [newOrganization] = await Organization.create(
                [{
                    name: organizationName.trim()
                }],
                { session }
            );

            [newUser] = await User.create(
                [{
                    email: normalizedEmail,
                    password: hashedPassword,
                    organizationId: newOrganization._id
                }],
                { session }
            );
        });

        const token = generateToken(newUser);

        return res.status(201).json({
            success: true,
            message: "Account created successfully",
            token,
            user: {
                id: newUser._id,
                email: newUser.email,
                organizationId: newUser.organizationId,
                organizationName: newOrganization.name
            }
        });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email is already registered"
            });
        }

        console.error("Signup error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    } finally {
        await session.endSession();
    }
};


// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await User.findOne({
            email: normalizedEmail
        })
            .select("+password")
            .populate("organizationId");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const isPasswordValid = await comparePassword(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user._id,
                email: user.email,
                organizationId: user.organizationId._id,
                organizationName: user.organizationId.name
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

module.exports = {
    signup,
    login
};