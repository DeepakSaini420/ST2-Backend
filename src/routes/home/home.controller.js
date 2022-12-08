const conn = require('../../database');

function homePage(req,res){

    if(!req.user) return res.status(401).json({error:"user not found!"});

    conn.query(`SELECT * FROM post`,(err,result)=>{
        if(err){
            console.log(err);
        }
        return res.status(200).json({
            data:result
        })
    })

}

module.exports={
    homePage
}