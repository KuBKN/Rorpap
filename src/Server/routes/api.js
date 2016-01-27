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
    dateOfBirth: String,
    status: Number
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


router.post('/user/update', function(req, res, next) {
    var _id = req.body._id;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var password = req.body.password;

    if (firstname != "" && firstname != undefined) {
        User.findOneAndUpdate({_id: _id}, {firstname: firstname}, function(err, data) {
            if (err)
                return res.send(500, { error: err });
            return res.send();
        });
    }

    if (lastname != "" && lastname != undefined) {
        User.findOneAndUpdate({_id: _id}, {lastname: lastname}, function(err, data) {
            if (err)
                return res.send(500, { error: err });
            return res.send();
        });
    }

    if (email != "" && email != undefined) {
        User.findOneAndUpdate({_id: _id}, {email: email}, function(err, data) {
            if (err)
                return res.send(500, { error: err });
            return res.send();
        });
    }

    if (password != "" && password != undefined) {
        User.findOneAndUpdate({_id: _id}, {password: password}, function(err, data) {
            if (err)
                return res.send(500, { error: err });
            return res.send();
        });
    }
});

router.post('/user/enroll', function(req, res, next) {
    var _id = req.body._id;
    User.findOneAndUpdate({_id: _id, status: 0}, {status: '-1'}, function(err, data) {
        console.log(data);
        if (err)
            return res.send(500, { error: err });
        return res.send();
    });
});

router.get('/user/enroll', function(req, res, next) {
    User.find({status: -1}, function(err, users) {
        if (err) {
            res.status(HTTP_INTERNAL_SERVER_ERROR).send();
        }
        res.send(users);
    })
});

router.post('/user/accept', function(req, res, next) {
    var _id = req.body._id;

    User.findOneAndUpdate({_id: _id, status: -1}, {status: 2}, function(err, data) {
        if (err)
            return res.send(500, { error: err });
        return res.send();
    });
});

router.post('/user/reject', function(req, res, next) {
    var _id = req.body._id;

    console.log(_id);

    User.findOneAndUpdate({_id: _id, status: -1}, {status: 0}, function(err, data) {
        if (err)
            return res.send(500, { error: err });
        return res.send();
    });
});

router.get('/user', function(req, res, next) {
    User.find(function(err, users) {
        if (err) {
            res.status(HTTP_INTERNAL_SERVER_ERROR).send();
        }
        res.send(users);
    })
});


router.get('/user/:id', function(req, res, next) {
    var _id = req.params.id;

    User.find({_id: _id}, {firstname: true, lastname: true, email: true, status: true}, function(err, users) {
        if (err) {
            res.status(HTTP_INTERNAL_SERVER_ERROR).send();
        }
        res.send(users);
    })
});


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


router.get('/request/:reqtype/:sender_id', function(req, res, next) {
    var reqtype = req.params.reqtype;
    var sender_id = req.params.sender_id;



    Request.find({sender_id: sender_id, type: {$regex: '.*' + reqtype + '.*'}}, function(err, requests) {
        if (err) {
            res.status(HTTP_INTERNAL_SERVER_ERROR).send();
        }
        else {
            res.status(200).send(requests);
        }
    });
});

router.post('/request/remove', function(req, res, next) {
    var _id = req.body._id;

    Request.remove({_id: _id}, function(err) {
        if (err) {
            res.status(HTTP_INTERNAL_SERVER_ERROR).send();
        }
        else {
            res.status(200).send();
        }
    });
});

module.exports = router;
