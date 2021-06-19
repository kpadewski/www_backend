var express = require('express');
var bodyParser = require('body-parser');
var users = require("./userDatabase");
var cors = require('cors');
var app = express();
// var parser = bodyParser.urlencoded();
var parser = bodyParser.json();
const mongoose = require('mongoose');
const { Schema } = mongoose;


app.use(cors());

app.use(parser);

app.use(express.static('public'));

const corsOptions = {
    exposedHeaders: '*',
};

app.use(cors(corsOptions));

mongoose.connect('mongodb+srv://user_kpad_127:hasmongo907uu@cluster0.9nzc1.mongodb.net/notesData?' +
    'retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("successfully connected to mongoDB");
});





const noteSchema = new Schema({
    _id: Number,
    title: String,
    content: String,
    creationdate: Date,
    modificationdate: Date,
    folder: Number,
});
const Note = mongoose.model('Note', noteSchema);
const userSchema = new Schema({
    username: String,
    password: String,
    notes: [noteSchema],
    directorytree: String,
});
const User = mongoose.model('User', userSchema);




app.post('/createuser', function(req, res) {
    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
        notes: req.body.notes,
        directorytree: req.body.directorytree,
    });
    User.findOne({username: req.body.username}, function(err, result) {
        if (!err) {
            if (!result){
                newUser.save(function (err) {
                    if (err) console.log(err);
                });
                res.end("Registration successful, you can now sign in");
            }
            else{
                res.end("This username is already taken")
            }
        } else {
            res.end("Something went wrong");
        }
    });
});

app.post('/addnote', function(req, res) {
    const newNote = new Note({
        _id: req.body.note.id,
        title: req.body.note.title,
        content: req.body.note.content,
        creationdate: req.body.note.creationdate,
        modificationdate: req.body.note.modificationdate,
        folder: req.body.note.folder,
    });
    User.findOne({username: req.body.username, password: req.body.password}, function(err, result) {
        if (!err) {
            if (!result){
                console.log('wrong user or password');
            }
            else{
                result.notes.push(newNote);
                result.markModified('notes');
                result.save();
            }
        } else {
            console.log("something went wrong");
        }
    });
    console.log("note added");
});

app.put('/editnote', function(req, res) {
    User.findOne({username: req.body.username, password: req.body.password}, function(err, result) {
        if (!err) {
            if (!result){
                console.log('wrong user or password');
            }
            else{
                result.notes.id(req.body.note.id).title = req.body.note.title;
                result.notes.id(req.body.note.id).content = req.body.note.content;
                result.notes.id(req.body.note.id).creationdate = req.body.note.creationdate;
                result.notes.id(req.body.note.id).modificationdate = req.body.note.modificationdate;
                result.notes.id(req.body.note.id).folder = req.body.note.folder;
                result.markModified('notes');
                result.save();
            }
        } else {
            console.log("something went wrong");
        }
    });

});

app.delete('/deletenote', function(req, res) {
    User.findOne({username: req.headers.username, password: req.headers.password}, function(err, result) {
        if (!err) {
            if (!result){
                console.log('wrong user or password');
            }
            else{
                result.notes.id(req.headers.noteid).remove();
                result.markModified('notes');
                result.save();

                console.log("note deleted");
            }
        } else {
            console.log("something went wrong");
        }
    });
});

app.get('/getallnotes', function(req, res) {
    User.findOne({username: req.headers.username, password: req.headers.password}, function(err, result) {
        if (!err) {
            if (!result){
                res.end('Wrong user or password');
            }
            else{
                res.set('directorytree', result.directorytree);
                res.end(JSON.stringify(JSON.stringify(result.notes)));
            }
        } else {
            res.end("Something went wrong");
        }
    });
});

app.put('/replaceallnotes', function(req, res) {
    User.findOne({username: req.body.username, password: req.body.password}, function(err, result) {
        if (!err) {
            if (!result){
                console.log('wrong user or password');
            }
            else{
                result.notes = JSON.parse(req.body.notes);
                result.markModified('notes');
                result.save();

                console.log("replaced all notes");
            }
        } else {
            console.log("something went wrong");
        }
    });
});
app.put('/changedirectorytree', function(req, res) {
    User.findOne({username: req.body.username, password: req.body.password}, function(err, result) {
        if (!err) {
            if (!result){
                console.log('wrong user or password');
            }
            else{
                result.directorytree = req.body.directorytree;
                result.markModified('notes');
                result.save();

                console.log("changed directory tree");
            }
        } else {
            console.log("something went wrong");
        }
    });
});

const listener = app.listen(8080, 
	() => console.log(`Listening on ${ listener.address().port }`));

