const conn = require("../../database");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config({path:"D:/TimePass/BEE/ST2/src/.env"})

async function signUp(req,res){
    
    const { username,fname,gender,password,phoneNo } = req.body;

    console.log(req.body)

    if(!username || !fname || !gender || !password || !phoneNo){
        return res.status(400).json({
            error:"Please Enter Your Details Correctly"
        })
    }

    conn.query(`SELECT * FROM user WHERE username='${username}'`, async (err,result)=>{
        if(err){
            console.log(err)
        }else{
            const pass = await bcrypt.hash(password,10);
            if(result.length === 0){
                conn.query(`INSERT INTO user (username,fname,gender,passwords,phone_no) VALUES ('${username}','${fname}','${gender}','${pass}','${phoneNo}')`,async (err,result)=>{
                    console.log(err)
                    if(!err){
                        return res.status(201).json({
                            success:"User Added Successfull",
                        })
                    }
                })
            }else{
                return res.status(401).json({
                    error:"User Already Present"
                })
            }
        }
    })

}

async function login(req,res){

    const { username,password } =req.body;
    const { token } = req.headers || '';

    if(!username || !password){
        return res.status(401).json({
            error:"Please Enter Details Correctly!"
        })
    }

    conn.query(`SELECT * FROM user WHERE username='${username}'`,(err,result)=>{
        if(err){
            console.log(err)
        }else{
            if(result.length > 0 ){
                const user ={
                    username:result[0].username,
                    password:result[0].passwords,
                    fname:result[0].fname,
                    phone_no:result[0].phone_no,
                    gender:result[0].gender
                };
                bcrypt.compare(password,user.password,async (err,result)=>{
                    if(err){
                        console.log(err);
                    }
                    if(result){
                        try {
                            const decodedUser = jwt.verify(token,'91fb4a1eb49d425f8b11dff771685887');
                            return res.status(200).json({
                                user:decodedUser
                            })
                        } catch (err) {
                            const newToken = jwt.sign(user,'91fb4a1eb49d425f8b11dff771685887',{
                                expiresIn:'24h'
                            })
                            return res.status(200).json({
                                user,
                                newToken
                            });
                        }
                    }else{
                        return res.status(404).json({error:"Please Enter Your Password correctly!"})
                    }
                })
            }else{
                return res.status(404).json({error:"User Not Found!"})
            }
        }
    })
}

function changePassword(req,res){

    const { user } = req;
    const { oldPassword,newPassword } = req.body;

    if(!user){
        return res.status(401).json({
            error:"Please Check JWT Token"
        })
    }

    if((!oldPassword || !newPassword) && (oldPassword !== newPassword)) return res.status(200).json({error:"Please Enter All Details!"});

    bcrypt.compare(oldPassword,user.password,async(err,result)=>{
        if(err){
            console.log(err);
        }
        if(result){
            const pass = await bcrypt.hash(newPassword,10);
            conn.query(`UPDATE user SET passwords='${pass}' WHERE username='${user.username}'`,(err,result)=>{
                if(err){
                    console.log(err);
                }else{
                    return res.status(201).json({success:"Password Changed!"});
                }
            })
        }else{
            return res.status(200).json({error:"Your Password is Not Correct!"});
        }
    })
}

function checkToken(req,res){
    const token = req.body.token || req.query.token || req.headers.token;
    try{
        const decodedUser = jwt.verify(token,'91fb4a1eb49d425f8b11dff771685887');
        return res.status(200).json({
            user:decodedUser,
            message:"Token Valid"
        })
    }catch(err){
        return res.status(401).json({
            error:"Invalid Token"
        })
    }

}

module.exports = {
    signUp,
    login,
    changePassword,
    checkToken
}