const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const uri = process.env.MONGODB_URI;

let client;

async function connectClient() {
    if (!client) {
        client = new MongoClient(uri);
        await client.connect();
        console.log("Native MongoDB Connected");
    }
}

const getAllUsers = (req, res) => {
    res.send("All users fetched!!");
};

async function signup(req, res) {

    const { username, email, password } = req.body;

    try {

        await connectClient();

        const db = client.db("Codebank");
        const usersCollection = db.collection("users");

        const existingUser = await usersCollection.findOne({
            $or: [
                { username },
                { email }
            ]
        });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
            username,
            email,
            password: hashedPassword,
            repositories: [],
            followedUsers: [],
            starRepos: []
        };

        const result = await usersCollection.insertOne(newUser);

        const token = jwt.sign(
            {
                id: result.insertedId,
                username
            },
            process.env.JWT_SECRET_KEY,
            {
                expiresIn: "1h"
            }
        );

        return res.status(201).json({
            message: "Signup Successful",
            token
        });

    } catch (error) {

        console.error("Error during Signup:", error);

        return res.status(500).json({
            message: "Server Error"
        });
    }
}

const login = (req, res) => {
    res.send("Logging in!!");
};

const getUserProfile = (req, res) => {
    res.send("Profile fetched!!");
};

const updateUserProfile = (req, res) => {
    res.send("Profile updated!!");
};

const deleteUserProfile = (req, res) => {
    res.send("Profile deleted!!");
};

module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
};