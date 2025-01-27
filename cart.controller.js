     import { cartProd } from "./cart.model.js";


     var obj;
     export class cartController{
              
        static create(req,res,next){
            
             obj=new cartProd(req.query.ProId,req.query.quan);

        }

        static add(req,res,next){
           try{
                
            obj.addProd(req,res,next);

           }catch(err){
                  res.status(404).send("You cannot add Product  when cart is not created.")
           }
        }

        static rem(){
            try{
               obj.remProd(req,res,next);
            }
            catch(err){
                  res.status(404).send("You cannot remove Product when your cart is empty or when cart is not created.")
            }

        }
            

     }