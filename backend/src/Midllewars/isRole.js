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
    if(user.role=='Client'){
        next()
    }else{
        return res.status(401).json({msg : " this function needs client priviliege"})
    }
}
export const isCashier=async (req,res,next)=>{
    const user=req.user;
    if(user.role=='Cashier'){
        next()
    }else{
        return res.status(401).json({msg : " this function needs cashier priviliege"})
    }
}