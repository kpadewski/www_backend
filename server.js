var express = require('express');
var bodyParser = require('body-parser');
var users = require("./userDatabase");
var cors = require('cors');
var app = express();
// var parser = bodyParser.urlencoded();
var parser = bodyParser.json();
const mongoose = require('mongoose');
const { Schema } = mongoose;


/// POTRZEBNE JESZCZE:
 // zmienianie struktury folderow
   // przenoszenie notatki do innego folderu - ale to sie lapie pod edycje notatki po prostu


///MOZE PODWOJNIE STRINGIFY ROB GDZIES...  patrz czy prawidlowo sie zapisuja notatki wielolinijkowe


app.use(cors());

app.use(parser);

app.use(express.static('public'));

const corsOptions = {
    exposedHeaders: '*',
};

app.use(cors(corsOptions));

//  https://dev.to/danimalphantom/adding-updating-and-removing-subdocuments-with-mongoose-1dj5


mongoose.connect('mongodb+srv://user_kpad_127:hasmongo907uu@cluster0.9nzc1.mongodb.net/notesData?' +
    'retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("successfully connected to mongoDB");
});


//SCHEMAS:  =========================================================================

// const kittySchema = new mongoose.Schema({
//     name: String
// });
// const Kitten = mongoose.model('Kitten', kittySchema);
//
// const blogSchema = new Schema({
//     title:  String, // String is shorthand for {type: String}
//     author: String,
//     body:   String,
//     comments: [{ body: String, date: Date }],
//     date: { type: Date, default: Date.now },
//     hidden: Boolean,
//     meta: {
//         votes: Number,
//         favs:  Number
//     }
// });
//
// const Blog = mongoose.model('Blog', blogSchema);
//
// const tankSchema = new mongoose.Schema({ size: 'string' });
// const Tank = mongoose.model('Tank', tankSchema);
// const small = new Tank({ size: 'small' });
// small.save(function (err) {
//     if (err) return console.log(err);
//     // saved!
// });
// //or
// Tank.create({ size: 'small' }, function (err, small) {
//     if (err) return console.log(err);
//     // saved!
// });
// Tank.find({ size: 'small' }).where('createdDate').gt(oneYearAgo).exec(callback);
// Tank.deleteOne({ size: 'large' }, function (err) {
//     if (err) return handleError(err);
//     // deleted at most one tank document
// });



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




// ==== dodanie uzytkownika

// const newUser = new User({ username: 'user2', password: 'password2', notes: [newNote], directorytree: '[]' });
// newUser.save(function (err) {
//     if (err) console.log(err);
//     //saved!
//     console.log("successfully saved")
// });

// ======= dodanie notatki

// const newNote = new Note({_id: 2, title: 'title2', content: 'content2' });
// User.findOne({username: 'user2'}, function(err, result) {
//     if (!err) {
//         if (!result){
//             console.log('no such user');
//         }
//         else{
//             result.notes.push(newNote);
//             result.markModified('notes');
//             result.save();
//         }
//     } else {
//         console.log("something went wrong");
//     }
// });

// ======= edycja notatki

// let newNoteData = {
//     title: "title1_edited",
//     content: "content1_edited"
// };
// User.findOne({username: 'user2'}, function(err, result) {
//     if (!err) {
//         if (!result){
//             console.log('no such user');
//         }
//         else{
//             result.notes.id(1).title = newNoteData.title;
//             result.notes.id(1).content = newNoteData.content;
//             result.markModified('notes');
//             result.save();
//         }
//     } else {
//         console.log("something went wrong");
//     }
// });

// ======= usuwanie notatki

// User.findOne({username: 'user2'}, function(err, result) {
//     if (!err) {
//         if (!result){
//             console.log('no such user');
//         }
//         else{
//             result.notes.id(1).remove();
//             result.markModified('notes');
//             result.save();
//         }
//     } else {
//         console.log("something went wrong");
//     }
// });

// ========== get all notes

// User.findOne({username: 'user2'}, function(err, result) {
//     if (!err) {
//         if (!result){
//             console.log('no such user');
//         }
//         else{
//             console.log(JSON.stringify(result.notes));
//         }
//     } else {
//         console.log("something went wrong");
//     }
// });

// ============ replace all notes

// User.findOne({username: 'newUserName'}, function(err, result) {
//     if (!err) {
//         if (!result){
//             console.log('no such user');
//         }
//         else{
//             // result.username = "newUserName";
//             // result.markModified('username')
//             // result.save();
//
//             result.notes = JSON.parse('[{"_id":200,"title":"title200","content":"content200"},' +
//                 '{"_id":300,"title":"title300","content":"content300"}]');
//             result.markModified('notes');
//             result.save();
//         }
//     } else {
//         console.log("something went wrong");
//     }
// });

// =========== change folder structure
//
// User.findOne({username: 'user2'}, function(err, result) {
//     if (!err) {
//         if (!result){
//             console.log('no such user');
//         }
//         else{
//             // result.username = "newUserName";
//             // result.markModified('username')
//             // result.save();
//
//             result.directorytree = '[{"_id":1,"title":"folder1", "folders": []}]';
//             result.markModified('directorytree');
//             result.save();
//         }
//     } else {
//         console.log("something went wrong");
//     }
// });



//YYY
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


















//https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS/Errors/CORSMissingAllowOrigin

//TO PONIZSZE: !!!!!!!!!!!!!
  // https://medium.com/zero-equals-false/using-cors-in-express-cac7e29b005b

// app.get('/users', function(req, res) {
//     res.writeHead(200, {
//       //'Content-Type': 'text/plain',
//       'Access-Control-Allow-Origin' : '*',
//       // 'Access-Control-Allow-Origin' : '*',
//       'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
//       'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, Field1',
//       'Access-Control-Allow-Credentials':'true',
//     });
//     users.getUsers((err, data) => {
//         console.log("data: ", data);
//         res.end(JSON.stringify(data));
//     });
// });
// app.get('/add_user__old', function(req, res) {
//     console.log(req.body);
//     users.addUser(req.query.last_name, req.query.first_name);
//     res.end("User added");
// });
// //moje
// app.get('/myResp', function(req, res) {
// //    res.writeHead(200, {
// //      'Content-Type': 'text/plain',
// //      'Access-Control-Allow-Origin' : req.headers.Origin,
// //      'Vary': 'Origin',
// //    });
//     let someText;
//     if (req.headers.field1 === 'a') someText = 'You wanted AAA';
//     else if (req.headers.field1 === 'b') someText = 'You wanted BBB';
//     else someText = 'You wanted something else';
//
//     //someText = req.headers.field1;
//
//     //res.end(someText);
//     res.end(JSON.stringify(someText));
// });
// //moje
// app.put('/myResp', function(req, res) {
//     console.log(req.body.hello);
//     res.end("nic");
// });
// //moje
// app.post('/myResp', function(req, res) {
//     console.log(req.body.hello);
//     res.end("nic");
// })
// //moje
// app.delete('/myResp', function(req, res) {
//     console.log(req.headers.field1);
//     res.end("nic");
// })

// ========================================================================


const listener = app.listen(8080, 
	() => console.log(`Listening on ${ listener.address().port }`));

