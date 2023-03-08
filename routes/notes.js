const notes = require('express').Router();
const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');
const databaseFilePath = './db/db.json';

//GET route to retrive all notes.
notes.get('/', (req, res) => {

    //Reads all notes from databse file and sends the response as jason data.
    readFromFile(databaseFilePath).then((data) => res.json(JSON.parse(data)));
});

//POST route to add new note to database file.
notes.post('/', (req, res) => {

    //Deconstructs the body to get note title and note text.
    const {title, text} = req.body;

    //Checks whether request body contains note title and text or not.
    if (title && text) {

        //Creates new note object from note title and text.
        //Note id is assigned using helper function.
        const newNote = {
            title,
            text,
            id: uuid(),
    };

    //Adds the new note to current database file.
    readAndAppend(newNote, databaseFilePath);

    //Sends success status.
    res.status(200).json(newNote);

    //Sends bad request status.
    } else {
        res.status(400).json('Error in adding note');
    }
});

module.exports = notes;