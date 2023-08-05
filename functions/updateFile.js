async function updateFile (username, newUser, Model) {
	newUser.modifiedAt = Math.floor(new Date().getTime() / 1000); 
    const data = await Model.findOneAndUpdate({ username: username }, newUser, { new: true });
    return { status: 200, message: 'File updated', data };
}

module.exports = updateFile;