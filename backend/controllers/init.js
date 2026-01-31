const fs = require("fs").promises;
const path = require("path");

async function initRepo(){
    const repoPath = path.resolve(process.cwd(), ".devGit"); //shows the current directory
    const commitsPath = path.join(repoPath, "commits");
    try{
        await fs.mkdir(repoPath, { recursive: true }); //nested repo 
        await fs.mkdir(commitsPath, { recursive: true }); //nested commits
        await fs.writeFile(
            path.join(repoPath, "config.json"),
            JSON.stringify({ bucket: process.env.S3_BUCKET })
        );
        console.log('Repository initialized successfully at', repoPath);
    }catch(err){
        console.error("Error initializing repository:", err);
        return;
    }
}

module.exports = { initRepo };