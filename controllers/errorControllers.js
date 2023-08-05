const { Error } = require('../db/models');

// GET method
const getErrors = async (req, res) => {
    const errors = await Error.find();
    if (!errors) return res.status(200).json({ message: 'No errors found' });
    return res.status(200).json(errors);
}