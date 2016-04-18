/* Webservice API */

var express = require('express');
var Mailgun = require('mailgun-js');
var router = express.Router();

var mongoose = require("mongoose");
mongoose.connect('mongodb://188.166.180.204/rorpap');

// var mongoosePaginate = require('mongoose-paginate');
// mongoose.plugin(mongoosePaginate);

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
    point: Number,
    date: {
        type: String,
        default: Date.now()
    }
});

var Admin = mongoose.model('admins', {
    email: String,
    password: String,
    date: {
        type: String,
        default: Date.now()
    }
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

router.post('/admin/login', function(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    var admin = new Admin({email: email, password: password});
    console.log(JSON.stringify(admin));
    Admin.find({email: email, password: password}, {_id: 1}, function(err, users) {
        if (err) {
            res.status(HTTP_INTERNAL_SERVER_ERROR).send();
        }
        else {
            if (users.length) {
                res.status(200).send(users);
            }
            else {
                res.status(HTTP_NOT_FOUND).send();
            }
        }
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

// npm install mongoose-paginate

// router.get('/user/get/:limit/:page', function(req, res, next) {
//     var limit = req.params.limit;
//     var page = req.params.page;
//
//
//     User.paginate({}, { page: page, limit: limit }, function(err, data) {
//         res.send(data);
//     });
// });

// var User = mongoose.model('users', {
//     firstname: String,
//     lastname: String,
//     email: String,
//     tel: String,
//     password: String,
//     dateOfBirth: String,
//     status: Number,
//     point: Number
// });

router.get('/user/get', function(req, res, next) {

    User.find({}, function(err, users) {
        if (err) {
            res.status(HTTP_INTERNAL_SERVER_ERROR).send();
        }
        res.send(users);
    })
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
    img: String,
    size_w: String,
    size_l: String,
    size_h: String,
    weight: String,
    disclosure: Boolean,

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
    comment: String,
    date: {
        type: String,
        default: Date.now() // `Date.now()` returns the current unix timestamp as a number
    }
});

router.post('/request/create', function(req, res, next) {
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

    var img = req.body.img;
    var size_w = req.body.size_w;
    var size_l = req.body.size_l;
    var size_h = req.body.size_h;
    var weight = req.body.weight;
    var disclosure = req.body.disclosure;
    var price = req.body.price;
    var comment = req.body.comment;

    var request = new Request({ sender_id: sender_id,
        type: type,
        hasAccept: hasAccept,
        recipient_name: recipient_name,
        recipient_email: recipient_email,
        recipient_tel: recipient_tel,
        img: img,
        size_w: size_w,
        size_l: size_l,
        size_h: size_h,
        weight: weight,
        disclosure: disclosure,
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
    var img = req.body.img;
    var size_w = req.body.size_w;
    var size_l = req.body.size_l;
    var size_h = req.body.size_h;
    var weight = req.body.weight;
    var disclosure = req.body.disclosure;
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
        img: img,
        size_w: size_w,
        size_l: size_l,
        size_h: size_h,
        weight: weight,
        disclosure: disclosure,
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

    router.get('/request/get/:request_id',function(req, res, next){
        var request_id = req.params.request_id;
        Request.find({_id: request_id}, function(err, trackings) {
            if (err) {
                res.status(HTTP_INTERNAL_SERVER_ERROR).send();
            }
            res.send(trackings);
        })
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
        var messenger_id = req.body.messenger_id;
        var date = req.body.date;
        var time = req.body.hour+":"+req.body.min;
        Request.findOneAndUpdate({_id: _id, type: 'Pending'}, {type: 'Reserved', messenger_id: messenger_id, appointDate: date, appointTime: time}, function(err, data) {
            if (err)
            return res.send(500, { error: err });
            return res.send();
        });
    });

    router.post('/request/cancel/:request_id', function(req, res, next) {
        var _id = req.params.request_id;

        Request.findOneAndUpdate({_id: _id, type: 'Reserved'}, {type: 'Pending', messenger_id: null, appointDate: null, appointTime: null}, function(err, data) {
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


    // ================== Tracking ==================

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
        messenger_id: String,
        date: {
            type: String,
            default: Date.now() // `Date.now()` returns the current unix timestamp as a number
        }
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

    router.post('/mailservice', function(req, res, next) {
        var api_key = 'key-b233bd5306bce63c6df7e975b27cd00d';
        var domain = 'nop.rorpap.com';
        var mailgun = new Mailgun({apiKey: api_key, domain: domain});
        var data = {
          from: 'no-reply@rorpap.com',
          to: req.body.email,
          subject: req.body.topic,
          html: req.body.html
        }
        mailgun.messages().send(data, function (err, body) {
            if (err) {
                console.log("got an error: ", err);
            }
            else {
                console.log('Success');
                console.log(body);
            }
        });
        res.send('test mail');
    });

    // ================== GCM ==================

    var GCM = mongoose.model('gcms', {
        user_id: String,
        token: String,
        date: {
            type: String,
            default: Date.now() // `Date.now()` returns the current unix timestamp as a number
        }
    });

    router.post('/gcm/register', function(req, res, next) {
        var user_id = req.body.user_id;
        var token = req.body.token;

        var gcm = new GCM({user_id: user_id, token: token});
        GCM.remove({user_id: user_id}, function(err) {
            if (err) {
                res.status(HTTP_INTERNAL_SERVER_ERROR).send();
            }
            else {
                gcm.save(function(err) {
                    if (err) {
                        res.status(HTTP_INTERNAL_SERVER_ERROR).send();
                    }
                    res.status(HTTP_CREATED).send();
                });
            }
        });
    });

    router.post('/gcm/push', function(req, res, next) {
        var type = req.body.type;
        var signal = req.body.signal;
        var title = req.body.title;
        var content = req.body.content;
        var user_id = req.body.user_id;
        // var device_tokens = req.body.device_tokens;
        GCM.distinct("token", {user_id: user_id}, function(err, data) {
            var device_tokens = data;

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
    });

    // ================== File ==================

    var File = mongoose.model('files', {
        user_id: String,
        filename: String,
        type: Number, // 0 avartar, 1 doc
        provedDate: Date,
        date: {
            type: String,
            default: Date.now() // `Date.now()` returns the current unix timestamp as a number
        }
    });

    var util = require('util');
    var path = require('path');
    var multer  = require('multer');

    router.post('/file/upload', function(req, res, next) {
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, 'public/uploads/');
            },
            filename: function (req, file, cb) {
                cb(null, Date.now() + path.extname(file.originalname));
            }
        });
        var upload = multer({ storage: storage }).single('file');

        upload(req, res, function (err) {
            if (err) {
                console.log("err: " + err);
                return "err";
            }
            console.log(util.inspect(req.file.filename, false, null));
            res.send(req.file.filename);
        });
    });

    router.post('/file/save', function(req, res, next) {
        var user_id = req.body.user_id;
        var filename = req.body.filename;
        var type = req.body.type;

        var file = new File({user_id: user_id, filename: filename, type: type});

        file.save(function(err) {
            if (err) {
                res.status(HTTP_INTERNAL_SERVER_ERROR).send();
            }
            res.status(HTTP_CREATED).send();
        });
    });

    router.post('/file/get', function(req, res, next) {
        var user_id = req.body.user_id;
        var type = req.body.type;

        File.findOne({user_id: user_id, type: type}, null, {sort: {_id: -1}}, function(err, file) {
            if (err) {
                res.status(HTTP_INTERNAL_SERVER_ERROR).send();
            }
            else {
                res.send(file);
            }
        });
    });

    module.exports = router;
