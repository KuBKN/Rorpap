/* Webservice API */

var express = require('express');
// var nodemailer = require('nodemailer');
var router = express.Router();

var mongoose = require("mongoose");
mongoose.connect('mongodb://188.166.180.204/rorpap');

var gcm = require('node-gcm');

var HTTP_CREATED = 201;
var HTTP_FOUND = 302;
var HTTP_NOT_MODIFIED = 304;
var HTTP_NOT_FOUND = 404;
var HTTP_INTERNAL_SERVER_ERROR = 500;

// ================== User ==================
var User = mongoose.model('users', {
    firstname: String,
    lastname: String,
    email: String,
    tel: String,
    password: String,
    dateOfBirth: String,
    status: Number,
    point: Number
});

router.post('/user/create', function(req, res, next) {
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var tel = req.body.tel;
    var password = req.body.password;
    var dateOfBirth = req.body.dateOfBirth;

    var user = new User({firstname: firstname, lastname: lastname, email: email, tel: tel, password: password, dateOfBirth: dateOfBirth, status: 0});
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

router.post('/user/update', function(req, res, next) {
    var _id = req.body._id;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var email = req.body.email;
    var tel = req.body.tel;
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

    if (tel != "" && tel != undefined) {
        User.findOneAndUpdate({_id: _id}, {tel: tel}, function(err, data) {
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

router.post('/user/login', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    var user = new User({email: email, password: password});
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

router.post('/user/enroll', function(req, res, next) {
    var _id = req.body._id;
    User.findOneAndUpdate({_id: _id, status: 0}, {status: '-1'}, function(err, data) {
        console.log(data);
        if (err)
        return res.send(500, { error: err });
        return res.send();
    });
});

router.get('/admin/user_enroll', function(req, res, next) {
    User.find({status: -1}, function(err, users) {
        if (err) {
            res.status(HTTP_INTERNAL_SERVER_ERROR).send();
        }
        res.send(users);
    })
});

router.post('/admin/user_accept', function(req, res, next) {
    var _id = req.body._id;

    User.findOneAndUpdate({_id: _id, status: -1}, {status: 1}, function(err, data) {
        if (err)
        return res.send(500, { error: err });
        return res.send();
    });
});

router.post('/admin/user_reject', function(req, res, next) {
    var _id = req.body._id;

    console.log(_id);

    User.findOneAndUpdate({_id: _id, status: -1}, {status: 0}, function(err, data) {
        if (err)
        return res.send(500, { error: err });
        return res.send();
    });
});

/*router.get('/user/', function(req, res, next) {
User.find(function(err, users) {
if (err) {
res.status(HTTP_INTERNAL_SERVER_ERROR).send();
}
res.send(users);
})
});*/

router.get('/user/get/:id', function(req, res, next) {
    var _id = req.params.id;

    User.find({_id: _id}, {firstname: true, lastname: true, email: true, tel: true, dateOfBirth: true, tel: true, status: true, point: true}, function(err, users) {
        if (err) {
            res.status(HTTP_INTERNAL_SERVER_ERROR).send();
        }
        res.send(users);
    })
});


// ================== Request ==================

var Request = mongoose.model('requests', {
    sender_id: String,
    messenger_id: String,

    recipient_name: String,
    recipient_email: String,
    recipient_tel: String,
    psize: String,
    weight: String,
    declarable: Boolean,

    type: String,
    hasAccept: Boolean,
    fromLoc: String,
    toLoc: String,
    reqLimitDate: String,
    reqLimitTime: String,
    shipLimitDate: String,
    shipLimitHour: String,
    shipLimitTime: String,
    price: String,
    comment: String
});

router.post('/request/create', function(req, res, next) {
    var sender_id = req.body.sender_id;
    var type = 'Pending';
    var hasAccept = false;
    var fromLoc = req.body.fromLoc;
    var toLoc = req.body.toLoc;
    var messenger_id = req.body.messenger_id;
    // var now = new Date();
    var reqLimitDate = '01/01/2011'; //now.format('DD/MM/YYYY');
    var reqLimitTime = '01:01'; //now.format('mm:hh');
    var shipLimitDate = req.body.shipLimitDate;
    var shipLimitHour = req.body.shipLimitHour;
    var shipLimitTime = req.body.shipLimitTime;
    var recipient_name = req.body.recipient_name;
    var recipient_email = req.body.recipient_email;
    var recipient_tel = req.body.recipient_tel;
    var psize = req.body.psize;
    var weight = req.body.weight;
    var declarable = req.body.declarable;
    var price = req.body.price;
    var comment = req.body.comment;

    var request = new Request({ sender_id: sender_id,
        type: type,
        hasAccept: hasAccept,
        recipient_name: recipient_name,
        recipient_email: recipient_email,
        recipient_tel: recipient_tel,
        psize: psize,
        weight: weight,
        declarable: declarable,
        fromLoc: fromLoc,
        toLoc: toLoc,
        reqLimitDate: reqLimitDate,
        reqLimitTime: reqLimitTime,
        shipLimitDate: shipLimitDate,
        shipLimitHour: shipLimitHour,
        shipLimitTime: shipLimitTime,
        price: price,
        comment: comment});
        // res.send(request);
        request.save(function(err) {
            if (err) {
                res.status(HTTP_INTERNAL_SERVER_ERROR).send();
            }
            res.status(HTTP_CREATED).send();
        });
    });

router.post('/request/update', function(req, res, next) {
    var _id = req.body._id;
    var sender_id = req.body.sender_id;
    var type = 'Pending';
    var hasAccept = false;
    var fromLoc = req.body.fromLoc;
    var toLoc = req.body.toLoc;
    var messenger_id = req.body.messenger_id;
    var reqLimitDate = '01/01/2011'; //now.format('DD/MM/YYYY');
    var reqLimitTime = '01:01'; //now.format('mm:hh');
    var shipLimitDate = req.body.shipLimitDate;
    var shipLimitHour = req.body.shipLimitHour;
    var shipLimitTime = req.body.shipLimitTime;
    var recipient_name = req.body.recipient_name;
    var recipient_email = req.body.recipient_email;
    var recipient_tel = req.body.recipient_tel;
    var psize = req.body.psize;
    var weight = req.body.weight;
    var declarable = req.body.declarable;
    var price = req.body.price;
    var comment = req.body.comment;
    console.log('suc');

    Request.findOneAndUpdate({_id: _id},
     {fromLoc: fromLoc,
        toLoc: toLoc,
        shipLimitDate: shipLimitDate,
        shipLimitHour: shipLimitHour,
        shipLimitTime: shipLimitTime,
        recipient_name: recipient_name,
        recipient_email: recipient_email,
        recipient_tel: recipient_tel,
        psize: psize,
        weight: weight,
        declarable: declarable,
        price: price,
        comment: comment},
        function(err, data) {
            if (err)
            return res.send(500, { error: err });
            return res.send();
        });
    });


    router.get('/request/get_request/:reqtype/:sender_id', function(req, res, next) {
        var reqtype = req.params.reqtype;
        var sender_id = req.params.sender_id;
        if (sender_id.charAt(0)=='!') {
            sender_id = {$ne: sender_id.substring(1)};
        };

        Request.find({sender_id: sender_id, type: {$regex: '.*' + reqtype + '.*'}}, null, {sort: {type: -1, reqLimitDate: -1}}, function(err, requests) {
            if (err) {
                res.status(HTTP_INTERNAL_SERVER_ERROR).send();
            }
            else {
                res.status(200).send(requests);
            }
        });
    });

    router.get('/request/get_quest/:reqtype/:messenger_id', function(req, res, next) {
        var reqtype = req.params.reqtype;
        var messenger_id = req.params.messenger_id;
        if (messenger_id.charAt(0)=='!') {
            messenger_id = {$ne: messenger_id.substring(1)};
        };

        Request.find({messenger_id: messenger_id, type: {$regex: '.*' + reqtype + '.*'}}, null, {sort: {type: -1, reqLimitDate: -1}}, function(err, requests) {
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

    router.post('/request/accept/:messenger_id/:request_id', function(req, res, next) {
        var _id = req.params.request_id;
        var messenger_id = req.params.messenger_id;

        Request.findOneAndUpdate({_id: _id, type: 'Reserved'}, {type: 'Inprogress', messenger_id: messenger_id}, function(err, data) {
            if (err)
            return res.send(500, { error: err });
            return res.send();
        });
    });

    router.post('/request/reserve/:messenger_id/:request_id', function(req, res, next) {
        var _id = req.params.request_id;
        var messenger_id = req.params.messenger_id;

        Request.findOneAndUpdate({_id: _id, type: 'Pending'}, {type: 'Reserved', messenger_id: messenger_id}, function(err, data) {
            if (err)
            return res.send(500, { error: err });
            return res.send();
        });
    });

    router.post('/request/finish/', function(req, res, next) {
        var _id = req.body._id;

        Request.findOneAndUpdate({_id: _id, type: 'Inprogress'}, {type: 'Finished'}, function(err, data) {
            if (err)
            return res.send(500, { error: err });
            return res.send();
        });
    });


    // ================== Request ==================

    var Tracking = mongoose.model('trackings', {
        request_id: String,
        date: String,
        location: String
    });

    router.post('/tracking/update', function(req, res, next) {
        console.log(1)
        var user_id = req.body.user_id;
        var date = req.body.date;
        var location = req.body.location;
        console.log(user_id + " " + date + " " + location);

        var request = new Request({messenger_id: user_id});

        Request.find({messenger_id: user_id, type: "Inprogress"}, function(err, quests) {
            console.log('a')
            if (err) {
                console.log('b')
                res.status(HTTP_INTERNAL_SERVER_ERROR).send();
            }
            else {
                console.log(quests)
                for (var i = 0; i < quests.length; i++) {
                    console.log('d' + i)
                    var request_id = quests[i]._id;
                    var tracking = new Tracking({request_id: request_id, date: date, location: location});
                    console.log(request_id);
                    tracking.save(function(err) {
                        console.log('e')
                        if (err) {
                            console.log('f')
                            res.status(HTTP_INTERNAL_SERVER_ERROR).send();
                        }
                        console.log('g')
                        res.status(HTTP_CREATED).send();
                    });
                }
                res.status(200).send();
            }
        });

    });

    router.get('/tracking/:id', function(req, res, next) {
        var request_id = req.params.id;
        Tracking.find({request_id: request_id}, function(err, trackings) {
            if (err) {
                res.status(HTTP_INTERNAL_SERVER_ERROR).send();
            }

            res.send(trackings);
        })
    });

    //===================Request Acceptance==================
    var Acceptance = mongoose.model('accepts', {
        request_id: String,
        messenger_id: String
    });

    router.get('/acceptance/getbyreq/:request_id', function(req, res, next) {
        var request_id = req.params.request_id;
        Acceptance.find({request_id: request_id}, function(err, acceptances) {
            if (err) {
                res.status(HTTP_INTERNAL_SERVER_ERROR).send();
            }
            res.send(acceptances);
        });
    });

    router.get('/acceptance/getbymess/:messenger_id', function(req, res, next) {
        var messenger_id = req.params.messenger_id;
        Acceptance.find({messenger_id: messenger_id}, function(err, acceptances) {
            if (err) {
                res.status(HTTP_INTERNAL_SERVER_ERROR).send();
            }
            res.send(acceptances);
        });
    });

    router.post('/acceptance/add/:messenger_id/:request_id', function(req, res, next) {
        var messenger_id = req.params.messenger_id;
        var request_id = req.params.request_id;
        Request.findOneAndUpdate({_id: request_id, type: 'Pending'}, { hasAccept: true }, function(err, data) {
            if (err)
                return res.send(500, { error: err });
            else{
                var acceptance = new Acceptance({request_id: request_id, messenger_id: messenger_id});
                acceptance.save(function(err) {
                    console.log('e')
                    if (err) {
                        console.log('f')
                        res.status(HTTP_INTERNAL_SERVER_ERROR).send();
                    }
                    console.log('g')
                    res.status(HTTP_CREATED).send();
                });

                return res.send();
            };
        });
    });

    router.post('/acceptance/remove', function(req, res, next) {
        var request_id = req.body.request_id;
        var messenger_id = req.body.messenger_id;
        var request_count;
        Acceptance.remove({request_id: request_id, messenger_id: messenger_id}, function(err) {
            if (err) {
                res.status(HTTP_INTERNAL_SERVER_ERROR).send();
            }
            else {
                Acceptance.find({request_id: request_id}, function(err, acceptances) {
                    if (err) {
                        res.status(HTTP_INTERNAL_SERVER_ERROR).send();
                    }else{
                        if(acceptances.length==0){
                            Request.findOneAndUpdate({_id: request_id},{ hasAccept: false }, function(err, data) {
                                if (err)
                                    return res.send(500, { error: err });
                            });
                        }

                    }

                });
                res.status(200).send();
            }
        });
    });

    // ================== Mail =================

    router.post('/mailservice', function(req, res, next) {
        // var transporter = nodemailer.createTransport(transport[, defaults]);
        res.JSON({ res: 'test mail'});
    });

    // ================== GCM ==================

    var GCM = mongoose.model('gcms', {
        user_id: String,
        token: String
    });

    router.post('/gcm/register', function(req, res, next) {
        var user_id = req.body.user_id;
        var token = req.body.token;

        var gcm = new GCM({user_id: user_id, token: token});
        console.log(JSON.stringify(gcm));
        gcm.save(function(err) {
            if (err) {
                res.status(HTTP_INTERNAL_SERVER_ERROR).send();
            }
            res.status(HTTP_CREATED).send();
        });
    });

    router.post('/gcm/push', function(req, res, next) {
        var type = req.body.type;
        var signal = req.body.signal;
        var title = req.body.title;
        var content = req.body.content;
        // var device_tokens = req.body.device_tokens;
        var device_tokens = ["APA91bFoAWdARBc2y9F8dQ03P12NA-yFGAExwSNlMrUxwfbZAmzxIuAdeqoOpC62cogzStiR7YB7MbwGP-uDJdnatoaoFBSpUwAwHlnJ7Nx9ea0shegVLx3cUUEgFpzR-fUit-IWjUOX"]; //create array for storing device tokens
        var retry_times = 4; //the number of times to retry sending the message if it fails

        var sender = new gcm.Sender('AIzaSyAfx5LifSQtCuxr86ZgVOg5b4VzAauLCDM'); //create a new sender
        var message = new gcm.Message(); //create a new message

        message.addData('type', type);
        message.addData('signal', signal);
        message.addData('title', title);
        message.addData('content', content);

        message.collapseKey = 'testing'; //grouping messages
        message.delayWhileIdle = true; //delay sending while receiving device is offline
        message.timeToLive = 3; //the number of seconds to keep the message on the server if the device is offline


        // device_tokens.push(device_token);
        sender.send(message, device_tokens, retry_times, function(result){
            console.log(result);
            console.log('push sent to: ' + device_tokens);
        });
        res.send(JSON.stringify({sender: sender, message: message}));
    });



    module.exports = router;
