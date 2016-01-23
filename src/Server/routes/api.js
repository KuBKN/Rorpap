/* Webservice API */

var express = require('express');
var router = express.Router();

var mongoose = require("mongoose");
mongoose.connect('mongodb://188.166.180.204/rorpap');

var HTTP_CREATED = 201;
var HTTP_NOT_MODIFIED = 304;
var HTTP_INTERNAL_SERVER_ERROR = 500;
var User = mongoose.model('users', {firstname: String, lastname: String, emailAddress: String, password: String, dateOfBirth: String});

/*
 POST /user
 add user to sign up
 body: user = {firstname: String,
            lastname: String,
            emailAddress: String,
            password: String,
            dateOfBirth: String}
 */
router.post('/user', function(req, res, next) {
    console.log(22);
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var emailAddress = req.body.emailAddress;
    var password = req.body.password;
    var dateOfBirth = req.body.dateOfBirth;


    var user = new User({firstname: firstname, lastname: lastname, emailAddress: emailAddress, password: password, dateOfBirth: dateOfBirth});
    console.log(user);

    User.find({emailAddress: emailAddress, password: password}, function(err, users) {
        if (err) {
            console.log(1);
        }
        else {
            if (users.length) {
                res.status(HTTP_NOT_MODIFIED).send();
            }
            else {
                user.save(function(err) {
                    if (err) {
                        res.status(HTTP_INTERNAL_SERVER_ERROR).send(2);
                    }
                    res.status(HTTP_CREATED).send();
                });
            }
        }
    });

    console.log(0);
});

/*
 GET /user
 get all users
 */
router.get('/user', function(req, res, next) {
    User.find(function(err, users) {
        if (err) {
            res.send('nok2');
        }

        console.log(users);
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
