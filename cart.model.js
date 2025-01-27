export class cartProd{

    // Product Id,cart Id,quantity
    constructor(ProId,quan){

       this.cart.push({ProId:ProId,quan:quan,userId:req.userId});
       this.cartId=cartItems.length+1;
       cartItems.push(this.cart)
    }
    
    // we can add
    addProd(req,res,next){
        var ProId=req.query.ProId;
        var quan=req.query.quan;
        var userId=req.userId;
        var cartItem={ProId:ProId,quan:quan,userId:req.userId};
        this.cart.push(cartItem);
    }

    // we can remove .
    delProd(){
        var ProId=req.query.ProId;
        var quan=req.query.quan;
        var userId=req.userId;
         var cartId=this.cartId;
         this.cart=this.cart.filter((ele)=>{return ele.ProId!=ProId});

    }
}
var cartItems=[]; 