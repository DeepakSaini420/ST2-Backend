const jwt = require('jsonwebtoken');

function checkAuth(req,res,next){
    const token = req.body.token || req.query.token || req.headers.token;
    try{
        const decodedUser = jwt.verify(token,'91fb4a1eb49d425f8b11dff771685887');
        req.user = decodedUser;
    }catch(err){
        return res.status(401).json({
            error:"Invalid Token"
        })
    }
    return next();
}

module.exports = {
    checkAuth
}