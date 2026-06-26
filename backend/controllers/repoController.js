const createRepository = (req, res) => {
    res.send("Repository Created");
};

const getAllRepositories = (req, res) => {
    res.send("Repositories fetched!!");
};

const fetchRepositoryById = (req, res) => {
    res.send("Repositry Details Fetched!!");
};

const fetchRepositoryByName = (req, res) => {
    res.send("Repositry Details Fetched!!");
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