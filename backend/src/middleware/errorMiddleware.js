function errorMiddleware(err,req,res,next){
    const statuscode=err.statuscode||500;
    res.status(statuscode).json({success:true,message:err.message});
   
}
module.exports=errorMiddleware;