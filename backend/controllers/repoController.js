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
        const repository = await Repository.find({ _id: id })
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
    const { name } = req.params;
    try{
        const repository = Repository.find({ name })
            .populate("owner")
            .populate("issues");
         
        res.json(repository);
    }catch(error){
        console.error('Error during repo fetching : ', error.message);
        res.status(500).send("Server Error");
    }
};

//Works only for the logged in user
async function fetchRepositriesForCurrentUser (req, res) {
    const userID = req.user;

    try{
        const repositories = await Repository.find({ owner: userId });
        if(!repositories || repositories.length == 0){
            return res.status(404).json({ error: "user repositories not found" });
        }

        res.json({ message: "Repositories Not found!!", repositories });
    }catch(error){
        console.error('Error during fetching user repo: ', error.message);
        res.status(500).send("Server Error");
    }
};

async function updateRepositryById (req, res) {
    const { id } = req.params;
    const { content, description } = req.body;

    try{
        const repository = await Repository.findById({id});
        if(!repository){
            return res.status(404).json({ error: "Repository Not found!!" });
        }

        repository.content.push(content);
        repository.description = description;

        const updatedRepository = await repository.save();

        res.json({
            message: "Repository updated successfully", 
            repository: updateRepositryById,
        });
    }catch(error){
        console.error('Error during updating user repo: ', error.message);
        res.status(500).send("Server Error");
    }
}

async function toggleVisibilityById (req, res) {
    const { id } = req.params;

    try{
        const repository = await Repository.find({id});
        if(!repository){
            return res.status(404).json({ error: "Repository Not found!!" });
        }

        repository.visibility = !repository.visibility;

        const updatedRepository = await repository.save();

        res.json({
            message: "Repository visibility toggled successfully", 
            repository: updateRepositryById,
        });
    }catch(error){
        console.error('Error during toggling repositry : ', error.message);
        res.status(500).send("Server Error");
    }
}

async function deleteRepositryById(req, res) {
    const { id } = req.params;

    try{
        const repository = await Repository.findByIdAndDelete(id);
        if(!repository){
            return res.status(404).json({ error: "Repositry not found!!" });
        }
        res.json({ message: "Repositry deleted successfully" });
    }catch(error){
        console.error('Error during deleting repositry : ', error.message);
        res.status(500).send("Server Error");
    }
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