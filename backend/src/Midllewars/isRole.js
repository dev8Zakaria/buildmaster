export const isAdmin=async (req,res,next)=>{
    const user=req.user;
    if(user.role=='Admin'){
        next()
    }else{
        return res.status(401).json({msg : " this function needs admin priviliege"})
    }
}
export const isClient=async (req,res,next)=>{
    const user=req.user;
    if(user.role=='Customer'){
        next()
    }else{
        return res.status(401).json({msg : " this function needs client priviliege"})
    }
}