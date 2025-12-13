import prismaClient from '../Config/prisma.js'
import jwt from 'jsonwebtoken'
import env from 'dotenv'
env.config();

export const authMidlleware=async (req,res,next)=>{
    const authHeader=req.headers.authorization || req.headers.Authorization;
    if(!authHeader) return res.status(400).json({msg : "the token is not there"});
    const token=authHeader.split(' ')[1];
    const payload=jwt.verify(token,process.env.ACCES_TOKEN_SECRET);
    const user = await prismaClient.user.findFirst({where:{email:payload.userInfo.userEmail}})
    if(!user) return res.status(403).json({msg:"the user dosn't exist with this token"});
    req.user=user;
    next()
}