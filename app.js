require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect("mongodb://127.0.0.1:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    pass: String,
});


userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ["pass"]});

const User = mongoose.model("User", userSchema);


app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.post("/login", function(req, res) {
    User.findOne({email: req.body.uname})
    .then(function(user) {
        if(user) {
            if(user.pass === req.body.pass) {
                res.render("secrets");
            }
        }
    })
    .catch(function(err) {
        console.log(err);
    })
});

app.post("/register", function(req, res) {
    const registerUser = new User({
        email: req.body.uname,
        pass: req.body.pass,
    })

    registerUser.save()
    .then(function() {
        res.render("secrets");
    })
    .catch(function(err) {
        console.log(err);
    });
});




app.listen("3000", function() {
    console.log("Server started on port 3000");
})