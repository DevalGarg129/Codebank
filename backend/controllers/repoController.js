const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

async function createRepository (req, res) {
    const { owner, name, issues, content, description, visibility } = req.body;
    try{
        if(!name){
            return res.status(500).json({ error: "Repositry name is required" });
        }

        if(!mongoose.Types.ObjectId.isValid(owner)){
            return res.status(500).json({ error: "Invalid user id!!" });
        }

        if(!mongoose.Types.ObjectId.isValid(issues)){
            return res.status(500).json({ error: "Invalid user id!!" });
        }

        const newRepositry = new Repository({
            name, 
            description, 
            visibility,
            owner,
            content,
            issues,
        });

        const result = await newRepositry.save();
        res.status(201).json({
            message: "Repositry Created",
            repositoryId: result._id,
        });
    }catch(error){
        console.error("Error during repo creation : ", error.message);
        res.status(500).send("Server Error");
    }
    res.send("Repository Created");
};

async function getAllRepositories (req, res) {
    try{
        const repositories = await Repository.find({})
            .populate("owner")
            .populate("issues");

        res.json(repositories);
    }catch(error){
        console.error("Error during fetching repository : ", error.message);
        res.status(500).send("Server Error");
    }
};

async function fetchRepositoryById (req, res) {
    const { id } = req.params;
    try{
        const repository = Repository.find({ _id: repoID })
            .populate("owner")
            .populate("issues")
            .toArray();
        
        res.json(repository);
    }catch(error){
        console.error("Error during fetching repository : ", error.message);
        res.status(500).send("Server Error");
    }
};

async function fetchRepositoryByName (req, res) {
    const { repoName } = req.params.name;
    try{
        const repository = Repository.find({ name: repoName })
            .populate("owner")
            .populate("issues");
        
        res.json(repository);
    }catch(error){
        console.error('Error during repo fetching : ', error.message);
        res.status(500).send("Server Error");
    }
};

const fetchRepositriesForCurrentUser = (req, res) => {
    res.send("Repositry for logged In user fetched!!");
};

const updateRepositryById = (req, res) => {
    res.send("Repositry Updated!!");
}

const toggleVisibilityById = (req, res) => {
    res.send("Visibility Toggled!!");
}

const deleteRepositryById = (req, res) => {
    res.send("Repositry deleted!!");
}

module.exports = {
    createRepository,
    getAllRepositories,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositriesForCurrentUser,
    updateRepositryById,
    toggleVisibilityById,
    deleteRepositryById
};