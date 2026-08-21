const AppError = require("../utils/AppError")

function roleMiddleware(...roles){
    return function(req,res,next){
        if(!roles.includes(req.user.role)){
            return next(new AppError("access denied",303))
        }
        next();
    };
}
module.exports=roleMiddleware;