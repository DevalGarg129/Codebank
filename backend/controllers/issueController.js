const createIssue = (req, res) => {
    res.send("Repository Created!!");
};

const updateIssueById = (req, res) => {
    res.send("Issue updated!!");
};

const deleteIssueById = (req, res) => {
    res.send("Issue Deleted!!");
};

const getAllIssues = (req, res) => {
    res.send("all Issues fetched");
};

const getIssueById = (req, res) => {
    res.send("Issue Details Fetched!!");
};

module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById
};


