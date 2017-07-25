'use strict';

const express = require('express');
var router = express.Router();
const jwt = require('express-jwt');
const jwks = require('jwks-rsa');
var  cors = require('cors');
const bodyParser = require('body-parser');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var app = express();

var mongojs = require('mongojs');
var db = mongojs('mongodb://prasadsuvarapu:prasadc85!@ds121543.mlab.com:21543/consensus', ['community','tenant','user']);

app.options('*', cors());
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function(req, res, next) {
   // res.header("Access-Control-Allow-Origin", "*");
   // res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

const authCheck = jwt({
    secret: jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://ramani.auth0.com/.well-known/jwks.json"
    }),
    audience: 'http://localhost:3001/api/',
    issuer: "https://ramani.auth0.com/",
    algorithms: ['RS256']
});




var  userId;var communityId;


app.get('/api/viewCommunities/:user_id', function(req, res) {

console.log(req.params.user_id+"  id is hre")


    db.community.findOne({'postBy.userId' : req.params.user_id},function(err,user) {

        if (err){
            console.log(err);
            return err;}

        else{
          try {
              communityId = user._id;
              console.log(communityId);
              res.json(user);
          }
          catch(err) {
              console.log("exception occured for community" );
              res.json(user);
          }
        }

    });

});

/**** Add Users  *****/

app.post('/api/addUSer', function(req, res) {

   // console.log(req.body);
    var userInfo=req.body;
   db.user.findOne({ 'userId' :req.body.userId }, function(err,user) {

        if (err){
            console.log(err);
            return err;}
        // if there is no user found with that facebook id, create them
        if(user){
            console.log(" ******** This is existing user");
            userId=user.userId;
            console.log(userId);
            return user;
        }
        else{

            db.user.save(userInfo, function(err, result) {
                if (err) {
                    res.send(err);
                } else {
                    res.json(result);
                }
            })

        }

    });

});

//enter UserID
app.post('/api/addCommunity', function(req, res) {

   // console.log("post call"+JSON.stringify(req.body));
   // req.body= {"usermodelname" : "Hashtag"};
    var todo = req.body;


    /*if (!todo.text || !(todo.isCompleted + '')) {
        res.status(400);
        res.json({
            "error": "Invalid Data"
        });
    } else {*/
        db.community.save(todo, function(err, result) {
            if (err) {
                res.send(err);
            } else {
                res.json(result);
            }
        }
        );
   // }
});

// Tenant  REST-CALLs ...
//pass communityID
app.post('/api/addTenant', function(request, response) {
   /* var todo = new Tenant({
        firstName: request.body.firstName,
        lastName: request.body.lastName,
        Email: request.body.Email, female:request.body.female, male:request.body.male,
        married:request.body.married,
        notMarried:request.body.notMarried,
        pet:request.body.pet,
        smoke:request.body.smoke,
        PhoneNumber:request.body.PhoneNumber,
        dependants:request.body.dependants,
        community_id :community_id
    });*/
    var addTenant = request.body;



    db.tenant.save(addTenant, function(err, returned_value){
        if(err){
            response.json({status: 'failed', err: err})
        }
        else{

            //response.json({status: 'success'})

            response.json(returned_value);

            }

    });

});


app.get('/api/tenant/:communityId', function(request, response) {

    db.tenant.find({ 'community_id' :request.params.communityId }, function(err, returned_value){
        if(err){
            response.json({status: 'failed', err: err})
        }
        else{
            console.log(JSON.stringify(returned_value));
            response.json(returned_value);
        }
    });
});

app.put('/api/editTenant/:id', function(request, response) {

    var editTenant = request.body;

    console.log("AFter ************" +request.body.firstName) ;

    db.tenant.findOne({ '_id' :request.params.id }, function(err,tenant) {

        if (err){
            console.log(err);
            return err;
        }
        // if there is no user found with that facebook id, create them

        else{

            db.tenant.save(editTenant, function(err, result) {
                if (err) {
                    console.log(err)
                    response.send(err);
                } else {
                    console.log(JSON.stringify(result))
                    response.json(result);
                }
            })


        }

    });



});


app.get('/api/viewTenant/:id', function(request, response) {

console.log(request.params.id);

    db.tenant.findOne({ '_id' :request.params.id }, function(err,result) {

        if (err){
            console.log(err);
            return err;
        }

        else{


                    console.log(JSON.stringify(result))
                    response.json(result);


        }

    });

});

/*

app.get('/api/deals/private', authCheck, (req,res)=>{
  let deals = [
  {
    id: 14423,
    name: 'Tesla S',
    description: 'Ride in style and say goodbye to paying for gas. The Tesla S is the car of the future.',
    originalPrice: 90000.00,
    salePrice: 75000.00
  },
  {
    id: 14553,
    name: 'DJI Phantom 4',
    description: 'The Drone revolution is here. Take to the skies with the DJI Phantom 4.',
    originalPrice: 1299.99,
    salePrice: 749.99
  },
  {
    id: 15900,
    name: 'iPhone 7 - Jet Black',
    description: 'Get the latest and greatest iPhone in the limited edition jet black.',
    originalPrice: 899.99,
    salePrice: 799.99
  },
  {
    id: 16000,
    name: '70" Samsung 4K HDR TV',
    description: 'Watch as if you were there with the latest innovations including 4K and HDR.',
    originalPrice: 2999.99,
    salePrice: 2499.99
  },
  {
    id: 17423,
    name: 'Canon t8i DSLR',
    description: 'Capture life\'s moments with the amazing Canon t8i DSLR',
    originalPrice: 999.99,
    salePrice: 549.99
  },
  {
    id: 17423,
    name: 'Xbox One S',
    description: 'Get the latest Xbox and play the best first party games including Gears of War and Forza.',
    originalPrice: 299.99,
    salePrice: 279.99
  },
  ];
  res.json(deals);
})*/

app.listen(3001);
console.log('Listening on localhost:3001');