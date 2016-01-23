/* Webservice API */

var express = require('express');
var router = express.Router();

var mongoose = require("mongoose");
mongoose.connect('mongodb://188.166.180.204/rorpap');

var HTTP_CREATED = 201;
var HTTP_NOT_MODIFIED = 304;
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
 */
router.post('/user', function(req, res, next) {
    // console.log(22);
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;
    var dateOfBirth = req.body.dateOfBirth;

    console.log(req.body);


    var user = new User({firstname: firstname, lastname: lastname, email: email, password: password, dateOfBirth: dateOfBirth});
    console.log(user);

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
