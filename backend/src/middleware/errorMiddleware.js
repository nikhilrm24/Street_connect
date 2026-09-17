function errorMiddleware(err,req,res,next){
    console.log(err);
    const statuscode=err.statuscode||500;
    res.status(statuscode).json({success:true,message:err.message});
   
}
module.exports=errorMiddleware;