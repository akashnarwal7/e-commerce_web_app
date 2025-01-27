// generally basic authentication means verifying credentials for every request.
// Actually we can use login pages before every request. but that may cause Incovenience to the user .
// so during login we set credentials to the authorization header.
// every time in the  request body we will collect the credentials in authorization headers.
import { user } from "../user/user.model.js";
import jwt from "jsonwebtoken";

export function auth(req,res,next){
    // to perform authentication .
    // step-1: check whether authorization header is empty.If it is empty then user is not logged in.
    // syntax req.headers(['authorization'])
    var auth_header=req.headers['authorization'];
    if(!auth_header){
           res.status(404).send("You are not Logged in."); 
    }
    else{
        // step-2: Get the base64 credentials from the header.
        var base64Cred=auth_header.replace('Basic','');
        // step-3: decode the credentials.
        // syntax:Buffer.from(base64Cred,'base64').toString('utf8')
        var decod_cred=Buffer.from(base64Cred,"base64").toString('utf-8');
        //step-4:verify the credentials now.
        // because decod_Cred has credentials seperated with column.
        var cred=decod_cred.split(':');
        // decod_cred will have data as [userName,Password]
        var  userName=cred[0];
        var  password=cred[1];
        var users=user.getUsers();
        var validUser=users.find(ele=>{  return ele.email==userName && ele.password==password });
        if(validUser){
            res.status(200).send(validUser);
        }
        else{
            res.status(404).send("Invalid Credentials.")
        }
    }


}

// now to use jwts 
// we follow these steps.
// step-1: creating a jwt token during login.
// to do that we need to install jwt.
// step-2: using sign() method we can create a jwt token.
// in sign we need to mention secret key, payload 
// we can also mention expires and type of jwt algorithim or encryption algo we want to use or we can use default.
// syntax to create token jwt.token({"userName":"akash","admin":true},secret key ,{expiresIn:'2days or 2h'})
// {"userName":"akash","admin":true} ===> payload.
// we need to send this as response to client.

// when ever token i recieved from client we need to verify is it a token or not.
// step-1:check authorization header has token or not.
// read header using req.headers['authorization'];
// step-2: verify token is modified or expired.
// if any changes in token occurs then jwt.verify() will throw an error.
// if no error it will give you payload.
// if payload is recieved means token is valid and credentials are correct.
// call next();


export function ver_token(req,res,next){
      
    var token=req.headers['authorization']
    if(!token){
       res.status(404).send("You are not logged in")
    }
    else{
        try{
       var payload= jwt.verify(token,"*W+7mr_!vrN2:L4");
       req.userId=payload.userId;
       next();
        }
        catch(err){
             res.status(201).send("Unathorized Acsess")
        }
    }

}

