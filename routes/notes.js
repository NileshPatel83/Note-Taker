const notes = require('express').Router();
const { readFromFile, writeToFile, readAndAppend } = require('../helpers/fsUtils');
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

    //Sends success response with new note.
    res.status(200).json(newNote);

    //Sends bad request response.
    } else {
        res.status(400).json('Error in adding note');
    }
});

//Delete route to delete note with specified id.
notes.delete('/:id', (req, res) => {

    //Checks whether the note id is provided or not. 
    if(req.params.id){

        //Gets note id from route parameters.
        const noteId = req.params.id;

        //Reads existing note data from database file.
        readFromFile(databaseFilePath).then((data) => {
            
            //Converts the data in jason format.
            const extNotes = JSON.parse(data);

            //Tries to find the note with specified id from existing note array.
            const extNote = extNotes.filter(note => note.id === noteId)[0];

            //Checks if note with specified id exist or not.
            if(extNote){

                //Creates a new note array by removing the note with specified id.
                const newNotes = extNotes.filter(note => note.id !== noteId);

                //Overwrites the database file with new notes array (with removed note with speficied id)
                writeToFile(databaseFilePath, newNotes);

                //Sends success response with new notes array.
                res.status(200).json(newNotes);

            //Sends bad request response if note id doesn't match existing notes.
            } else{
                res.status(400).json(`Note ID doesn't match.`);
            }

        });
    
    //Sends bad request response if note id is not provided.
    } else {
        res.status(400).json('Note ID not provided.');
    }
});

module.exports = notes;