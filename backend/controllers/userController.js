const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId } = require("mongodb");
const dotenv = require("dotenv");
var objectId = require("mongodb").ObjectId;
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

async function getAllUsers(req, res) {
    try{
        await connectClient();
        const db = client.db("Codebank");
        const usersCollection = db.collection("users");

        const users = await usersCollection.find({}).toArray();
        res.json(users);
    }catch(error){
        console.error("Error during fetching :", error);

        return res.status(500).json({
            message: "Server Error"
        });
    }
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

async function login (req, res) {
    const { email, password } = req.body;
    try{
        await connectClient();
        const db = client.db("Codebank");
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ email });
        if(user){
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if(isMatch){
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {
            expiresIn: "1h",
        }); 
        res.json({ token, userId: user._id });
    }catch(error){
        console.error("Error during the login: ", error.message);
        res.status(500).send("Server Error!!");
    }
};

async function getUserProfile(req, res){
    const currentID = req.params.id;

    try{
        await connectClient();
        const db = client.db("Codebank");
        const usersCollection = db.collection("users");
        
        const user = await usersCollection.findOne({
            _id: new ObjectId(currentID),
        });

        if(!user){
            return res.status(500).json({ message: "invalid credentials" });
        }
    }catch(error){
        console.error("Error during fetching the user profile : ", error.message);
        res.status(500).send("Server Error!!");
    }
    res.send(user, { message: "Profile fetched" }); 
};

const updateUserProfile = (req, res) => {
    const currentID = req.params.id;
    const {email, password} = req.body;

    try{
        let updateFields = {email};
        if(password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);
            updateFields.password = hashedPassword;
        }
        const result = await usersCollection.findOneAndUpdate(
            {
                _id: new ObjectId(currentID)
            }, 
            { $set: updateFields },
            { returnDocument: "after" }
        );
        if(result.deleteCount == 0){
            return res.status(404).json({ message: "user not found" });
        }
        res.json({ message: "user profile deleted" });
    }catch(error){
        console.error("Error during updating user profile: ", error);
        res.status(500).send("Server error");
    }
    res.send("Profile updated!!");
};

const deleteUserProfile = (req, res) => {
    const currentID = req.params.id;
    try{
        await connectClient();
        const db = client.db("Codebank");
        const usersCollection = db.collection("users");
        
        const result = await usersCollection.deleteOne({
            _id: new ObjectId(currentID)
        });

        if(!result.value){
            return res.status(404).json({ message: "user not found" });
        }

    }catch(error){
        console.error("Erroring while deleting the user profile: ", error.message);
        res.status(500).send("Server Error");
    }
};

module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
};