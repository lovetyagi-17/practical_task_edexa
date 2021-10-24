const jwt = require('jsonwebtoken');
const CONFIG = require('../config/default.json');

 // Generates a token from supplied payload
 module.exports.issueToken = function(payload) {
   return jwt.sign(
     payload,
     CONFIG.JWT_OPTIONS.SECRET_KEY, // Token Secret that we sign it with
     {
       expiresIn: '7d', //3600 in minutes // Token Expire time //7d
     }
   );
 };

 // Verifies token on a request
 function verifyToken (token, callback) {
   return jwt.verify(
     token, // The token to be verified
     CONFIG.JWT_OPTIONS.SECRET_KEY, // Same token we used to sign
     {}, // No Option, for more see https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
     callback //Pass errors or decoded token to callback
   );
 };


 module.exports.isAuthorizedToken = function(req, res, next) {
     var token;
     if (req.headers && req.headers.authorization) {
       token = req.headers.authorization;
       let tokenData = token.split(' ');
       if(tokenData.length !=2 || tokenData[0]!="Bearer"){
         return res.json({ status: "Failure", code: 401, msg: 'Invalid token found' });
       }
       token = tokenData[1];
     }else {
       return res.json({ status: "Failure", code: 401, msg: 'No Authorization header was found' });
     }

     verifyToken(token, function (err, token) {
       console.log(err,token)
       if (err) {
         return res.json({ status: "Failure", code: 401, msg: 'Invalid Token!' });
       }
       req.access_token = token; // This is the decrypted token or the payload you provided
       next();
     });
 };
