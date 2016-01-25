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

var User = mongoose.model('users', {
    firstname: String,
    lastname: String,
    email: String,
    password: String,
    dateOfBirth: String
});

var Request = mongoose.model('requests', {
    sender_id: String,
    messenger_id: String,
    receiver_id: String,
    type: String,
    image: String,
    title: String,
    fromLoc: String,
    toLoc: String,
    reqLimitDate: String,
    reqLimitTime: String,
    shipLimitDate: String,
    shipLimitHour: String,
    shipLimitTime: String,
    receiver: String,
    vehicles: String,
    price: String,
    comment: String});

/*
 POST /user
 add user to sign up
 body: user = {
            firstname: String,
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
    User.find({email: email}, function(err, users) {
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
 body: user = {
            email: String,
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


/*
 POST /request
 add user to sign up
 body: request = {
            sender_id: String,
            image: String,
            title: String,
            fromLoc: String,
            toLoc: String,
            shipLimitDate: String,
            shipLimitHour: String,
            shipLimitTime: String,
            receiver: String,
            vehicles: String,
            price: String,
            comment: String}
 return:
  500 Internal Server Error: error occur
  201 Created: success creating request
 */
router.post('/request', function(req, res, next) {
    var sender_id = req.body.sender_id;
    var type = 'Pending';
    var image = 'temp';
    var title = req.body.title;
    var fromLoc = req.body.fromLoc;
    var toLoc = req.body.toLoc;
    // var now = new Date();
    var reqLimitDate = '01/01/2011'; //now.format('DD/MM/YYYY');
    var reqLimitTime = '01:01'; //now.format('mm:hh');
    var shipLimitDate = req.body.shipLimitDate;
    var shipLimitHour = req.body.shipLimitHour;
    var shipLimitTime = req.body.shipLimitTime;
    var receiver = req.body.receiver;
    var vehicles = req.body.vehicles;
    var price = req.body.price;
    var comment = req.body.comment;

    var request = new Request({sender_id: sender_id, type: type, image: image, title: title, fromLoc: fromLoc, toLoc: toLoc, reqLimitDate: reqLimitDate, reqLimitTime: reqLimitTime, shipLimitDate: shipLimitDate, shipLimitHour: shipLimitHour, shipLimitTime: shipLimitTime, receiver: receiver, vehicles: vehicles, price: price, comment: comment});
    // res.send(request);
    request.save(function(err) {
        if (err) {
            res.status(HTTP_INTERNAL_SERVER_ERROR).send();
        }
        res.status(HTTP_CREATED).send();
    });
});

/*
 GET /request/:sender_id
 get requests by sender's id
 param: sender's id
 */
router.get('/request/:sender_id', function(req, res, next) {
    var sender_id = req.params.sender_id;

    Request.find({sender_id: sender_id}, function(err, requests) {
        if (err) {
            res.status(HTTP_INTERNAL_SERVER_ERROR).send();
        }
        else {
            if (requests.length) {
                // temp = 200, actually 302
                res.status(200).send(requests);
            }
            else {
                res.status(HTTP_NOT_FOUND).send();
            }
        }
    });
});

module.exports = router;
