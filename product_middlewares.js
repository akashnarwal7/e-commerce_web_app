import { product_controller } from "../products/product_controller.js";
import { prod_model } from "../products/products.model.js";
import multer from 'multer';
import { user } from "../user/user.model.js";
import fs from 'fs';
import winston, { createLogger, format, transports } from 'winston';
const {    colorize,combine, timestamp, label, prettyPrint ,printf} = format;
import { Application_err } from "../../../Application_error.js";


export function getProd_mw(req,res,next){

       var prod=prod_model.getProducts();
       res.status(200).send(prod);
}




       
   
   var storage_config=multer.diskStorage({
        destination:(req,file,cb)=>{
                try{
                    cb(null,"./public/images");
                }
                catch(err){
                   throw new Application_err("something went wrong.",404); 
                   console.log("something went wrong.")
                }
        }
,
        filename:(req,file,cb)=>{
             try{
               var name=Date.now()+"_"+file.originalname;
             }
             catch(err){
                throw new Application_err("something went wrong.",404);
                 console.log("error in configuration of multer.")
             }
        }
   });




   export var upload=multer({Storage:storage_config});


export function addProd_mw(req,res,next){

         let data=req.body;
         var imageUrl="images/"+req.file.filename;
         var len=prod_model.getProducts().length;
         var newProd=new prod_model(len+1,data.name,data.des,data.price,imageUrl,data.category,data.sizes.split(','));
         var prod=prod_model.getProducts();
         prod.push(newProd);
         console.log("products are:")
         console.log(prod_model.getProducts());

}


export function getSingleProd_mw(req,res,next){
       
     let id=req.params.id;
     var products=prod_model.getProducts();
     var Prod=products.find(ele=>ele.id==id)
     if(Prod){
      res.send(Prod)
     }
     else{
      throw new Application_err("NOT FOUND",404);    
     }
}


export function filter_mw(req,res,next){
           
       
       var cat=req.query.category;
       var minPrice=parseFloat(req.query.minPrice);
       var maxPrice=parseFloat(req.query.maxPrice);
       var products=prod_model.getProducts();
       var filtered_Prod=products.filter(ele=>ele.category==cat && ele.price>=minPrice && ele.price<=maxPrice)
       if(filtered_Prod){
            res.status(200).send(filtered_Prod);
       }
       else{
          throw new Application_err("No Results Found",404)
       }

}

export function rate_mw(req,res,next){
            
        // validate data
        // i.e validate Product.
        let productId=req.query.product;
        let userId=req.query.userId;
        let rating=req.query.rating;
        var products=prod_model.getProducts();

        var product=products.find((ele)=>{return ele.id==productId});
        if(!product){
             
          throw new Application_err("Incorrect Product Details.",404) 
        } 
        else{
          // check whether the product has a rating array or not.
          // if there is no such array .create it.
          if(!product.ratings){
                       product.ratings=[];
                       product.ratings.push({userId:rating}); 
          }
          else{
               // if not check whether user actually rated this product.
               // if ,so update it.
               // if not push the data.
               var ratedIndex=product.ratings.findIndex((ele)=>{return ele.userId==userId});
               if(ratedIndex){
               product.ratings[ratedIndex].rating=rating;
               }
               else{
                    product.ratings.push({userId:rating});
               }

          }



          res.status(200).send("Rated Succesfully.");
        }

}


// a built in middleware to logging.




     export const logger=createLogger({

          level:'info',
          format:combine(
               label({ label:"User Data" }),
               timestamp(),
               winston.format.align(),
               printf(({ level, message, label, timestamp }) => {
                    return `${timestamp} [${label}]     : ${level}:    ${message}`;
                  })

               ),
          transports:[new transports.File({
               filename:"log.txt",
               level:"info"
          })]
     })







var fsPromise=fs.promises;






export async function  log(req,logData,user_obj){

              



               if((!req.url.includes("signIn") & !req.url.includes("signUp")) || logData=="Logged In"  || logData=="Sign Up SuccessFull"){  
               if(user_obj!=null){
                    logData="\n --TIME :"+new Date().toString()+` --Method: ${req.method}`+"  --URL :"+req.url+ " --USER_EMAIL: "+user_obj.email+" --USER_NAME: "+user_obj.name+"   --STATUS:  "+logData;  
               }  
               else{
                     logData="\n --TIME :"+new Date().toString()+` --Method: ${req.method}`+"  --URL :"+req.url+  "   --DATA:  "+JSON.stringify(logData);
               }
                 try{
                // await fsPromise.appendFile("log.txt",logData);
                 logger.info(logData);
                  
                 
                 console.log("Data has been Logged Succesfully.")
                 }
                 catch(err){
                    logger.error("An Error Log"+err);
                    console.log("an Error has Occured."+err);
                 }
               }
               else{

                    try{
                         if(req.url.includes("signIn")){
                            logData="Tried to Log In.";
                         }
                         else{
                         logData="Tried to Sign Up.";
                         }
                         var logData="\n --TIME :"+new Date().toString()+`Method: ${req.method}`+"  --URL :"+req.url+  "   --EMAIL:  "+`${req.body.email}`+" --STATUS: "+logData;
                        // await fsPromise.appendFile("log.txt",logData);
                        logger.info(logData);
                         console.log("Data has been Logged Succesfully.")
                         }
                         catch(err){
                              logger.error("An error Log"+err);
                            console.log("an Error has Occured."+err);
                         }

               }

            
                  

}

export function log_middleware(req,res,next){
             log(req,req.body,null);
             next();
}