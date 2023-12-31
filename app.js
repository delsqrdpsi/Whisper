//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
// const md5 = require('md5');
const bcrypt = require('bcrypt');

const mongoose = require('mongoose');
// var encrypt = require('mongoose-encryption');
const saltRounds = 10;



const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.static("views"));

mongoose.connect('mongodb://127.0.0.1:27017/UsersDB');

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});

// userSchema.plugin(encrypt, { secret: process.env.SECRET, encryptedFields: ['password']});


const User = mongoose.model('User', userSchema);


app.get("/", function(req, res){
  res.render("home");
});


app.route("/login")
.get( function(req, res){
    res.render("login");
  })
.post(function(req, res){
  
    const username = req.body.username;
    const password  = req.body.password;

    User.findOne({username: username}).then(foundUser =>{
        
        if(!foundUser){
            res.render("login");
            console.log("User not found");
        }else{
            bcrypt.compare(password, foundUser.password, function(err, result) {
                // result == true
                if(result){
                    res.render("secrets");
                }else{
                    res.render("login");
                    console.log("Wrong password");
                }
            });

            // if(foundUser.password === password){
            //     res.render("secrets");
            // }else{
            //     res.render("login");
            //     console.log("Wrong password");            
            // }
        }
    });

})

app.route("/register")
.get(function(req, res){
    res.render("register");

  })

.post(function(req, res){

    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const username = req.body.username;
        const password  = hash;
    User.create({username:username, password : password}).then(result=>{
        if(result){
            res.render("login");
        }else{
            res.render("register");
        }
        });

    });

    
});



app.listen(3000, function() {
    console.log("Server started on port 3000");
});
