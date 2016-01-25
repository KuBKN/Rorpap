/* Webservice API */

var express = require('express');
var router = express.Router();

var mongoose = require("mongoose");
mongoose.connect('mongodb://188.166.180.204/rorpap');

var HTTP_CREATED = 201;
var HTTP_FOUND = 302;
var HTTP_NOT_MODIFIED = 304;
var HTTP_NOT_FOUND = 404;
var HTTP_INTERNAL_SERVER_ERROR = 500;

var User = mongoose.model('users', {firstname: String, lastname: String, email: String, password: String, dateOfBirth: String});

/*
 POST /user
 add user to sign up
 body: user = {firstname: String,
            lastname: String,
            email: String,
            password: String,
            dateOfBirth: String}
 return:
  500 Internal Server Error: error occur
  304 Not Modified: already signed up
  201 Created: success signing up
 */
router.post('/user', function(req, res, next) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;
    var dateOfBirth = req.body.dateOfBirth;

    var user = new User({firstname: firstname, lastname: lastname, email: email, password: password, dateOfBirth: dateOfBirth});
    User.find({email: email, password: password}, function(err, users) {
        if (err) {
            res.status(HTTP_INTERNAL_SERVER_ERROR).send();
        }
        else {
            if (users.length) {
                res.status(HTTP_NOT_MODIFIED).send();
            }
            else {
                user.save(function(err) {
                    if (err) {
                        res.status(HTTP_INTERNAL_SERVER_ERROR).send();
                    }
                    res.status(HTTP_CREATED).send();
                });
            }
        }
    });
});

/*
 POST /user/login
 add user to sign up
 body: user = {email: String,
            password: String}
 return:
  500 Internal Server Error: error occur
  302 Found: found user
  404 Not Found: not found user
 */
router.post('/user/login', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    var user = new User({email: email, password: password});
    console.log(user);
    User.find({email: email, password: password}, {_id: 1}, function(err, users) {
        if (err) {
            res.status(HTTP_INTERNAL_SERVER_ERROR).send();
        }
        else {
            if (users.length) {
                // temp = 200, actually 302
                res.status(200).send(users);
            }
            else {
                res.status(HTTP_NOT_FOUND).send();
            }
        }
    });
});

 /*
  GET /user
  get all users
  */
 router.get('/user', function(req, res, next) {
     User.find(function(err, users) {
         if (err) {
             res.status(HTTP_INTERNAL_SERVER_ERROR).send();
         }
         res.send(users);
     })
 });

//
// /*
//  GET /user/:id
//  get user by id
//  param: id user id
//  */
// router.get('/user/:id', function(req, res, next) {
//     var id = req.params.id;
// });

module.exports = router;
