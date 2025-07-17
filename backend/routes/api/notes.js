
/*
    API Routes for retrieve, create, edit and delete notes
    - Before accessing each endpoint validate session login
    - Before accessing each endpoint validate ownship of notes
    
    - GET / - Retrieve all the notes of the user currently logged in
    - GET /:id - Retrieve one note by ID
    - POST / - Create a new note
    - PATCH /:id - Update note by id
    - DELETE /:id - Delete note by id
*/
const notesRouter = require("express").Router();
const { where } = require("sequelize");
// require notes and users model
const { User, Entry } = require("../../db/models");
// require auth
const { requireAuth } = require("../../utils/auth");


// mount middleware
notesRouter.use(requireAuth);

// validating Ownership of note
const validateOwnership = async (req, res, next) => {
    // get user id
    const userId = req.user.id;
    // get note id
    const noteId = req.params.noteId;

    const note = await Entry.findOne({
        where: {
            id: noteId
        }
    });

    if(Number(note.userId) === Number(userId)) return next();

    const err = new Error("You're not allowed to dispose of this note.");
    err.status = 403;
    err.title = "Not allowed";
    err.errors = { notAllowed: "Sorry you're not allowed to dispose of this note." }
    return next(err);
};

// GET /
// Retrieve all notes from user
notesRouter.get("/", async (req, res, next) => {
    // get the ID of the user
    const userId = req.user.id;

    // get the notes
    const notes = await User.findByPk(userId, {
        include: Entry
    })

    res.status(200).json({ notes });
});

// GET /:id
// Retrieve a single note by id
notesRouter.get("/:noteId", validateOwnership, async (req, res, next) => {
    // note id requests
    const noteId = req.params.noteId;
    // user Id
    const userId = req.user.id;

    // find the note
    const note = await Entry.findOne({
        where: {
            id: noteId,
            userId: userId
        }
    })

    res.status(200).json(note);
});



// POST / - Create a new note
notesRouter.post("/", async (req, res, next) => {
    // userId title description category
    const { title, description, category } = req.body;
    // get the id of the user creating the note
    const userId = req.user.id;
    const user = await User.findByPk(userId);

    // add the note to the entry table
    const noteCreated = await user.createEntry({
        title: title,
        ...(description && {description}),
        ...(description && {category})
    });

    const safeNote = {
        title: title,
        ...(description && {description}),
        ...(description && {category})
    }

    res.status(201).json(safeNote);
});

// PATCH /:id - Update note by id
notesRouter.patch("/:noteId", validateOwnership, async (req, res, next) => {
    // get the values to update
    const { title, description, category } = req.body;

    // prepare the object with values to update
    const fieldsToUpdate = {
        ...( title && { title }),
        ...( description && { description }),
        ...( category && { category })
    }

    // get id of the note
    const noteId = req.params.noteId;
    // get the note
    const note = await Entry.findByPk(noteId);

    // update
    await Entry.update(
        fieldsToUpdate,
        { where: { id: noteId } }
    )

    // retrieve the just updated note
    const noteToResponse = await Entry.findByPk(noteId);

    res.status(201).json(noteToResponse);
});


// DELETE /:id - Delete note by id
notesRouter.delete("/:noteId", validateOwnership, async (req, res, next) => {
    const noteId = req.params.noteId;
    const note = await Entry.findByPk(noteId);

    await note.destroy();

    return res.status(202).json({ message: "Note successful deleted"});
});

module.exports = notesRouter;