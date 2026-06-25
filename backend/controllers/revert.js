const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);
 
async function revertRepo(commitId){
	const repoPath = path.resolve(process.cwd(), ".devGit");
	const commitsPath = path.join(repoPath, "commits");

	try{
		const commitDir = path.join(commitsPath, commitId);
		const files = await readdir(commitDir);
		const parentDir = path.resolve(repoPath, "..");

		for(const file of files){
			await copyFile(path.join(commitDir, file), path.join(parentDir, file));
		}
		console.log(`Commit ${commitId} reverted successfully`);
	}catch(error){
		console.log('unable to revert: ', error);
	}
	console.log("commitId:", commitId);
}

module.exports = { revertRepo };
