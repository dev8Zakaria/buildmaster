import prismaClient from '../server.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import env from 'dotenv'


env.config();

export const signup =async (req,res)=>{
    const {email,firstName,lastName,password}=req.body;
    const validRoles = ['Admin', 'Customer', 'Cashier'];
    let userRole = req.body.role || 'Customer';
    userRole = userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase();
    if (!validRoles.includes(userRole)) return res.status(400).json({msg: `Invalid role. Allowed roles: ${validRoles.join(', ')}`});
        

    let user=await prismaClient.user.findFirst({where:{email}});
    if(user) return res.status(400).json({msg : "this email is already used"})
    user = await prismaClient.user.create({
        data:{
            email,
            firstName,
            lastName,
            password: await bcrypt.hash(password,10),
            role :userRole
        }
    })
    res.json(user);

}

export const login = async (req,res)=>{
    const {email,password}=req.body;
    let user=await prismaClient.user.findFirst({where:{email}})
    if(!user) return res.status(404).json({msg : "there is no user with this email"})
    const match=await bcrypt.compare(password,user.password);
    if(!match) return res.status(403).json({msg:"the password is incorrect"})
    const token = jwt.sign(
        {
            userInfo:{
                firstName: user.firstName,
                userEmail : user.email,
                userRole : user.role
            }
        },
        process.env.ACCES_TOKEN_SECRET,
        {expiresIn : '1h'}
    )
    res.status(200).json({token});
}

